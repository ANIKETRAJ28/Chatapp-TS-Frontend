import { IUser } from './user';

export interface IUserCommunity {
  id: string;
  user: IUser;
  communityId: string;
  isAdmin: boolean | null;
  isSuperAdmin: boolean | null;
  isDeleted: boolean;
}
