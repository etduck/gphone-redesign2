export interface Contact {
  id: string;
  name: string;
  number: string;
  role: string;
  callCount: number;
  lastCall: string;
  status: '在线' | '离线' | '待命';
  notes: string;
}

export interface MemoryRecord {
  id: string;
  date: string;
  content: string;
}

export interface ConfigParams {
  temperature: number;
  maxTokens: number;
  presencePenalty: number;
}

export interface AiRole {
  id: string;
  name: string;
  number: string;
  rolePosition: string;
  configParams: ConfigParams;
  prompt: string;
  memoryLibrary: MemoryRecord[];
}

export interface ModelProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  balance: string;
  apiKey: string;
}

export interface Alarm {
  id: string;
  time: string;
  mode: string;
  date: string;
  content: string;
  active: boolean;
}

export type ScreenId = 'overview' | 'phonebook' | 'ai_roles' | 'settings' | 'alarms';
