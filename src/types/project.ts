export interface Step {
  title: string;
  explanation: string;
  code?: string;
}

export interface Component {
  name: string;
  explanation: string;
  technologies: string[];
  steps: Step[];
}

export interface System {
  name: string;
  description: string;
  components: Component[];
}

export interface ProjectBreakdown {
  name: string;
  description: string;
  systems: System[];
}