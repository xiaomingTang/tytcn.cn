import { MessageType } from '@Src/constants'
import { Message, PageQuery, PageRes } from '@Src/services/types'

export type SendMessageQuery = {
  content: string;
  type: MessageType;
  fromUserId: string;
  toUserId: string;
  toGroupId: string;
}

export type SendMessageRes = string

export interface GetMessageListQuery extends PageQuery {
  masterId: string;
  targetType?: 'user' | 'group';
  targetId?: string;
}

export type GetMessageListRes = PageRes<Message>

export type GetChatListQuery = string

export type GetChatListRes = Message[]
