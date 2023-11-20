import request from "./config/request"

export type RoomUserRole = "Host" | "Co-Host" | "Audience"

export type RoomResponse = {
  identity: string
  roomId: string
  token: string
  role: RoomUserRole
  twitterId: string
  sid: string
}

export const requestUserRoomInfo = (
  sid: string | number,
): Promise<ResponseBaseType<RoomResponse>> => {
  const url = `/room/request_room?sid=${sid}`
  return request.get<ResponseBaseType<RoomResponse>>(url)
}

export type RoomUser = {
  displayName: string
  icon: string | null
  role: RoomUserRole
  twitterId: number
  identity: string
}

export const requestRoomUsers = (
  sid: string | number,
): Promise<ResponseBaseType<RoomUser[]>> => {
  const url = `/room/room_users?sid=${sid}`
  return request.get<ResponseBaseType<RoomUser[]>>(url)
}
