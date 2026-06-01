import { MonitorPlay, Users, BookOpen, MessageCircle } from "lucide-react";

const topics = [
  {
    icon: MonitorPlay,
    title: "2D Animation Basics",
    desc: "Frame-by-frame animation, tweening, and timing principles using modern tools.",
  },
  {
    icon: BookOpen,
    title: "Storyboarding & Layout",
    desc: "Visual storytelling, scene composition, and shot planning for compelling narratives.",
  },
  {
    icon: Users,
    title: "Character Design & Motion",
    desc: "Character rigging, walk cycles, expressive movement, and lip-sync fundamentals.",
  },
  {
    icon: MonitorPlay,
    title: "Software Guidance",
    desc: "Hands-on training with industry tools — Blender, After Effects, and open-source alternatives.",
  },
];

export function AnimationTutor() {
  return (
    <section id="tutor" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/5 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-gold mb-6">05 — Animation Tutor</div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl mb-6">
          Bringing motion to <em className="text-gradient-gold not-italic">life.</em>
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed mb-16">
          I teach animation fundamentals to beginners and aspiring creatives — from sketching the first frame to polishing the final render. Whether you are a student exploring a new skill or a hobbyist refining your craft, I guide you with structured lessons and real-world projects.
        </p>

        {/* Topics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {topics.map((t) => (
            <div
              key={t.title}
              className="group p-6 rounded-2xl bg-card/60 border border-border hover:border-gold/40 transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <t.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Experience & CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-serif text-3xl">My Teaching Experience</h3>
            <ul className="space-y-4">
              {[
                "Mentored 20+ students in animation basics and software workflows.",
                "Conducted hands-on workshops covering 2D animation and character motion.",
                "Created custom lesson plans tailored to individual learning pace and goals.",
                "Provided feedback on student projects to help them build a portfolio piece.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <span className="text-gold mt-1.5 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-card/80 border border-border relative">
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gold/10 blur-2xl" />
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-2xl">Interested in learning?</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I offer one-on-one tutoring sessions and small group classes. Reach out and let us discuss your goals — whether it is mastering a new tool or building your first animated short.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:shadow-gold transition-all"
              >
                Contact for Tutoring
              </a>
              <a
                href="mailto:shindeshubham07447@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-gold hover:text-gold transition-all"
              >
                Email Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
