const projects = [
  {
    no: "01",
    year: "2026",
    title: "E-Commerce Platform",
    type: "Full-Stack Application",
    blurb:
      "A production-grade e-commerce system with secure authentication, product management, and an integrated cart. Built end-to-end with Spring Boot REST APIs and a MySQL-backed transactional layer.",
    tags: ["Java", "Spring Boot", "MySQL", "REST", "JavaScript"],
    metrics: [
      { k: "REST", v: "API endpoints" },
      { k: "JWT", v: "Auth strategy" },
      { k: "MVC", v: "Architecture" },
    ],
  },
  {
    no: "02",
    year: "2026",
    title: "Portfolio Website",
    type: "Frontend Engineering",
    blurb:
      "A fully responsive, modular portfolio crafted with clean frontend practices. Optimized for accessibility, performance, and visual polish — deployed on Vercel's edge.",
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    metrics: [
      { k: "100", v: "Lighthouse score" },
      { k: "A11y", v: "First-class" },
      { k: "Edge", v: "Deployment" },
    ],
  },
  {
    no: "03",
    year: "2025",
    title: "IoT Embedded Systems",
    type: "Hardware × Software",
    blurb:
      "A series of IoT projects bridging electronics and code — sensor pipelines, real-time telemetry, and embedded control flows engineered for low-resource environments.",
    tags: ["Embedded C", "Sensors", "Telemetry", "Automation"],
    metrics: [
      { k: "Real-time", v: "Telemetry" },
      { k: "Low-RAM", v: "Footprint" },
      { k: "Modular", v: "Architecture" },
    ],
  },
];

export function Work() {
  return (
    <section id="work" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">03 — Selected Work</div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl">
              Projects built with <em className="text-gradient-gold not-italic">intent.</em>
            </h2>
          </div>
        </div>

        <div className="space-y-px bg-border">
          {projects.map((p) => (
            <article
              key={p.no}
              className="bg-background p-8 lg:p-12 group hover:bg-card/60 transition-colors"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-2 flex lg:flex-col gap-4 lg:gap-2">
                  <div className="font-serif text-5xl text-gold">{p.no}</div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground self-center lg:self-start">
                    {p.year}
                  </div>
                </div>
                <div className="lg:col-span-6 space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-gold">{p.type}</div>
                  <h3 className="font-serif text-3xl lg:text-5xl leading-tight group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">{p.blurb}</p>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground font-mono"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-4 grid grid-cols-3 gap-4 lg:border-l lg:border-border lg:pl-8">
                  {p.metrics.map((m) => (
                    <div key={m.v}>
                      <div className="font-serif text-2xl text-gold">{m.k}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
