import { api } from "@/services/api"
import { useEffect, useState } from "react"


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
                    <div className=" flex justify-center gap-3 -mt-7">
                        <p>{I.likes_count} ❤️</p>
                        <p>{I.number_of_replies ? I.number_of_replies : 0 } Replies</p>
                    </div>
                    
                </div>
            )) }
        </div>
    )
}


