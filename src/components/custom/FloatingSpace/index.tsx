"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactDOM, { unstable_batchedUpdates } from "react-dom"
import { useSelector } from "react-redux"
import Image from "next/image"
import { AudioMutedOutline, AudioOutline } from "antd-mobile-icons"
import { FloatingPanel, Loading, Mask } from "antd-mobile"
// import {
//   AzureCommunicationCallAdapterArgs,
//   CallAdapter,
//   CallAdapterLocator,
//   CallAdapterState,
//   CommonCallAdapter,
//   fromFlatCommunicationIdentifier,
//   useAzureCommunicationCallAdapter,
// } from "@azure/communication-react"
import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
} from "@azure/communication-common"
import {
  Call,
  CallAgent,
  CallClient,
  DeviceAccess,
  DeviceManager,
  Features,
  ParticipantRole,
  RaisedHand,
  RaisedHandListener,
  RemoteParticipant,
} from "@azure/communication-calling"

import Button from "@/components/ui/button"
import { RootState } from "@/redux/type"
import { UserStateType } from "@/redux/features/userSlice"
import {
  RoomResponse,
  RoomUser,
  requestRoomUsers,
  requestUserRoomInfo,
} from "@/service/roomService"
import { cn } from "@/lib/utils"

import { SpaceAvatar } from "./SpaceAvatar"
import toaster from "../Toast/Toast"
import CloseImage from "../../../assets/images/close.png"

export const convertParticipantRoleToUserRole = (role: ParticipantRole) => {
  if (role === "Presenter") {
    return "Host"
  } else if (role === "Consumer") {
    return "Co-Host"
  } else {
    return "Audience"
  }
}

export const isParticipantHandRaised = (
  participantId: CommunicationUserIdentifier,
  raisedHandState?: RaisedHand[],
) => {
  if (!participantId || !raisedHandState || !raisedHandState?.length) {
    return false
  }
  const hand = raisedHandState.find(
    (element) =>
      (element.identifier as CommunicationUserIdentifier)
        .communicationUserId === participantId.communicationUserId,
  )
  return !!hand
}
export interface FloatingSpaceProps {
  triggerNode?: React.ReactNode
  space: {
    sid: number
    title?: string
  }
  onSpaceOpened?: () => void
}

const anchors = [60 + 100, window.innerHeight * 0.9]

export type JoinedUser = RoomUser & {
  isMuted?: RemoteParticipant["isMuted"]
  isSpeaking?: RemoteParticipant["isSpeaking"]
  isSpeakable?: boolean
}

export default function FloatingSpace({
  triggerNode,
  space,
  onSpaceOpened,
}: React.PropsWithChildren<FloatingSpaceProps>) {
  const [controlledVisible, setControlledVisible] = useState(false)
  const { data, isLoading, initialize, dispose } = useAzureCommunicationService(
    space.sid,
    {
      onError(e) {
        toaster.error(e.message)
      },
    },
  )
  const { userinfo } = useSelector((state: any) => state.user)
  const { call, room } = data ?? {}
  const raiseHandFeature = call?.feature(Features.RaiseHand)
  const spotlightFeature = call?.feature(Features.Spotlight)
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>()
  const [isMuted, setIsMuted] = useState(false)

  const roomUsersRef = useRef<RoomUser[]>([])
  const [joinedUsers, setJoinedUsers] = useState<JoinedUser[]>([])
  const presenter = joinedUsers.find((x) => {
    return x.role === "Host"
  })
  const currentUserInRoom = joinedUsers.find(
    (x) => x.twitterId === userinfo.twitterUid,
  )
  const isHost = currentUserInRoom?.role === "Host"
  const [isGivenSpeakPermission, setIsGivenSpeakPermission] = useState(false)
  const isSpeakable = (() => {
    if (
      currentUserInRoom?.role === "Co-Host" ||
      currentUserInRoom?.role === "Host"
    ) {
      return true
    }

    if (isGivenSpeakPermission) {
      return true
    }
  })()
  const coHosts = joinedUsers?.filter((x) => x.role === "Co-Host")
  const audiences = joinedUsers?.filter((x) => x.role === "Audience")

  const handleJoinSpace = async () => {
    return initialize().then(async (d) => {
      if (d && d.room && d.callAgent) {
        if (!roomUsersRef.current.length) {
          await requestRoomUsers(space.sid).then((x) => {
            if (x.result) {
              roomUsersRef.current = x.result
            }
          })
        }

        const call = d.callAgent.join({ roomId: d.room.roomId })
        // init room members
        handleNewJoinedParticipant({
          identifier: {
            communicationUserId: d.room.identity,
            kind: "communicationUser",
          },
        })
        call.remoteParticipants.forEach((x) => {
          handleNewJoinedParticipant(x)
        })
        await call.muteIncomingAudio()

        setControlledVisible(true)
        onSpaceOpened?.()
      }
    })
  }

  const handleNewJoinedParticipant = (
    participant: Partial<RemoteParticipant>,
  ) => {
    const { identifier } = participant
    const { communicationUserId } = identifier as CommunicationUserIdentifier
    const user: RoomUser | null =
      roomUsersRef.current?.find((x) => x.identity === communicationUserId) ??
      null

    // TODO: This does not change the current user state, add if is current user change by listen to call
    participant.on?.("isMutedChanged", () =>
      setJoinedUsers((xs) => {
        const oldUser = xs.find((x) => x.identity === user?.identity)
        if (!oldUser) {
          return xs
        }
        const index = xs.findIndex((x) => x.identity === user?.identity)!
        const joinedUser = {
          ...oldUser,
          isMuted: participant.isMuted,
          isSpeaking: participant.isSpeaking,
        }
        return [...xs.slice(0, index), joinedUser, ...xs.slice(index + 1)]
      }),
    )

    participant.on?.("isSpeakingChanged", () =>
      setJoinedUsers((xs) => {
        const oldUser = xs.find((x) => x.identity === user?.identity)
        if (!oldUser) {
          return xs
        }
        const index = xs.findIndex((x) => x.identity === user?.identity)!
        const joinedUser = {
          ...oldUser,
          isMuted: participant.isMuted,
          isSpeaking: participant.isSpeaking,
        }
        return [...xs.slice(0, index), joinedUser, ...xs.slice(index + 1)]
      }),
    )

    if (user) {
      const joinedUser: JoinedUser = {
        ...user,
        isMuted: participant.isMuted,
        isSpeaking: participant.isSpeaking,
      }
      setJoinedUsers((xs) => [...xs, joinedUser])
    }
  }

  const handleLeavedParticipant = useCallback(
    (participant: Partial<RemoteParticipant>) => {
      const { identifier } = participant
      const { communicationUserId } = identifier as CommunicationUserIdentifier
      setJoinedUsers((xs) =>
        xs.filter((x) => x.identity !== communicationUserId),
      )
    },
    [],
  )

  useEffect(() => {
    if (!call || !raiseHandFeature || !spotlightFeature) {
      return
    }

    const handleMutedChanged = () => setIsMuted(call.isMuted)
    call.on("isMutedChanged", handleMutedChanged)
    call.on("remoteParticipantsUpdated", (e) => {
      e.added.forEach((participant) => {
        // setRemoteParticipants((xs) =>
        //   xs?.includes(participant) ? xs : [...(xs ?? []), participant]
        // );
        handleNewJoinedParticipant(participant)
      })

      e.removed.forEach((participant) => {
        // setRemoteParticipants((xs) => xs?.filter((p) => p !== participant));
        handleLeavedParticipant(participant)
      })
    })

    const handleHandChanged: RaisedHandListener = () => {
      setRaisedHands(raiseHandFeature.getRaisedHands())
    }
    raiseHandFeature.on("raisedHandEvent", handleHandChanged)
    raiseHandFeature.on("loweredHandEvent", handleHandChanged)

    spotlightFeature.on("spotlightChanged", (e) => {
      e.added.forEach((p) => {
        if (currentUserInRoom?.role !== "Audience") {
          return
        }

        if (
          (p.identifier as CommunicationUserIdentifier).communicationUserId ===
          currentUserInRoom?.identity
        ) {
          setIsGivenSpeakPermission(true)
        }
      })

      e.removed.forEach(async (p) => {
        if (currentUserInRoom?.role !== "Audience") {
          return
        }

        if (
          (p.identifier as CommunicationUserIdentifier).communicationUserId ===
          currentUserInRoom?.identity
        ) {
          setIsGivenSpeakPermission(false)
          if (!call.isMuted) {
            await call.mute()
          }
        }
      })
    })

    return () => {
      call.dispose()
      raiseHandFeature.dispose()
      spotlightFeature?.dispose()
    }
  }, [
    call,
    currentUserInRoom?.identity,
    currentUserInRoom?.role,
    handleLeavedParticipant,
    raiseHandFeature,
    spotlightFeature,
  ])

  const handleMutedChange = () => {
    if (!call) {
      return
    }
    if (isMuted) {
      call.unmute()
    } else {
      call.mute()
    }
    setIsMuted(call.isMuted)
  }

  const handleRaiseHand = () => {
    if (!room) {
      return
    }
    const isHandRaised = isParticipantHandRaised(
      { communicationUserId: room.identity },
      raisedHands,
    )
    if (isHandRaised) {
      return raiseHandFeature?.lowerHand()
    }
    return raiseHandFeature?.raiseHand()
  }

  const [isClosingSpace, setIsClosingSpace] = useState(false)
  const handleCloseSpace = async () => {
    if (isClosingSpace) {
      return
    }
    setIsClosingSpace(true)
    await dispose()
    unstable_batchedUpdates(() => {
      setControlledVisible(false)
      setIsClosingSpace(false)
    })
  }

  const [maskOpacity, setMaskOpacity] = useState(0.2)

  const spcaeRoot = document.body.querySelector("#space-root")

  if (!spcaeRoot) {
    throw new Error(
      "Please use a container as a portal for floating panel injection!",
    )
  }

  return (
    <>
      {React.isValidElement(triggerNode) ? (
        React.cloneElement(triggerNode, {
          ...triggerNode.props,
          onClick: () => {
            handleJoinSpace()
            triggerNode.props.onClick?.()
          },
        })
      ) : (
        <Button
          isLoading={isLoading}
          onClick={handleJoinSpace}
          className="absolute right-[0.625rem] top-5"
        >
          Join
        </Button>
      )}

      {!!data?.call && controlledVisible && (
        <>
          <Mask
            style={{
              zIndex: 1,
              opacity: maskOpacity,
            }}
          />
          {ReactDOM.createPortal(
            <FloatingPanel
              anchors={anchors}
              style={{ zIndex: 2, "--border-radius": "20px" }}
              className="relative"
              onHeightChange={(height) => {
                requestAnimationFrame(() =>
                  setMaskOpacity(height / (window.innerHeight * 0.9)),
                )
              }}
            >
              <div className="max-w-md mx-auto px-8">
                <div className="flex justify-between items-center py-2 mb-4 gap-4">
                  <button className="px-4 py-2">
                    {/* <DropdownArrowIcon className="w-4" /> */}
                  </button>

                  <p className="font-normal text-[22px] break-all">
                    {space.title}
                  </p>
                  <button
                    className={cn(
                      "rounded-full bg-[rgb(238,238,238)]",
                      isLoading ? "" : "p-2",
                    )}
                    onClick={handleCloseSpace}
                  >
                    {isClosingSpace ? (
                      <Loading />
                    ) : (
                      <Image
                        src={CloseImage}
                        width={16}
                        height={16}
                        className="w-4 text-[rgba(241,65,40,1)]"
                        alt="Close button"
                      />
                    )}
                  </button>
                </div>
                <div className="divide-y divide-dashed divide-[rgb(238,238,238)]">
                  {(presenter || !!coHosts?.length) && (
                    <div className="grid grid-cols-4 pb-4">
                      {presenter && (
                        <SpaceAvatar
                          role="Host"
                          userInfo={presenter}
                          raisedHands={raisedHands}
                        />
                      )}

                      {coHosts?.map((x) => (
                        <SpaceAvatar
                          role="Co-Host"
                          userInfo={x}
                          raisedHands={raisedHands}
                          key={`participant-${x.identity}-${x.displayName}`}
                          showClickMenu={currentUserInRoom?.role === "Host"}
                          onMenuClick={(action) => {
                            if (action === "mute") {
                              return spotlightFeature?.stopSpotlight([
                                { communicationUserId: x.identity },
                              ])
                            }
                            spotlightFeature?.startSpotlight([
                              { communicationUserId: x.identity },
                            ])
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {!!audiences?.length && (
                    <div className="grid grid-cols-4 pt-4">
                      {audiences?.map((x) => (
                        <SpaceAvatar
                          role="Audience"
                          userInfo={x}
                          raisedHands={raisedHands}
                          key={`participant-${x.identity}-${x.displayName}`}
                          showClickMenu={
                            currentUserInRoom?.role === "Host" ||
                            currentUserInRoom?.role === "Co-Host"
                          }
                          onMenuClick={(action) => {
                            if (action === "mute") {
                              return spotlightFeature?.stopSpotlight([
                                { communicationUserId: x.identity },
                              ])
                            }
                            spotlightFeature?.startSpotlight([
                              { communicationUserId: x.identity },
                            ])
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Space Footer */}
              <div className="py-5 bg-white border-t border-gray-200 fixed bottom-[3.75rem] left-0 right-0">
                <div className="flex gap-6 justify-center max-w-md mx-auto">
                  {isSpeakable && (
                    <button
                      className="rounded-full bg-[rgb(238,238,238)] p-4 flex justify-center items-center"
                      onClick={handleMutedChange}
                    >
                      {isMuted ? (
                        <AudioMutedOutline className="w-5 h-5" />
                      ) : (
                        <AudioOutline className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {!isHost && (
                    <button
                      className="rounded-full bg-[rgb(238,238,238)] p-4 flex justify-center items-center"
                      onClick={() => handleRaiseHand()}
                    >
                      <span className="w-5 h-5">👋</span>
                    </button>
                  )}
                </div>
              </div>
            </FloatingPanel>,
            spcaeRoot,
          )}
        </>
      )}
    </>
  )
}

type CommunicationData = {
  room?: RoomResponse
  callAgent?: CallAgent
  call?: Call
  deviceManager?: DeviceManager
  permissions?: DeviceAccess
}

function useAzureCommunicationService(
  sid: number,
  options?: { onError?: (error: Error) => void },
): {
  data?: CommunicationData
  isLoading: boolean
  initialize: () => Promise<CommunicationData | undefined>
  dispose: () => Promise<void>
} {
  const userInfo = useSelector<RootState, UserStateType>((x) => x.user)
  const [isLoading, setIsLoading] = useState(false)
  const dataRef = useRef<CommunicationData>()

  const initialize = async () => {
    // Cache
    if (dataRef.current?.room) {
      return dataRef.current
    }

    setIsLoading(true)

    try {
      dataRef.current = {}
      dataRef.current.room = await requestUserRoomInfo(sid).then(
        (x) => x.result,
      )

      const client = new CallClient()
      dataRef.current.deviceManager = await client.getDeviceManager()
      const tokenCredential = new AzureCommunicationTokenCredential({
        token: dataRef.current.room?.token,
        async tokenRefresher() {
          return requestUserRoomInfo(sid.toString()).then((x) => x.result.token)
        },
      })
      // For test only
      // const tokenCredential = new AzureCommunicationTokenCredential(TOKEN)
      dataRef.current.callAgent = await client.createCallAgent(
        tokenCredential,
        {
          displayName: userInfo.userinfo?.twitterName,
        },
      )

      dataRef.current.callAgent.on("callsUpdated", (e) => {
        e.added.forEach((x) => (dataRef.current!.call = x))
        e.removed.forEach((x) => {})
      })

      dataRef.current.permissions =
        await dataRef.current.deviceManager.askDevicePermission({
          audio: true,
          video: true,
        })

      setIsLoading(false)
      return dataRef.current
    } catch (e) {
      const error = e as Error
      console.log("🚀 ~ file: index.tsx:340 ~ initialize ~ error:", error)
      options?.onError?.(error)
      dataRef.current = undefined
    }
    setIsLoading(false)
  }

  const dispose = async () => {
    if (!dataRef.current) {
      return
    }

    const { call, callAgent } = dataRef.current
    await call?.hangUp()
    await callAgent?.dispose()
    dataRef.current = undefined
  }

  return {
    data: dataRef.current,
    isLoading,
    initialize,
    dispose,
  }
}
