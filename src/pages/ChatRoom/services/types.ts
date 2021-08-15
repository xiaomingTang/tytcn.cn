export enum MessageType {
  Text = 'Text',
  Image = 'Image',
  Video = 'Video',
  File = 'File',
}

// 登录
export interface Message {
  content: string;
  type: MessageType;
  fromUserId: string;
  toUserIds: string[];
  toGroupIds: string[];
}

export type SendMessageQuery = Message

export type SendMessageRes = string

export type GetMessageRes = Message

export interface GetMessageListQuery {
  fromUserId?: string;

  toUserId?: string;

  toGroupId?: string;

  content?: string;

  type?: MessageType;
}

export type GetMessageListRes = Message[]
