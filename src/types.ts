export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  challenges: string[];
  technologies: string[];
  accentColor: string;
  imageUrl?: string;
}

export interface SkillNode {
  name: string;
  category: "mobile" | "backend" | "workflow" | "localization";
  angle: number;
  radius: number;
  y: number;
  size: number;
  speed: number;
}

export interface CreativeInterest {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: string;
  color: string;
}

export interface WorkflowStep {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}
