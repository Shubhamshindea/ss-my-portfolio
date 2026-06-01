import portrait from "@/assets/shubham-portrait.png.asset.json";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 overflow-hidden grain">
      {/* Background ornaments */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 animate-fade-up">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold font-mono">
            <span className="w-10 h-px bg-gold" /> Portfolio · MMXXVI
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
            Crafting <em className="text-gradient-gold not-italic">resilient</em>
            <br />
            software with<br />
            <span className="italic font-light">precision.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            I'm <span className="text-foreground font-medium">Shubham Shinde</span> — a software developer and IT support engineer building full-stack systems with Java, Spring Boot, and modern web tooling. Currently a <span className="text-gold">Software Developer Intern</span> at TAP Academy and <span className="text-foreground font-medium">actively seeking full-time opportunities</span>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gold text-primary-foreground font-medium hover:shadow-gold transition-all"
            >
              View Selected Work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-border hover:border-gold hover:text-gold transition-all"
            >
              Get in Touch
            </a>
          </div>
          <dl className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-md">
            {[
              { k: "5+", v: "Projects Shipped" },
              { k: "Java", v: "Primary Stack" },
              { k: "2026", v: "Graduated" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-serif text-3xl text-gold">{s.k}</dt>
                <dd className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative aspect-[3/4] max-w-[300px] sm:max-w-xs mx-auto">
            {/* Frame */}
            <div className="absolute -inset-4 border border-gold/30 rounded-sm" />
            <div className="absolute -inset-2 border border-gold/20 rounded-sm" />
            <div className="absolute inset-0 rounded-sm overflow-hidden shadow-deep">
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-gold/10 z-10 mix-blend-overlay" />
              <img
                src={portrait.url}
                alt="Portrait of Shubham Shinde"
                width={800}
                height={1067}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent z-10" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-card border border-border rounded-lg px-5 py-4 shadow-deep animate-float">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-sm font-medium">Open to work</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 z-20 bg-card border border-border rounded-lg px-5 py-4 shadow-deep">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Based in</div>
              <div className="font-serif text-lg">India</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-24 border-y border-border py-6 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-[shimmer_30s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 items-center text-muted-foreground/70">
              {["Java", "Spring Boot", "PostgreSQL", "MySQL", "REST APIs", "Git", "HTML/CSS", "JavaScript", "IoT Systems", "Cloud Concepts"].map((t) => (
                <span key={t} className="font-serif italic text-2xl flex items-center gap-16">
                  {t}
                  <span className="text-gold">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
