import { MessageType } from '@Src/constants'

export type SendMessageQuery = {
  content: string;
  type: MessageType;
  fromUserId: string;
  toUserIds: string[];
  toGroupIds: string[];
}

export type SendMessageRes = string
