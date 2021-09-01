import { http } from '@Src/utils/api'
import { PageRes } from '@Src/services/types'
import { Types as GlobalTypes } from '@Src/services'
import { Types } from '.'

export async function sendMessage(data: Types.SendMessageQuery) {
  return http.post<Types.SendMessageRes>('/message/new', {
    data,
  })
}

export async function getHotUsers() {
  return http.get<PageRes<GlobalTypes.User>>('/user/hot')
}

export async function getHotGroups() {
  return http.get<PageRes<GlobalTypes.Group>>('/group/hot')
}
