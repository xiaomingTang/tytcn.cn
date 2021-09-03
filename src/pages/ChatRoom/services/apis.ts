import { http } from '@Src/utils/api'
import { PageRes } from '@Src/services/types'
import { Types as GlobalTypes } from '@Src/services'
import { Types } from '.'

export async function getHotUsers() {
  return http.get<PageRes<GlobalTypes.User>>('/user/hot')
}

export async function getHotGroups() {
  return http.get<PageRes<GlobalTypes.Group>>('/group/hot')
}

export async function sendMessage(data: Types.SendMessageQuery) {
  return http.post<Types.SendMessageRes>('/message/new', {
    data,
  })
}

export async function getMessageList(data: Types.GetMessageListQuery) {
  return http.post<Types.GetMessageListRes>('/message/list-between', {
    data,
  })
}

export async function getChatList(userId: Types.GetChatListQuery) {
  return http.get<Types.GetChatListRes>(`/message/chat-list/${userId}`)
}
