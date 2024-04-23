import { ReactNode, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../context/RoomContext"
import { VideoPlayer } from "../components/VideoPlayer"

export const Room = () => {
    const { roomID } = useParams()
    const { ws, me, stream, peer } = useContext(RoomContext)

    useEffect(() => {
        if (me)
            ws.emit('join-room', { roomID, peerID: me._id })
    }, [roomID, me, ws])
    // console.log(me)
    return (
        <div>
            Room id:  {roomID}
            <div>
                <VideoPlayer stream={stream} />
            </div>
        </div>
    )
}