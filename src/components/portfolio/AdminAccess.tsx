import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Lock, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimFirstAdmin,
  deletePortfolioSkill,
  getAdminPortfolio,
  savePortfolioSkill,
  updatePortfolioSettings,
  type PortfolioSkill,
} from "@/lib/portfolio.functions";

const cropOptions = [
  { label: "Top", value: "50% 0%" },
  { label: "Center", value: "50% 50%" },
  { label: "Bottom", value: "50% 100%" },
];

export function AdminAccess() {
  const queryClient = useQueryClient();
  const getAdmin = useServerFn(getAdminPortfolio);
  const claimAdmin = useServerFn(claimFirstAdmin);
  const updateSettings = useServerFn(updatePortfolioSettings);
  const saveSkill = useServerFn(savePortfolioSkill);
  const deleteSkill = useServerFn(deletePortfolioSkill);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const { data, refetch } = useQuery({ queryKey: ["admin-portfolio"], queryFn: () => getAdmin(), retry: false });
  const portfolio = data?.portfolio;
  const skills = useMemo(() => portfolio?.skills ?? [], [portfolio?.skills]);

  const refresh = async () => {
    await Promise.all([refetch(), queryClient.invalidateQueries({ queryKey: ["portfolio-public"] })]);
  };

  const signIn = async (mode: "login" | "signup") => {
    setBusy(true);
    setMessage("");
    const action = mode === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await action({ email, password });
    setBusy(false);
    if (error) setMessage(error.message);
    else {
      setMessage(mode === "signup" ? "Check your email, then log in." : "Logged in.");
      await refresh();
    }
  };

  const uploadFile = async (file: File, kind: "portrait" | "resume") => {
    setBusy(true);
    const ext = file.name.split(".").pop() || (kind === "portrait" ? "png" : "pdf");
    const path = `${kind}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: true });
    if (error) setMessage(error.message);
    else {
      await updateSettings({ data: kind === "portrait" ? { portraitPath: path } : { resumePath: path } });
      setMessage(kind === "portrait" ? "Photo updated." : "Resume updated.");
      await refresh();
    }
    setBusy(false);
  };

  if (!data) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <Lock size={16} className="mb-2 text-gold" /> Admin access loads after login.
      </div>
    );
  }

  if (!data.isAdmin) {
    return (
      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium"><Lock size={16} className="text-gold" /> Admin access</div>
        <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={busy} onClick={() => signIn("login")} className="rounded-full bg-gold px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60">Login</button>
          <button disabled={busy} onClick={() => signIn("signup")} className="rounded-full border border-border px-4 py-2 text-xs disabled:opacity-60">Sign up</button>
        </div>
        {data.canClaimAdmin && <button disabled={busy} onClick={async () => { await claimAdmin(); await refresh(); }} className="text-xs text-gold hover:underline">Claim first admin</button>}
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium"><Lock size={16} className="text-gold" /> Admin editor</div>
        <button onClick={() => supabase.auth.signOut().then(refresh)} aria-label="Logout" className="text-muted-foreground hover:text-gold"><LogOut size={16} /></button>
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-gold"><Upload size={14} /> Change photo<input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "portrait")} /></label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-gold"><Upload size={14} /> Change resume<input hidden type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "resume")} /></label>
        <div className="grid grid-cols-3 gap-2">
          {cropOptions.map((option) => <button key={option.value} onClick={async () => { await updateSettings({ data: { portraitObjectPosition: option.value } }); await refresh(); }} className="rounded-md border border-border px-2 py-1.5 text-[10px] hover:border-gold">{option.label}</button>)}
        </div>
        <input type="range" min="1" max="1.8" step="0.05" defaultValue={portfolio?.portraitZoom ?? 1} onChange={async (e) => { await updateSettings({ data: { portraitZoom: Number(e.target.value) } }); await refresh(); }} className="w-full accent-gold" />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {skills.map((skill: PortfolioSkill) => <SkillRow key={skill.id} skill={skill} onSave={saveSkill} onDelete={deleteSkill} refresh={refresh} />)}
        <button onClick={async () => { await saveSkill({ data: { label: "New Skill", category: "General", sortOrder: skills.length * 10 + 10, active: true } }); await refresh(); }} className="flex items-center gap-2 text-xs text-gold"><Plus size={14} /> Add skill</button>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}

function SkillRow({ skill, onSave, onDelete, refresh }: { skill: PortfolioSkill; onSave: any; onDelete: any; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(skill);
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border border-border p-2">
      <input className="min-w-0 bg-transparent text-xs outline-none" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
      <button aria-label="Save skill" onClick={async () => { await onSave({ data: draft }); await refresh(); }} className="text-muted-foreground hover:text-gold"><Save size={14} /></button>
      <button aria-label="Delete skill" onClick={async () => { await onDelete({ data: { id: skill.id } }); await refresh(); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
    </div>
  );
}