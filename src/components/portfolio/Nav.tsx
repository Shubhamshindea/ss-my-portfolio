import { useEffect, useState } from "react";
import { MoreVertical, Sun, Moon, Mail, Phone, Linkedin, Github, MapPin, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <img src={logo} alt="Shubham Shinde monogram" width={36} height={36} className="w-9 h-9 transition-transform group-hover:rotate-[8deg]" />
          <div className="leading-tight">
            <div className="font-serif text-lg tracking-wide">Shubham Shinde</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Software Developer</div>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground hover:text-gold transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full border border-border hover:border-gold hover:text-gold flex items-center justify-center transition-all hover:rotate-12"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setInfoOpen(true)}
            aria-label="Quick info"
            className="w-10 h-10 rounded-full border border-border hover:border-gold hover:text-gold flex items-center justify-center transition-all"
          >
            <MoreVertical size={18} />
          </button>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-primary-foreground text-sm font-medium hover:shadow-gold transition-all"
          >
            Hire Me
          </a>
          <button
            className="md:hidden text-foreground ml-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-px bg-foreground mb-1.5" />
            <span className="block w-6 h-px bg-foreground mb-1.5" />
            <span className="block w-4 h-px bg-foreground ml-auto" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-up">
          <ul className="px-6 py-6 space-y-4">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block text-foreground/90 py-2">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={() => setOpen(false)} className="inline-block px-5 py-2.5 rounded-full bg-gold text-primary-foreground text-sm font-medium">
                Hire Me
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Quick info drawer */}
      {infoOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          onClick={() => setInfoOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-deep p-8 overflow-y-auto animate-[slide-in-right_0.3s_ease-out]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Quick Info</div>
              <button onClick={() => setInfoOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-gold">
                <X size={20} />
              </button>
            </div>

            <h3 className="font-serif text-3xl mb-2">Shubham Shinde</h3>
            <p className="text-sm text-muted-foreground mb-1">Software Developer · IT Support Engineer</p>
            <p className="text-xs text-gold mb-8">● Open to full-time opportunities</p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: "Email", value: "shindeshubham07447@gmail.com", href: "mailto:shindeshubham07447@gmail.com" },
                { icon: Phone, label: "Phone", value: "+91 79759 49002", href: "tel:+917975949002" },
                { icon: Linkedin, label: "LinkedIn", value: "shubham-shinde", href: "https://www.linkedin.com/in/shubham-shinde----" },
                { icon: Github, label: "GitHub", value: "Shubhamshindea", href: "https://github.com/Shubhamshindea" },
                { icon: MapPin, label: "Location", value: "Bengaluru, India" },
              ].map(({ icon: Icon, label, value, href }) => {
                const Inner = (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                      <div className="text-sm truncate">{value}</div>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:text-gold transition-colors">
                    {Inner}
                  </a>
                ) : (
                  <div key={label}>{Inner}</div>
                );
              })}
            </div>

            <div className="border-t border-border pt-6 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Quick Links</div>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setInfoOpen(false)}
                  className="block text-sm py-1.5 text-foreground/80 hover:text-gold transition-colors"
                >
                  → {l.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
