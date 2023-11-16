import { ParticipantRole } from "@azure/communication-calling"
import request from "./config/request"

export type RoomResponse = {
  identity: string
  roomId: string
  token: string
  role: ParticipantRole
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
  role: ParticipantRole | null
  twitterId: number
  identity: string
}

export const requestRoomUsers = (
  sid: string | number,
): Promise<ResponseBaseType<RoomUser[]>> => {
  const url = `/room/room_users?sid=${sid}`
  return request.get<ResponseBaseType<RoomUser[]>>(url)
}
