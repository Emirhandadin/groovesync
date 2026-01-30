export interface Song {
  id: string;
  url: string;
  title: string;
  addedBy: string;
  thumbnail?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'listening';
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
}
