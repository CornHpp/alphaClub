"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { useSelector } from "react-redux"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { AudioMutedOutline, AudioOutline } from "antd-mobile-icons"
import { FloatingPanel, Loading, Mask } from "antd-mobile"
import dynamic from "next/dynamic"

import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
} from "@azure/communication-common"
import {
  Call,
  Features,
  RaisedHand,
  RaisedHandListener,
  RemoteParticipant,
} from "@azure/communication-calling"
import {
  useAzureCommunicationCallAdapter,
  AzureCommunicationCallAdapterArgs,
  CallAdapter,
  IsMutedChangedListener,
  CallAdapterState,
  CommonCallAdapter,
} from "@azure/communication-react"

import { RootState } from "@/redux/type"
import { UserStateType } from "@/redux/features/userSlice"
import {
  RoomResponse,
  RoomUser,
  requestRoomUsers,
  requestUserRoomInfo,
} from "@/service/roomService"
import { cn } from "@/lib/utils"

// import { SpaceAvatar } from "./SpaceAvatar";
const SpaceAvatar = dynamic(() => import("./SpaceAvatar"), { ssr: false })
import toaster from "../Toast/Toast"
import CloseImage from "../../../assets/images/close.png"
import { Space, useSpace } from "./SpaceProvider"

export interface FloatingSpaceProps {
  triggerNode?: React.ReactNode
  space: {
    sid: number
    title?: string
  }
  onSpaceOpened?: () => void
}

const anchors = [60 + 100, window.innerHeight * 0.9]

export default function FloatingSpace({
  space,
}: React.PropsWithChildren<FloatingSpaceProps>) {
  const { handleCloseSpace, handleMutedChange, handleRaiseHand, ...data } =
    useAzureCommunicationService(space, {
      onError(e) {
        toaster.error(e.message)
      },
    })

  const {
    audiences,
    coHosts,
    currentUserInRoom,
    isClosingSpace,
    isHost,
    isMuted,
    isSpeakable,
    presenter,
    spotlightFeature,
    raisedHands,
    adapter,
  } = data

  const [maskOpacity, setMaskOpacity] = useState(0.2)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeRef = useRef(`${pathname}?${searchParams}`)
  const { setCurrentSpace } = useSpace()
  const disposeAdapter = useCallback((): void => {
    adapter?.dispose()
    setCurrentSpace(undefined)
  }, [adapter, setCurrentSpace])

  useEffect(() => {
    window.addEventListener("beforeunload", disposeAdapter)
    return () => {
      window.removeEventListener("beforeunload", disposeAdapter)
    }
  }, [adapter, disposeAdapter])

  // Dispose on route changed
  // TODO: We should have a global space, otherwise, we have to mask the footer to make router unchangable
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    if (routeRef.current === url) {
      return
    }
    routeRef.current = url
    disposeAdapter()
  }, [disposeAdapter, pathname, searchParams])

  const spcaeRoot = document.body.querySelector("#__space_root")
  if (!spcaeRoot) {
    throw new Error(
      `Please use a container with id="__space_root" as a portal for floating panel injection!`
    )
  }

  if (!adapter) {
    return null
  }

  return (
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
          onHeightChange={(height) => {
            requestAnimationFrame(() =>
              setMaskOpacity(height / (window.innerHeight * 0.9))
            )
          }}
        >
          <div className="max-w-md mx-auto px-8">
            <div className="flex justify-between items-center py-2 mb-4 gap-4">
              <button className="px-4 py-2">
                {/* <DropdownArrowIcon className="w-4" /> */}
              </button>

              <p className="font-normal text-[22px] break-all">{space.title}</p>
              <button
                className={cn(
                  "rounded-full bg-[rgb(238,238,238)]",
                  isClosingSpace ? "" : "p-2"
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
        spcaeRoot
      )}
    </>
  )
}

export const isParticipantHandRaised = (
  participantId: CommunicationUserIdentifier,
  raisedHandState?: RaisedHand[]
) => {
  if (!participantId || !raisedHandState || !raisedHandState?.length) {
    return false
  }
  const hand = raisedHandState.find(
    (element) =>
      (element.identifier as CommunicationUserIdentifier)
        .communicationUserId === participantId.communicationUserId
  )
  return !!hand
}

export type JoinedUser = RoomUser & {
  isMuted?: RemoteParticipant["isMuted"]
  isSpeaking?: RemoteParticipant["isSpeaking"]
  isSpeakable?: boolean
}

function useAzureCommunicationService(
  space: Space,
  options?: {
    onError?: (error: Error) => void
    afterCreate?: (callAdapter: CallAdapter) => Promise<CallAdapter>
    beforeDispose?:
      | ((adapter: CallAdapter) => Promise<void>)
      | ((adapter: CallAdapter) => void)
  }
) {
  const { setCurrentSpace, setIsLoadingSpace } = useSpace()
  const [room, setRoom] = useState<RoomResponse>()

  useEffect(() => {
    ;(async () => {
      setIsLoadingSpace(true)
      try {
        const room = await requestUserRoomInfo(space.sid).then((x) => x.result)
        setRoom(room)
      } catch (error) {
        console.log("🚀 ~ file: index.tsx:300 ~ ; ~ error:", error)
        setCurrentSpace(undefined)
        setIsLoadingSpace(false)
      }
    })()
  }, [setCurrentSpace, setIsLoadingSpace, space.sid])

  const tokenCredential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential({
        token: room?.token,
        refreshProactively: true,
        async tokenRefresher() {
          return requestUserRoomInfo(space.sid).then((x) => x.result.token)
        },
      })
      // FIXME: This catch didn't work cause of Azure doesn't catch the error
    } catch (e) {
      console.log("🚀 ~ file: index.tsx:289 ~ tokenCredential ~ e:", e)
      if (
        (e as Error).message.includes(
          "The token returned from the tokenRefresher is expired"
        )
      ) {
        setCurrentSpace(undefined)
        setIsLoadingSpace(false)
      }
    }
  }, [room?.token, setCurrentSpace, setIsLoadingSpace, space.sid])

  const adapterArgs = useMemo<Partial<AzureCommunicationCallAdapterArgs>>(
    () => ({
      credential: tokenCredential,
      displayName: space.title ?? "Unknown Space Name",
      // @ts-expect-error, roomId isn't available in typing but actually do exists in source code
      locator: { roomId: room?.roomId },
      userId: room ? { communicationUserId: room?.identity } : undefined,
    }),
    [room, space.title, tokenCredential]
  )
  const callIdRef = useRef<string>()
  const subscribeAdapterEvents = useCallback(
    (adapter: CommonCallAdapter) => {
      adapter.on("error", (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log("Adapter error event:", e)
        options?.onError?.(e)
      })
      adapter.onStateChange((state: CallAdapterState) => {
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id
          console.log(`Call Id: ${callIdRef.current}`)
        }
      })
    },
    [options]
  )

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter)
      return adapter
    },
    [subscribeAdapterEvents]
  )
  const adapter = useAzureCommunicationCallAdapter(
    adapterArgs,
    async (x) => {
      setIsLoadingSpace(false)
      afterCallAdapterCreate(x)
      return (await options?.afterCreate?.(x)) ?? x
    },
    async (x) => {
      await options?.beforeDispose?.(x)
    }
  )
  const callRef = useRef<Call>()
  const call = callRef.current
  const raiseHandFeature = call?.feature(Features.RaiseHand)
  const spotlightFeature = call?.feature(Features.Spotlight)

  const { cameras, microphones } = adapter?.getState().devices ?? {}
  const hasCameras = cameras && cameras.length > 0
  const hasMicrophones = microphones && microphones.length > 0
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>()
  const [isMuted, setIsMuted] = useState(false)

  const { userinfo } = useSelector<RootState, UserStateType>(
    (state) => state.user
  )

  const roomUsersRef = useRef<RoomUser[]>([])
  const [joinedUsers, setJoinedUsers] = useState<JoinedUser[]>([])
  const presenter = joinedUsers.find((x) => {
    return x.role === "Host"
  })
  const currentUserInRoom = joinedUsers.find(
    (x) => x.twitterId === userinfo.twitterUid
  )
  const isHost = currentUserInRoom?.role === "Host"
  const [isGivenSpeakPermission, setIsGivenSpeakPermission] = useState(false)
  const isSpeakable: boolean = (() => {
    if (
      currentUserInRoom?.role === "Co-Host" ||
      currentUserInRoom?.role === "Host"
    ) {
      return true
    }

    if (isGivenSpeakPermission) {
      return true
    }

    return false
  })()
  const coHosts = joinedUsers?.filter((x) => x.role === "Co-Host")
  const audiences = joinedUsers?.filter((x) => x.role === "Audience")

  // Initialize device permission
  useEffect(() => {
    if (!adapter || !room) {
      return
    }

    ;(async () => {
      const constrain = { audio: true, video: false }
      await adapter.askDevicePermission(constrain)
      adapter.queryCameras()
      adapter.queryMicrophones()
      adapter.querySpeakers()
    })()
  }, [adapter, call, hasCameras, hasMicrophones, room, space.sid])

  useEffect(() => {
    if (!adapter || !room?.identity) {
      return
    }

    ;(async () => {
      if (!roomUsersRef.current.length) {
        await requestRoomUsers(space.sid).then((x) => {
          if (x.result) {
            roomUsersRef.current = x.result
          }
        })
      }

      const call = adapter.joinCall({ microphoneOn: false, cameraOn: false })
      callRef.current = call

      // init room members
      handleNewJoinedParticipant({
        identifier: {
          communicationUserId: room.identity,
          kind: "communicationUser",
        },
      })
      call?.remoteParticipants.forEach((x) => {
        handleNewJoinedParticipant(x)
      })
    })()
  }, [adapter, room?.identity, space.sid])

  const handleNewJoinedParticipant = (
    participant: Partial<RemoteParticipant>
  ) => {
    const { identifier } = participant
    const { communicationUserId } = identifier as CommunicationUserIdentifier
    const user: RoomUser | null =
      roomUsersRef.current?.find((x) => x.identity === communicationUserId) ??
      null

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
      })
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
      })
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
        xs.filter((x) => x.identity !== communicationUserId)
      )
    },
    []
  )

  const handleMutedChange = useCallback(async () => {
    if (!call) {
      return
    }
    if (call.isMuted) {
      await call.unmute()
    } else {
      await call.mute()
    }
    setIsMuted(call.isMuted)
  }, [call])

  const handleRaiseHand = useCallback(() => {
    if (!room) {
      return
    }
    const isHandRaised = isParticipantHandRaised(
      { communicationUserId: room.identity },
      raisedHands
    )
    if (isHandRaised) {
      return raiseHandFeature?.lowerHand()
    }
    return raiseHandFeature?.raiseHand()
  }, [raiseHandFeature, raisedHands, room])

  const [isClosingSpace, setIsClosingSpace] = useState(false)
  const handleCloseSpace = useCallback(() => {
    try {
      setIsClosingSpace(true)
      spotlightFeature?.dispose()
      raiseHandFeature?.dispose()
      adapter?.dispose()
    } finally {
      setCurrentSpace(undefined)
      setIsClosingSpace(false)
    }
  }, [adapter, raiseHandFeature, setCurrentSpace, spotlightFeature])

  useEffect(() => {
    if (
      !call ||
      !raiseHandFeature ||
      !spotlightFeature ||
      !currentUserInRoom ||
      !adapter
    ) {
      return
    }

    setIsMuted(!!adapter.getState().call?.isMuted)
    const handleMutedChanged: IsMutedChangedListener = ({ isMuted }) =>
      setIsMuted(isMuted)
    adapter.on("isMutedChanged", handleMutedChanged)
    adapter.on("participantsJoined", ({ joined }) => {
      joined.forEach(handleNewJoinedParticipant)
    })
    adapter.on("callIdChanged", ({ callId }) => {
      adapter.getState()
    })
    adapter.on("participantsLeft", ({ removed }) => {
      removed.forEach(handleLeavedParticipant)
    })

    const handleHandChanged: RaisedHandListener = () => {
      setRaisedHands(raiseHandFeature.getRaisedHands())
    }
    raiseHandFeature.on("raisedHandEvent", handleHandChanged)
    raiseHandFeature.on("loweredHandEvent", handleHandChanged)
    spotlightFeature.on("spotlightChanged", (e) => {
      e.added.forEach((p) => {
        if (currentUserInRoom.role !== "Audience") {
          return
        }

        if (
          (p.identifier as CommunicationUserIdentifier).communicationUserId ===
          currentUserInRoom.identity
        ) {
          setIsGivenSpeakPermission(true)
        }
      })

      e.removed.forEach(async (p) => {
        if (currentUserInRoom.role !== "Audience") {
          return
        }

        if (
          (p.identifier as CommunicationUserIdentifier).communicationUserId ===
          currentUserInRoom.identity
        ) {
          setIsGivenSpeakPermission(false)
          if (!call.isMuted) {
            await call.mute()
          }
        }
      })
    })
  }, [
    adapter,
    call,
    currentUserInRoom,
    handleLeavedParticipant,
    handleMutedChange,
    raiseHandFeature,
    room,
    space.sid,
    spotlightFeature,
  ])

  const data = useMemo(
    () => ({
      presenter,
      isClosingSpace,
      isHost,
      isMuted,
      isSpeakable,
      currentUserInRoom,
      coHosts,
      audiences,
      raiseHandFeature,
      spotlightFeature,
      raisedHands,
      room,
      adapter,
    }),
    [
      audiences,
      coHosts,
      currentUserInRoom,
      isClosingSpace,
      isHost,
      isMuted,
      isSpeakable,
      presenter,
      raiseHandFeature,
      raisedHands,
      room,
      spotlightFeature,
      adapter,
    ]
  )

  const actions = useMemo(
    () => ({
      handleMutedChange,
      handleRaiseHand,
      handleCloseSpace,
    }),
    [handleCloseSpace, handleMutedChange, handleRaiseHand]
  )

  return {
    ...data,
    ...actions,
  }
}
