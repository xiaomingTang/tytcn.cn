import { http } from '@Src/utils/api'
import { Types } from '.'

export async function sendMessage(data: Types.SendMessageQuery) {
  return http.post<Types.SendMessageRes>('/message/new', {
    data,
  })
}

export async function getMessage(messageId: string) {
  return http.get<Types.GetMessageRes>(`/message/id/${messageId}`)
}

export async function getMessageList(params: Types.GetMessageListQuery) {
  return http.get<Types.GetMessageListRes>('/message/list', {
    params,
  })
}
