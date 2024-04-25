import { ReactNode, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../context/RoomContext"
import { VideoPlayer } from "../components/VideoPlayer"
import { PeerState } from "../context/peerReducer"
import { ShareScreenButton } from "../components/ShareScreenButton"

export const Room = () => {
    const { roomID } = useParams()
    const { ws, me, stream, peer, shareScreen } = useContext(RoomContext)
    const [shareTrue, setShareTrue] = useState<boolean>(false)
    const clickFn = () => {
        shareScreen()
        setShareTrue(prev => !prev)
    }

    useEffect(() => {
        if (me)
            ws.emit('join-room', { roomID, peerID: me._id })
    }, [roomID, me, ws])
    // console.log("peer", peer)
    return (
        <div className=" w-screen h-screen p-10 bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600">
            <h1 className="m-4 text-2xl text-white text-center font-semibold">Room id : <span className="text-fuchsia-400 font-bold">{roomID}</span>  </h1>
            <ul className="grid grid-cols-4 gap-4 ">
                <li className="p-5 border rounded-md border-gray-100"><VideoPlayer stream={stream} />
                    <p className="text-xl text-pink-400 text-center font-semibold">You</p></li>

                {Object.values(peer as PeerState).map((peer, i) => (
                    <li key={i} className="p-5  border rounded-md border-gray-100">  <VideoPlayer stream={peer.stream} />
                        <p className="text-xl text-white text-center font-semibold">user {i + 1}</p>
                    </li>

                ))}
            </ul>
            <div className="fixed -bottom-0 p-5 flex justify-center items-center w-full ">
                <div className="bg-slate-800/20 m-3 rounded-r-full p-2 rounded-l-full w-96 flex justify-center items-center">

                    <ShareScreenButton onClick={
                        clickFn
                    } shareTrue={shareTrue} />
                </div>
            </div>
        </div>
    )
}