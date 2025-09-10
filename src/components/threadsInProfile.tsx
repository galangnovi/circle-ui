import { api } from "@/services/api"
import { useEffect, useState } from "react"
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function ContentThreads() {
    const navigate = useNavigate();
    const [threadsByUser, setThreadsByUser] = useState<any[]>([])
    useEffect (()=> {
        const fetchThreads = async () => {
            const res = await api.get("/thread/user")
            setThreadsByUser(res.data.data)
        };
        fetchThreads()
        
    },[])



    
    return (
        <div className="space-y-6 w-full">
        {threadsByUser.map((thread) => (
          <div key={thread.id} onClick={() => navigate(`/thread/${thread.id}`)} className="bg-[#1a1a1a] p-4 rounded-lg" style={{ borderRadius: "6px 6px 6px 6px" }}>
            <div className="flex items-start space-x-3">
              <img
                src={thread.user.photo_profile}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <div>
                    <span className="font-bold mr-0.5 text-white">{thread.user.full_name}</span>
                    <span>@{thread.user.username}</span>
                  </div>
                  <span>{new Date(thread.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-start">
                  <p className="text-white mt-1">{thread.content}</p>
                </div>
                <div className="flex justify-center gap-6 -mt-7 text-gray-400 text-sm">
                    <button
                        className="flex items-center gap-1 hover:text-red-500 transition-colors !bg-transparent"
                    >
                          <Heart
                        size={18}
                        className={`${thread.likes_count > 0 ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                        />
                        <span>{thread.likes_count}</span>
                    </button>

                    <button
                        className="flex items-center gap-1 hover:text-green-500 transition-colors !bg-transparent"
                    >
                        <MessageCircle size={18} className="text-gray-400" />
                        <span>{thread.number_of_replies ? thread.number_of_replies : 0} Replies</span>
                    </button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )

}