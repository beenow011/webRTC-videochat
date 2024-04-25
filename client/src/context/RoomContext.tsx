import socketIOClient from 'socket.io-client'
import React, { createContext, useEffect, useState, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import Peer from 'peerjs'
import { v4 } from 'uuid'
import { peerReducer } from './peerReducer'
import { addPeerAction, removePeerAction } from './peerAction'
import { simulateWebcamStream, videoPath } from "../fake_stream"
const WS = 'http://localhost:8000'

export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate()
    const [me, setMe] = useState<Peer>()
    const [stream, setStream] = useState<MediaStream>()
    const [peer, dispatch] = useReducer(peerReducer, {})
    const [screenSharingId, setScreenSharingId] = useState<string>("")

    const enterRoom = ({ roomID }: { roomID: 'string' }) => {
        // console.log(roomID)
        navigate(`/room/${roomID}`)
    }

    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log("participants", participants)
        // setParticipats(participants)
    }

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId))
    }

    const switchStream = (stream: MediaStream) => {
        setStream(stream)
        setScreenSharingId(me?.id || '')
    }
    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(switchStream)
        } else {

            navigator.mediaDevices.getDisplayMedia({}).then(switchStream)
        }
    }

    useEffect(() => {
        const uID = v4()
        const peer = new Peer(uID, {
            host: 'localhost',
            port: 9001,
            path: '/myapp'
        })
        setMe(peer)


        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                });

        } catch (error) {

            console.error('Error:', error);

        }


        ws.on('room-created', enterRoom)
        ws.on('get-users', getUsers)
        ws.on('user-disconnected', removePeer)
        // console.log("check!!!!!!!", part)

    }, [])

    useEffect(() => {
        if (!me) return
        if (!stream) return
        // console.log("me", me, stream)
        ws.on('user-joined', (peerId) => {
            // console.log(2)
            const call = me.call(peerId, stream)
            console.log("call", call)
            call.on('stream', (remoteStream) => {
                dispatch(addPeerAction(peerId, remoteStream))
            })

            call.on('error', (err) => {
                console.log(err)
            })
        })

        me.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (remoteStream) => {
                dispatch(addPeerAction(call.peer, remoteStream))
            })
        })
        me.on('error', (error) => {
            console.log(error)
        })
        ws.emit("ready")
    }, [me, stream])

    // console.log({ peer })
    return (
        <RoomContext.Provider value={{ ws, me, stream, peer, shareScreen }}>
            {children}
        </RoomContext.Provider>
    )
}