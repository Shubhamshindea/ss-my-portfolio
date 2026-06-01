import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, Linkedin, Github, ArrowUp } from "lucide-react";
import logo from "@/assets/logo.png";

const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const contacts = [
  { icon: Mail, label: "Email", value: "shindeshubham07447@gmail.com", href: "mailto:shindeshubham07447@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 63621 23723", href: "tel:+916362123723" },
  { icon: Linkedin, label: "LinkedIn", value: "in/shubham-shinde----", href: "https://www.linkedin.com/in/shubham-shinde----" },
  { icon: Github, label: "GitHub", value: "@Shubhamshindea", href: "https://github.com/Shubhamshindea" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(2, "Add a short subject").max(150),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(2000),
});

type FormState = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormState, string>>;

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/shindeshubham07447@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          _subject: `Portfolio · ${parsed.data.subject}`,
          message: parsed.data.message,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("Network");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-card/60 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors";

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/10 blur-[140px] -z-10" />
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">06 — Let's Build</div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6">
            Have a role, a project,<br />or an <em className="text-gradient-gold not-italic">idea worth shipping?</em>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm <span className="text-foreground">actively seeking full-time software developer and IT support roles</span>. Drop me a message — I respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-card/40 border border-border rounded-2xl p-8 lg:p-10 shadow-deep">
            {status === "success" ? (
              <div className="text-center py-16 animate-fade-up">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold text-3xl">
                  ✓
                </div>
                <h3 className="font-serif text-3xl mb-3">Message sent.</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Thanks for reaching out — I'll get back to you within 24 hours at the email you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-sm text-gold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                    <input id="name" type="text" value={form.name} onChange={onChange("name")} maxLength={100} className={inputBase} placeholder="Your full name" />
                    {errors.name && <p className="text-xs text-destructive mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                    <input id="email" type="email" value={form.email} onChange={onChange("email")} maxLength={255} className={inputBase} placeholder="you@company.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Subject</label>
                  <input id="subject" type="text" value={form.subject} onChange={onChange("subject")} maxLength={150} className={inputBase} placeholder="Opportunity, project, or question" />
                  {errors.subject && <p className="text-xs text-destructive mt-1.5">{errors.subject}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Message</label>
                  <textarea id="message" rows={6} value={form.message} onChange={onChange("message")} maxLength={2000} className={inputBase + " resize-none"} placeholder="Tell me about the role, team, or project…" />
                  {errors.message && <p className="text-xs text-destructive mt-1.5">{errors.message}</p>}
                </div>
                {status === "error" && (
                  <p className="text-sm text-destructive">Something went wrong sending your message. Please email me directly at shindeshubham07447@gmail.com.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gold text-primary-foreground font-medium hover:shadow-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span>→</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct contact list */}
          <aside className="lg:col-span-2 space-y-px bg-border rounded-2xl overflow-hidden h-fit">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 bg-background p-6 hover:bg-card transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <c.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{c.label}</div>
                  <div className="text-sm font-medium group-hover:text-gold break-all transition-colors">{c.value}</div>
                </div>
              </a>
            ))}
          </aside>
        </div>
      </div>

      <footer className="mt-32 border-t border-border pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Monogram" width={28} height={28} className="w-7 h-7" loading="lazy" />
            <span className="font-serif text-sm">Shubham Shinde</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            © MMXXVI · Crafted with intent
          </p>
        </div>
      </footer>
    </section>
  );
}
