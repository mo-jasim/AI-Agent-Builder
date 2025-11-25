export interface AgentDocument {
  id: string;
  name: string;
  content: string; // Simulating parsed text content
  type: string;
  size: number;
}

export interface AgentConfig {
  id: string;
  businessName: string;
  websiteUrl: string;
  systemPrompt: string;
  documents: AgentDocument[];
  primaryColor: string;
  welcomeMessage: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum NavigationTab {
  BUILDER = 'builder',
  PREVIEW = 'preview',
  DEPLOY = 'deploy'
}