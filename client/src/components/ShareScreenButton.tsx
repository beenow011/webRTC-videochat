import { ScreenShare, User2Icon } from "lucide-react";
import React, { useState } from "react";

export const ShareScreenButton: React.FC<{ onClick: () => void, shareTrue: boolean }> = ({ onClick, shareTrue }) => {
    return (
        <button className="bg-blue-300 rounded-md m-4 p-3 hover:bg-blue-500" onClick={onClick}>
            {
                !shareTrue ? <ScreenShare color="red" size={24} /> : <User2Icon color="red" size={24} />
            }
        </button>
    )
}