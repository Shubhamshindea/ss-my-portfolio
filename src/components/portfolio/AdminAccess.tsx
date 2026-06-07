import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Lock, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  deletePortfolioProject,
  deletePortfolioSkill,
  getAdminPortfolio,
  savePortfolioProject,
  savePortfolioSkill,
  updatePortfolioSettings,
  type PortfolioProject,
  type PortfolioSkill,
} from "@/lib/portfolio.functions";

const cropOptions = [
  { label: "Top", value: "50% 0%" },
  { label: "Center", value: "50% 50%" },
  { label: "Bottom", value: "50% 100%" },
];

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold";

export function AdminAccess() {
  const queryClient = useQueryClient();
  const getAdmin = useServerFn(getAdminPortfolio);
  const updateSettings = useServerFn(updatePortfolioSettings);
  const saveSkill = useServerFn(savePortfolioSkill);
  const deleteSkill = useServerFn(deletePortfolioSkill);
  const saveProject = useServerFn(savePortfolioProject);
  const deleteProject = useServerFn(deletePortfolioProject);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
      setCheckedAuth(true);
    });
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: () => getAdmin(),
    retry: false,
    enabled: loggedIn,
  });
  const portfolio = data?.portfolio;
  const skills = useMemo(() => portfolio?.skills ?? [], [portfolio?.skills]);
  const projects = useMemo(() => portfolio?.projects ?? [], [portfolio?.projects]);

  const refresh = async () => {
    await Promise.all([refetch(), queryClient.invalidateQueries({ queryKey: ["portfolio-public"] })]);
  };

  const signIn = async () => {
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setLoggedIn(true);
    setMessage("");
    await refresh();
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

  if (!checkedAuth) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <Lock size={16} className="mb-2 text-gold" /> Admin access…
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lock size={16} className="text-gold" /> Admin login
        </div>
        <input className={inputCls} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={inputCls} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && signIn()} />
        <button disabled={busy || !email || !password} onClick={signIn} className="w-full rounded-full bg-gold px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60">
          {busy ? "Signing in…" : "Login"}
        </button>
        {message && <p className="text-xs text-destructive">{message}</p>}
      </div>
    );
  }

  if (!data?.isAdmin) {
    return (
      <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Logged in, no admin role.</span>
          <button onClick={() => supabase.auth.signOut().then(() => { setLoggedIn(false); return refresh(); })} aria-label="Logout" className="text-muted-foreground hover:text-gold">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-6 text-foreground">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lock size={16} className="text-gold" /> Admin editor
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => { setLoggedIn(false); return refresh(); })} aria-label="Logout" className="text-muted-foreground hover:text-gold">
          <LogOut size={16} />
        </button>
      </div>

      {/* Media */}
      <section className="space-y-3">
        <div className="text-[10px] uppercase tracking-widest text-gold">Media</div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-gold">
          <Upload size={14} /> Change photo
          <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "portrait")} />
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-gold">
          <Upload size={14} /> Change resume
          <input hidden type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "resume")} />
        </label>
        <div className="grid grid-cols-3 gap-2">
          {cropOptions.map((o) => (
            <button key={o.value} onClick={async () => { await updateSettings({ data: { portraitObjectPosition: o.value } }); await refresh(); }} className="rounded-md border border-border px-2 py-1.5 text-[10px] hover:border-gold">
              {o.label}
            </button>
          ))}
        </div>
        <input type="range" min="1" max="1.8" step="0.05" defaultValue={portfolio?.portraitZoom ?? 1} onChange={async (e) => { await updateSettings({ data: { portraitZoom: Number(e.target.value) } }); await refresh(); }} className="w-full accent-gold" />
      </section>

      {/* Contact info */}
      <ContactInfoEditor portfolio={portfolio!} onSave={async (patch) => { await updateSettings({ data: patch }); await refresh(); }} />

      {/* Skills */}
      <section className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-gold">Skills</div>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {skills.map((s: PortfolioSkill) => (
            <SkillRow key={s.id} skill={s} onSave={saveSkill} onDelete={deleteSkill} refresh={refresh} />
          ))}
        </div>
        <button onClick={async () => { await saveSkill({ data: { label: "New Skill", category: "General", sortOrder: skills.length * 10 + 10, active: true } }); await refresh(); }} className="flex items-center gap-2 text-xs text-gold">
          <Plus size={14} /> Add skill
        </button>
      </section>

      {/* Projects */}
      <section className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-gold">Projects</div>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {projects.map((p: PortfolioProject) => (
            <ProjectRow key={p.id} project={p} onSave={saveProject} onDelete={deleteProject} refresh={refresh} />
          ))}
        </div>
        <button
          onClick={async () => {
            await saveProject({ data: { title: "New Project", subtitle: "", description: "", linkUrl: "", tags: [], year: String(new Date().getFullYear()), sortOrder: projects.length * 10 + 10, active: true } });
            await refresh();
          }}
          className="flex items-center gap-2 text-xs text-gold"
        >
          <Plus size={14} /> Add project
        </button>
      </section>

      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}

function ContactInfoEditor({ portfolio, onSave }: { portfolio: any; onSave: (patch: any) => Promise<void> }) {
  const [draft, setDraft] = useState({
    phone: portfolio.phone ?? "",
    email: portfolio.email ?? "",
    githubUrl: portfolio.githubUrl ?? "",
    linkedinUrl: portfolio.linkedinUrl ?? "",
    location: portfolio.location ?? "",
  });
  const [saving, setSaving] = useState(false);
  return (
    <section className="space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-gold">Contact</div>
      {(["phone", "email", "githubUrl", "linkedinUrl", "location"] as const).map((k) => (
        <input key={k} className={inputCls} placeholder={k} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
      ))}
      <button
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await onSave({
            phone: draft.phone || null,
            email: draft.email || null,
            githubUrl: draft.githubUrl || null,
            linkedinUrl: draft.linkedinUrl || null,
            location: draft.location || null,
          });
          setSaving(false);
        }}
        className="flex items-center gap-2 text-xs text-gold disabled:opacity-60"
      >
        <Save size={14} /> {saving ? "Saving…" : "Save contact info"}
      </button>
    </section>
  );
}


function SkillRow({ skill, onSave, onDelete, refresh }: { skill: PortfolioSkill; onSave: any; onDelete: any; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState(skill);
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border border-border p-2">
      <input className="min-w-0 bg-transparent text-xs outline-none" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
      <button aria-label="Save skill" onClick={async () => { await onSave({ data: draft }); await refresh(); }} className="text-muted-foreground hover:text-gold">
        <Save size={14} />
      </button>
      <button aria-label="Delete skill" onClick={async () => { await onDelete({ data: { id: skill.id } }); await refresh(); }} className="text-muted-foreground hover:text-destructive">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function ProjectRow({ project, onSave, onDelete, refresh }: { project: PortfolioProject; onSave: any; onDelete: any; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState({
    ...project,
    tagsCsv: project.tags.join(", "),
  });
  return (
    <div className="space-y-2 rounded-md border border-border p-3">
      <input className={inputCls} placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      <input className={inputCls} placeholder="Subtitle" value={draft.subtitle ?? ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
      <textarea className={inputCls + " resize-none"} rows={2} placeholder="Description" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
      <input className={inputCls} placeholder="Project link (https://…)" value={draft.linkUrl ?? ""} onChange={(e) => setDraft({ ...draft, linkUrl: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input className={inputCls} placeholder="Year" value={draft.year ?? ""} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
        <input className={inputCls} placeholder="Tags (comma sep)" value={draft.tagsCsv} onChange={(e) => setDraft({ ...draft, tagsCsv: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Visible
        </label>
        <div className="flex items-center gap-2">
          <button
            aria-label="Save project"
            onClick={async () => {
              await onSave({
                data: {
                  id: draft.id,
                  title: draft.title,
                  subtitle: draft.subtitle || null,
                  description: draft.description || null,
                  linkUrl: draft.linkUrl || null,
                  tags: draft.tagsCsv.split(",").map((t) => t.trim()).filter(Boolean),
                  year: draft.year || null,
                  sortOrder: draft.sortOrder,
                  active: draft.active,
                },
              });
              await refresh();
            }}
            className="rounded-full bg-gold px-3 py-1 text-[11px] font-medium text-primary-foreground"
          >
            Save
          </button>
          <button aria-label="Delete project" onClick={async () => { await onDelete({ data: { id: project.id } }); await refresh(); }} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
