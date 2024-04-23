import socketIOClient from 'socket.io-client'
import React, { createContext, useEffect, useState, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import Peer from 'peerjs'
import { v4 } from 'uuid'
import { peerReducer } from './peerReducer'
import { addPeerAction } from './peerAction'

const WS = 'http://localhost:8000'

export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate()
    const [me, setMe] = useState<Peer>()
    const [stream, setStream] = useState<MediaStream>()
    const [peer, dispatch] = useReducer(peerReducer, {})

    const enterRoom = ({ roomID }: { roomID: 'string' }) => {
        console.log(roomID)
        navigate(`/room/${roomID}`)
    }

    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log("participants", { participants })
    }

    useEffect(() => {
        const uID = v4()
        const peer = new Peer(uID)
        setMe(peer)


        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                });
        } catch (error) {
            console.error(error);
        }


        ws.on('room-created', enterRoom)
        ws.on('get-users', getUsers)
    }, [])

    useEffect(() => {
        if (!me || !stream) return
        // console.log("me", stream)
        ws.on('user-joined', (peerId) => {
            // console.log(2)

            const call = me.call(peerId, stream)
            // console.log("call", call)
            call.on('stream', (peerStream) => {
                console.log(2)

                console.log("peerstream", peerStream)
                dispatch(addPeerAction(peerId, peerStream))
            })
        })
        me.on('call', (call) => {
            console.log(3)

            call.answer(stream)
            console.log("call-peer", call.peer)
            call.on('stream', (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream))
            })
        })
    }, [me, stream])

    console.log({ peer })
    return (
        <RoomContext.Provider value={{ ws, me, stream, peer }}>
            {children}
        </RoomContext.Provider>
    )
}