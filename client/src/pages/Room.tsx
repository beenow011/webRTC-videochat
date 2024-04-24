import { ReactNode, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../context/RoomContext"
import { VideoPlayer } from "../components/VideoPlayer"
import { PeerState } from "../context/peerReducer"

export const Room = () => {
    const { roomID } = useParams()
    const { ws, me, stream, peer } = useContext(RoomContext)

    useEffect(() => {
        if (me)
            ws.emit('join-room', { roomID, peerID: me._id })
    }, [roomID, me, ws])
    // console.log("peer", peer)
    return (
        <div>
            Room id:  {roomID}
            <div className="grid grid-cols-4 gap-4">
                <VideoPlayer stream={stream} />

                {Object.values(peer as PeerState).map(peer => (
                    <VideoPlayer stream={peer.stream} />

                ))}
            </div>
        </div>
    )
}