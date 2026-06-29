import { Code2, Binary, Smartphone, Database, Workflow, Cloud, ShieldAlert, Cpu, Globe, Server } from "lucide-react";

const deviconMap: Record<string, string> = {
  Java: "devicon-java-plain colored",
  "Spring Boot": "devicon-spring-original colored",
  HTML5: "devicon-html5-plain colored",
  HTML: "devicon-html5-plain colored",
  CSS3: "devicon-css3-plain colored",
  CSS: "devicon-css3-plain colored",
  JavaScript: "devicon-javascript-plain colored",
  JS: "devicon-javascript-plain colored",
  PostgreSQL: "devicon-postgresql-plain colored",
  MySQL: "devicon-mysql-plain colored",
  "Git & GitHub": "devicon-github-original colored",
  GitHub: "devicon-github-original colored",
  Git: "devicon-git-plain colored",
  Vercel: "devicon-vercel-original colored",
  "REST APIs": "devicon-codepen-plain colored",
  "Cloud Concepts": "devicon-cloud-plain colored",
};

const fallbackMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "OOP & DSA": Binary,
  "REST APIs": Code2,
  "Responsive Design": Smartphone,
  "Query Optimization": Database,
  "Data Modeling": Workflow,
  "Incident Mgmt.": ShieldAlert,
  "Embedded C": Cpu,
  Sensors: Cpu,
  Telemetry: Server,
  Automation: Globe,
};

export function SkillIcon({ label, className = "" }: { label: string; className?: string }) {
  const deviconClass = deviconMap[label];
  if (deviconClass) {
    return <i className={`${deviconClass} ${className}`} aria-hidden="true" />;
  }

  const Fallback = fallbackMap[label] ?? Code2;
  return <Fallback className={className} aria-hidden="true" />;
}
