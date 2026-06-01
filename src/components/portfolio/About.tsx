export function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">01 — About</div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                A developer with an <em className="text-gradient-gold not-italic">engineer's mind</em> and a craftsman's hand.
              </h2>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm a final-year B.E. in Electronics & Communication Engineering, but my heart has always been in software. Over the last two years I've built full-stack web applications, embedded IoT systems, and database-driven tools — learning to bridge hardware logic with clean, maintainable code.
            </p>
            <p className="text-foreground">
              My focus is application support, incident management, and cloud operations — the unglamorous craft of keeping production systems reliable, fast, and observable.
            </p>
            <p>
              When I'm not shipping code, I'm drilling DSA problems, contributing to open source, and exploring how cloud-native architectures can scale small ideas into resilient systems.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 pt-8">
              {[
                { label: "Education", value: "B.E. ECE, BKIT — CGPA 7.1" },
                { label: "Role", value: "Software Developer Intern" },
                { label: "Company", value: "TAP Academy" },
                { label: "Languages", value: "English, Hindi, Kannada" },
              ].map((d) => (
                <div key={d.label} className="border-l-2 border-gold pl-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{d.label}</div>
                  <div className="text-foreground font-medium mt-1">{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
