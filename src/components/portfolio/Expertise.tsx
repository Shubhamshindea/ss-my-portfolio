const groups = [
  {
    title: "Languages & Backend",
    items: ["Java", "Spring Boot", "REST APIs", "OOP & DSA"],
  },
  {
    title: "Frontend & Web",
    items: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "Query Optimization", "Data Modeling"],
  },
  {
    title: "Tooling & Ops",
    items: ["Git & GitHub", "Vercel", "Cloud Concepts", "Incident Mgmt."],
  },
];

export function Expertise() {
  return (
    <section id="expertise" className="py-32 bg-card/40 border-y border-border relative grain">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">02 — Expertise</div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-2xl">
              Tools of the <em className="text-gradient-gold not-italic">trade.</em>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A focused stack chosen for reliability, performance, and long-term maintainability across full-stack and embedded projects.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
          {groups.map((g, i) => (
            <div
              key={g.title}
              className="bg-background p-8 hover:bg-card transition-colors group relative"
            >
              <div className="font-mono text-xs text-gold mb-6">0{i + 1}</div>
              <h3 className="font-serif text-2xl mb-6 group-hover:text-gold transition-colors">{g.title}</h3>
              <ul className="space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Auto-scrolling skill marquee */}
        <div className="mt-16 overflow-hidden marquee-mask py-2">
          <div className="flex gap-4 w-max animate-marquee">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 shrink-0">
                {["Java", "Spring Boot", "REST APIs", "PostgreSQL", "MySQL", "JavaScript", "HTML5", "CSS3", "Git", "GitHub", "OOP", "DSA"].map((s) => (
                  <span
                    key={`${i}-${s}`}
                    className="px-5 py-2.5 rounded-full border border-border bg-card/60 text-sm whitespace-nowrap hover:border-gold hover:text-gold transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
