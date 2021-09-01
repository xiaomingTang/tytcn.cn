import { MessageType, UserOnlineState } from '@Src/constants'

export interface PageQuery {
  current: number;
  pageSize: number;
  order?: Partial<Record<string, 'ASC' | 'DESC'>>;
}

export interface PageRes<T> {
  data: T[];
  current: number;
  pageSize: number;
  total: number;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  fromUser: User;
  toUsers: User[];
  toGroups: Group[];
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  token: string;
  phone: string;
  email: string;
  onlineState: UserOnlineState;
  friends: User[];
  roles: string[];
  groups: string[];
  ownGroups: string[];
  postedMessages: string[];
  receivedMessages: string[];
}

export interface Group {
  id: string;
  name: string;
  notice: string;
  owner: User;
}

export interface GetUserQuery {
  id?: string;
  phone?: string;
  email?: string;
}

export type GetUserRes = User

export interface SearchUserQuery extends PageQuery {
  id?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  onlineState?: UserOnlineState;
  createdTime?: [number, number];
  updatedTime?: [number, number];
  lastAccessTime?: [number, number];
  roles?: string[];
}

export type SearchUserRes = PageRes<User>

export interface GetGroupQuery {
  id: string;
}

export type GetGroupRes = Group

export interface SearchGroupQuery extends PageQuery {
  id?: string;
  name?: string;
  createdTime?: [number, number];
  ownerId?: string;
}

export type SearchGroupRes = PageRes<Group>

export interface GetMessageQuery {
  id: string;
}

export type GetMessageRes = Message

export interface SearchMessageQuery extends PageQuery {
  id?: string;
  content?: string;
  type?: MessageType;
  createdTime?: [number, number];
  fromUserId?: string;
  toUserId?: string;
  toGroupId?: string;
}

export type SearchMessageRes = PageRes<Message>
