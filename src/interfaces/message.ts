import { IFriendCommunity } from './community';
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

export interface CreateMessageResponse {
  community: IFriendCommunity;
  message: IMessage;
}
