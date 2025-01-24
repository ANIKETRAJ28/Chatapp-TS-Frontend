import { IUser } from './user';

export interface IMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  timestamp: Date;
  communityId: string;
  isDeleted: boolean;
  user: IUser;
}
