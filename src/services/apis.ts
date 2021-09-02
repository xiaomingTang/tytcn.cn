import { http } from '@Src/utils/api'
import { Types } from '.'

export async function getUser(data: Types.GetUserQuery) {
  const { id, phone, email } = data
  if (id) {
    return http.get<Types.GetUserRes>(`/user/${id}`)
  }
  if (phone) {
    return http.get<Types.GetUserRes>(`/user/phone/${phone}`)
  }
  if (email) {
    return http.get<Types.GetUserRes>(`/user/email/${email}`)
  }
  throw new Error('查询用户时参数无效')
}

export async function searchUser(data: Types.SearchUserQuery) {
  return http.post<Types.SearchUserRes>('/user/search', {
    data,
  })
}

export async function getGroup(data: Types.GetGroupQuery) {
  const { id } = data
  if (id) {
    return http.get<Types.GetGroupRes>(`/group/${id}`)
  }
  throw new Error('查询群组时参数无效')
}

export async function searchGroup(data: Types.SearchGroupQuery) {
  return http.post<Types.SearchGroupRes>('/group/search', {
    data,
  })
}

export async function getMessage(data: Types.GetMessageQuery) {
  const { id } = data
  if (id) {
    return http.get<Types.GetMessageRes>(`/message/${id}`)
  }
  throw new Error('查询消息时参数无效')
}

export async function searchMessage(data: Types.SearchMessageQuery) {
  return http.post<Types.SearchMessageRes>('/message/search', {
    data,
  })
}
