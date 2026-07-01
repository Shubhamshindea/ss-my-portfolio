import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Expertise } from "@/components/portfolio/Expertise";
import { Work } from "@/components/portfolio/Work";
import { Experience } from "@/components/portfolio/Experience";
import { getPublicPortfolio } from "@/lib/portfolio.functions";
import { MouseTrail } from "@/components/portfolio/MouseTrail";

import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shubham Shinde — Software Developer & IT Support Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Shubham Shinde — full-stack software developer specialising in Java, Spring Boot, and cloud-ready applications. Open to hire.",
      },
      { property: "og:title", content: "Shubham Shinde — Software Developer" },
      {
        property: "og:description",
        content:
          "Full-stack developer crafting resilient software with Java, Spring Boot, and modern web tooling.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const getPortfolio = useServerFn(getPublicPortfolio);
  const { data: portfolio } = useQuery({ queryKey: ["portfolio-public"], queryFn: () => getPortfolio() });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav portfolio={portfolio} />
      <Hero portfolio={portfolio} />
      <About />
      <Expertise portfolio={portfolio} />
      <Work portfolio={portfolio} />
      <Experience />
      
      <Contact portfolio={portfolio} />
    </main>
  );
}
