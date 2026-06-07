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

export type PortfolioProject = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  linkUrl: string | null;
  tags: string[];
  year: string | null;
  sortOrder: number;
  active: boolean;
};

export type PortfolioPublicData = {
  portraitUrl: string | null;
  portraitObjectPosition: string;
  portraitZoom: number;
  resumeUrl: string | null;
  phone: string | null;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  location: string | null;
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
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

const mapProject = (row: any): PortfolioProject => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  description: row.description,
  linkUrl: row.link_url,
  tags: row.tags ?? [],
  year: row.year,
  sortOrder: row.sort_order,
  active: row.active,
});

const fetchPortfolioData = async (supabaseAdmin: any) => {
  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("portfolio_settings")
    .select("portrait_path, portrait_object_position, portrait_zoom, resume_path, phone, email, github_url, linkedin_url, location")
    .eq("id", "main")
    .maybeSingle();
  if (settingsError) throw new Error(settingsError.message);

  const { data: skillRows, error: skillsError } = await supabaseAdmin
    .from("portfolio_skills")
    .select("id, label, category, sort_order, active")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  if (skillsError) throw new Error(skillsError.message);

  const { data: projectRows, error: projectError } = await supabaseAdmin
    .from("portfolio_projects")
    .select("id, title, subtitle, description, link_url, tags, year, sort_order, active")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (projectError) throw new Error(projectError.message);

  return {
    portraitUrl: await signedUrl(supabaseAdmin, settings?.portrait_path),
    portraitObjectPosition: settings?.portrait_object_position ?? "50% 0%",
    portraitZoom: Number(settings?.portrait_zoom ?? 1),
    resumeUrl: await signedUrl(supabaseAdmin, settings?.resume_path),
    phone: settings?.phone ?? null,
    email: settings?.email ?? null,
    githubUrl: settings?.github_url ?? null,
    linkedinUrl: settings?.linkedin_url ?? null,
    location: settings?.location ?? null,
    skills: (skillRows ?? []).map((row: any) => ({
      id: row.id,
      label: row.label,
      category: row.category,
      sortOrder: row.sort_order,
      active: row.active,
    })),
    projects: (projectRows ?? []).map(mapProject),
  };
};

export const getPublicPortfolio = createServerFn({ method: "GET" }).handler(async (): Promise<PortfolioPublicData> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const data = await fetchPortfolioData(supabaseAdmin as any);
  return {
    ...data,
    skills: data.skills.filter((s: PortfolioSkill) => s.active),
    projects: data.projects.filter((p: PortfolioProject) => p.active),
  };
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
    const { error } = await (supabaseAdmin as any).from("user_roles").insert({ user_id: context.userId, role: "admin" });
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
        phone: z.string().max(40).nullable().optional(),
        email: z.string().max(255).nullable().optional(),
        githubUrl: z.string().max(500).nullable().optional(),
        linkedinUrl: z.string().max(500).nullable().optional(),
        location: z.string().max(120).nullable().optional(),
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
    if ("phone" in data) payload.phone = data.phone;
    if ("email" in data) payload.email = data.email;
    if ("githubUrl" in data) payload.github_url = data.githubUrl;
    if ("linkedinUrl" in data) payload.linkedin_url = data.linkedinUrl;
    if ("location" in data) payload.location = data.location;

    const { error } = await (supabaseAdmin as any).from("portfolio_settings").upsert(payload, { onConflict: "id" });
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

export const savePortfolioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid().optional(),
        title: z.string().trim().min(1).max(150),
        subtitle: z.string().trim().max(200).nullable().optional(),
        description: z.string().trim().max(2000).nullable().optional(),
        linkUrl: z.string().trim().max(500).nullable().optional(),
        tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
        year: z.string().trim().max(20).nullable().optional(),
        sortOrder: z.number().int().min(0).max(9999).default(0),
        active: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) throw new Error("Admin access required.");
    const payload: Record<string, unknown> = {
      ...(data.id ? { id: data.id } : {}),
      title: data.title,
      subtitle: data.subtitle ?? null,
      description: data.description ?? null,
      link_url: data.linkUrl ?? null,
      tags: data.tags,
      year: data.year ?? null,
      sort_order: data.sortOrder,
      active: data.active,
      updated_by: context.userId,
    };
    const { error } = await (supabaseAdmin as any).from("portfolio_projects").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePortfolioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roleState = await getAdminRoleState(supabaseAdmin as any, context.userId);
    if (!roleState.isAdmin) throw new Error("Admin access required.");
    const { error } = await (supabaseAdmin as any).from("portfolio_projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
