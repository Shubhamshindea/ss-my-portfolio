import { SkillIcon } from "@/components/portfolio/SkillIcon";
import type { PortfolioPublicData } from "@/lib/portfolio.functions";

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

export function Expertise({ portfolio }: { portfolio?: PortfolioPublicData }) {
  const activeSkills = portfolio?.skills?.length ? portfolio.skills : groups.flatMap((g) => g.items.map((label) => ({ label, category: g.title })));
  const grouped = activeSkills.reduce<Record<string, string[]>>((acc, skill) => {
    const category = skill.category || "General";
    acc[category] = [...(acc[category] ?? []), skill.label];
    return acc;
  }, {});
  const displayGroups = Object.entries(grouped).map(([title, items]) => ({ title, items }));
  const marqueeSkills = activeSkills.map((skill) => skill.label);

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
          {displayGroups.map((g, i) => (
            <div
              key={g.title}
              className="bg-background p-8 hover:bg-card transition-colors group relative"
            >
              <div className="font-mono text-xs text-gold mb-6">0{i + 1}</div>
              <h3 className="font-serif text-2xl mb-6 group-hover:text-gold transition-colors">{g.title}</h3>
              <ul className="space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <SkillIcon label={it} className="w-5 h-5 shrink-0 text-gold" />
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
                {marqueeSkills.map((s) => (
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
