import logo from "@/assets/logo.png";

const contacts = [
  { label: "Email", value: "shindeshubham07447@gmail.com", href: "mailto:shindeshubham07447@gmail.com" },
  { label: "Phone", value: "+91 63621 23723", href: "tel:+916362123723" },
  { label: "LinkedIn", value: "in/shubham-shinde", href: "#" },
  { label: "GitHub", value: "@shubham-shinde", href: "#" },
];

export function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/10 blur-[140px] -z-10" />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">05 — Let's Build</div>
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
          Have a role, a project,<br />or an <em className="text-gradient-gold not-italic">idea worth shipping?</em>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          I'm currently open to full-time software developer and IT support roles. Reach out — I respond within 24 hours.
        </p>

        <a
          href="mailto:shindeshubham07447@gmail.com"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold text-primary-foreground font-medium hover:shadow-gold transition-all"
        >
          Start a conversation
          <span>→</span>
        </a>

        <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-px mt-20 bg-border rounded-xl overflow-hidden">
          {contacts.map((c) => (
            <li key={c.label} className="bg-background p-6 text-left hover:bg-card transition-colors">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{c.label}</div>
              <a href={c.href} className="text-sm font-medium hover:text-gold break-all transition-colors">
                {c.value}
              </a>
            </li>
          ))}
        </ul>
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
