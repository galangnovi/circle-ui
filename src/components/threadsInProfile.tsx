import { api } from "@/services/api"
import { useEffect, useState } from "react"



export default function ContentThreads() {
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
          <div key={thread.id} className="bg-[#1a1a1a] p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <img
                src={`http://localhost:3000/uploads/${encodeURIComponent(thread.user.photo_profile)}`}
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
                <div className="flex space-x-4 text-gray-500 text-sm mt-3">
                  <p>
                    {thread.likes_count}❤️
                  </p>
                  <p>
                    💬 {thread.number_of_replies ? thread.number_of_replies : 0} Replies
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )

}