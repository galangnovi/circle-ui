import { api } from "@/services/api"
import { useEffect, useState } from "react"
import { Heart, MessageCircle } from "lucide-react";


export default function ImageThreads() {
    const [imageData, setImageData] = useState<any[]>([])
    
    useEffect(() => {
        const fetchImage = async () => {
            const res = await api.get("/thread/image")
            setImageData(res.data.data)
        };
        fetchImage()
    },[])
    return (
        <div className="flex flex-wrap w-full justify-between">
            {imageData.map((I) => (
                <div key={I.id} className="w-[32%] aspect-square mb-5">
                    <img src={I.image} 
                    className="w-full h-full object-cover rounded-md"
                    style={{ borderRadius: "5px 5px 5px 5px" }}
                    alt="" />
                    <div className="-mt-7 flex justify-between sm:justify-center sm:gap-3 items-center text-gray-400 text-sm">
                        <div
                            className="flex items-center gap-1 hover:!text-red-500 transition-colors !bg-transparent"
                        >
                            <Heart
                            size={18}
                            className={`${I.likes_count > 0 ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                            />
                            <span>{I.likes_count}</span>
                        </div>

                        <div
                            className="flex items-center gap-1 hover:text-green-500 transition-colors !bg-transparent"
                        >
                            <MessageCircle size={18} className="text-gray-400" />
                            <span>{I.number_of_replies ? I.number_of_replies : 0} Replies</span>
                        </div>
                    </div>
                    
                </div>
            )) }
        </div>
    )
}


