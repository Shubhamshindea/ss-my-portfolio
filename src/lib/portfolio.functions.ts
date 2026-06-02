import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "portfolio-assets";

export type PortfolioSkill = {
  id: string;
  label: string;
  category: string;
  sortOrder: number;
  active: boolean;
};

export type PortfolioPublicData = {
  portraitUrl: string | null;
  portraitObjectPosition: string;
  portraitZoom: number;
  resumeUrl: string | null;
  skills: PortfolioSkill[];
};

const signedUrl = async (supabaseAdmin: any, path?: string | null) => {
  if (!path) return null;
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error) {
    console.error("[portfolio] signed url failed", { path, message: error.message });
    return null;
  }
  return data?.signedUrl ?? null;
};

const getAdminRoleState = async (supabaseAdmin: any, userId: string) => {
  const { count: adminCount, error: countError } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (countError) throw new Error(countError.message);

  const { data: role, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (roleError) throw new Error(roleError.message);

  return { isAdmin: Boolean(role), canClaimAdmin: (adminCount ?? 0) === 0 };
};

const fetchPortfolioData = async (supabaseAdmin: any): Promise<PortfolioPublicData & { portraitPath?: string | null; resumePath?: string | null }> => {
  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("portfolio_settings")
    .select("portrait_path, portrait_object_position, portrait_zoom, resume_path")
    .eq("id", "main")
    .maybeSingle();
  if (settingsError) throw new Error(settingsError.message);

  const { data: rows, error: skillsError } = await supabaseAdmin
    .from("portfolio_skills")
    .select("id, label, category, sort_order, active")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  if (skillsError) throw new Error(skillsError.message);

  const skills = (rows ?? []).map((row: any) => ({
    id: row.id,
    label: row.label,
    category: row.category,
    sortOrder: row.sort_order,
    active: row.active,
  }));

  return {
    portraitUrl: await signedUrl(supabaseAdmin, settings?.portrait_path),
    portraitObjectPosition: settings?.portrait_object_position ?? "50% 0%",
    portraitZoom: Number(settings?.portrait_zoom ?? 1),
    resumeUrl: await signedUrl(supabaseAdmin, settings?.resume_path),
    portraitPath: settings?.portrait_path ?? null,
    resumePath: settings?.resume_path ?? null,
    skills,
  };
};

export const getPublicPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const data = await fetchPortfolioData(supabaseAdmin as any);
  return {
    portraitUrl: data.portraitUrl,
    portraitObjectPosition: data.portraitObjectPosition,
    portraitZoom: data.portraitZoom,
    resumeUrl: data.resumeUrl,
    skills: data.skills.filter((skill) => skill.active),
  } satisfies PortfolioPublicData;
});

export const getAdminPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) return { ...roleState, portfolio: null };
    return { ...roleState, portfolio: await fetchPortfolioData(supabaseAdmin as any) };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.canClaimAdmin) throw new Error("Admin access is already assigned.");

    const { error } = await (supabaseAdmin as any).from("user_roles").insert({
      user_id: context.userId,
      role: "admin",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updatePortfolioSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        portraitPath: z.string().max(500).nullable().optional(),
        portraitObjectPosition: z.string().min(3).max(30).optional(),
        portraitZoom: z.number().min(1).max(1.8).optional(),
        resumePath: z.string().max(500).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) throw new Error("Admin access required.");

    const payload: Record<string, unknown> = { id: "main", updated_by: context.userId };
    if ("portraitPath" in data) payload.portrait_path = data.portraitPath;
    if (data.portraitObjectPosition) payload.portrait_object_position = data.portraitObjectPosition;
    if (typeof data.portraitZoom === "number") payload.portrait_zoom = data.portraitZoom;
    if ("resumePath" in data) payload.resume_path = data.resumePath;

    const { error } = await (supabaseAdmin as any)
      .from("portfolio_settings")
      .upsert(payload, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const savePortfolioSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid().optional(),
        label: z.string().trim().min(1).max(80),
        category: z.string().trim().min(1).max(80),
        sortOrder: z.number().int().min(0).max(9999),
        active: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) throw new Error("Admin access required.");

    const payload = {
      ...(data.id ? { id: data.id } : {}),
      label: data.label,
      category: data.category,
      sort_order: data.sortOrder,
      active: data.active,
      updated_by: context.userId,
    };
    const { error } = await (supabaseAdmin as any).from("portfolio_skills").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePortfolioSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) throw new Error("Admin access required.");

    const { error } = await (supabaseAdmin as any).from("portfolio_skills").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });