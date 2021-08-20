import { State } from '@Src/store'
import { MessageType } from '@Src/constants'

export type SendMessageQuery = {
  content: string;
  type: MessageType;
  fromUserId: string;
  toUserIds: string[];
  toGroupIds: string[];
}

export type SendMessageRes = string

export type GetMessageRes = {
  id: string;
  type: MessageType;
  content: string;
  fromUser: State['user'];
  toGroups: State['user'][];
  toUsers: {
    id: string;
    name: string;
    notice: string;
    owner: State['user'];
  }[];
}

export interface GetMessageListQuery {
  fromUserId?: string;

  toUserId?: string;

  toGroupId?: string;

  content?: string;

  type?: MessageType;
}

export type GetMessageListRes = GetMessageRes[]
