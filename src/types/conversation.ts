export interface Conversation {
  _id: string;
  isGroup: boolean;
  name?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}
