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


    function timeAgo(dateString?: string) {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diff < 60) return `${diff} seconds ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
      if (diff < 31104000) return `${Math.floor(diff / 2592000)} months ago`;
      return `${Math.floor(diff / 31104000)} years ago`;
    }
    
    return (
        <div className="space-y-6 w-full">
        {threadsByUser.map((thread) => (
          <div key={thread.id} onClick={() => navigate(`/thread/${thread.id}`)} className="bg-[#1a1a1a] p-4 rounded-lg" style={{ borderRadius: "6px 6px 6px 6px" }}>
            <div className="flex items-start space-x-3 w-full">
              <img
                src={thread.user.photo_profile}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col w-full">
                <div className="flex flex-col items-start max-w-full text-sm text-gray-400">
                  <div className="flex justify-between gap-1">
                    <span className="font-bold text-white">{thread.user.full_name}</span>
                    <span>{thread.created_at && timeAgo(thread.created_at)}</span>
                  </div>
                  <span>@{thread.user.username}</span>
                  
                </div>
                <div className="flex flex-col mt-1">
                  <div className="flex justify-start">
                    <p className="text-white mt-1">{thread.content}</p>
                  </div>
                  <div className="flex justify-start ml-1 gap-6  text-gray-400 text-sm">
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
          </div>
        ))}
      </div>
    )

}