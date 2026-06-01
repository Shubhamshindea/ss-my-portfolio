const timeline = [
  {
    period: "Jan 2026 — Present",
    role: "Software Developer Intern",
    org: "TAP Academy",
    points: [
      "Built full-stack applications using Java, Spring Boot, and JavaScript.",
      "Designed and integrated REST APIs to enable seamless communication.",
      "Optimized MySQL / PostgreSQL queries for measurable performance gains.",
      "Collaborated through Git & GitHub workflows, raising team velocity.",
    ],
  },
  {
    period: "2022 — 2026",
    role: "B.E. Electronics & Communication Engineering",
    org: "Bheemanna Khandre Institute of Technology — CGPA 7.1",
    points: [
      "Specialised in embedded systems, IoT, and software engineering.",
      "Led multiple cross-disciplinary projects bridging hardware & code.",
      "Active practice of DSA & competitive problem-solving.",
    ],
  },
  {
    period: "2020 — 2022",
    role: "Pre-University Course (PUC)",
    org: "Diamond Independent PU College",
    points: ["Science stream with focus on mathematics, physics, and computing."],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-32 bg-card/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">04 — Journey</div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl mb-20">
          A timeline of <em className="text-gradient-gold not-italic">growth.</em>
        </h2>

        <ol className="relative border-l border-border ml-2 space-y-16">
          {timeline.map((t, i) => (
            <li key={i} className="pl-10 relative">
              <span className="absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full bg-gold ring-4 ring-background" />
              <div className="font-mono text-xs uppercase tracking-widest text-gold mb-2">{t.period}</div>
              <h3 className="font-serif text-2xl lg:text-3xl">{t.role}</h3>
              <div className="text-muted-foreground mb-4">{t.org}</div>
              <ul className="space-y-2 max-w-2xl">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-3 text-muted-foreground">
                    <span className="text-gold mt-2">—</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
