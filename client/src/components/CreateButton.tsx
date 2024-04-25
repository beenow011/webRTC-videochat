import { useContext, useState } from "react"
import { RoomContext } from "../context/RoomContext"

export const Join: React.FC = () => {

    const { ws } = useContext(RoomContext)
    const createRoom = () => {
        ws.emit("create-room")
    }
    return (
        <button onClick={createRoom} className='bg-white p-3 rounded-md text-lg font-semibold  hover:bg-emerald-200 text-emerald-600 antialiased'>Start new meeting</button>
    )
}