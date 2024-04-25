import { Socket } from "socket.io";
import {v4 as uuidV4} from 'uuid'

const rooms: Record<string,string[]> = {}

interface RoomParams{
    roomID : 'string'
     peerID : 'string'
    }

export const roomHandler = (socket:Socket)=>{
    const createRoom = ()=>{
        const roomID = uuidV4();
        rooms[roomID] = [];
        socket.emit("room-created",{roomID})
        console.log("User created the room.", roomID)
    }
    const joinRoom = ({roomID , peerID}: RoomParams)=>{
        if(rooms[roomID]){
         rooms[roomID].push(peerID)
        socket.join(roomID)
        socket.on('ready',()=>{
            socket.broadcast.to(roomID).emit('user-joined',peerID);
            })
        // socket.to(roomID).emit('user-joined',{peerID})
        socket.emit('get-users',{
            roomID,
            participants: rooms[roomID]
        })
        console.log(`User ${peerID} joined the room.`, roomID)
        }

        socket.on('disconnect',()=>{
            console.log("user disconnected!")
            leaveRoom({roomID,peerID})
        })

    }

    const leaveRoom = ({roomID,peerID}:RoomParams)=>{
        rooms[roomID] = rooms[roomID].filter(id => id !== peerID)
        socket.to(roomID).emit('user-disconnected',peerID)
    }
    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}