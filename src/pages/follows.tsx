import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useNavigate } from "react-router-dom"

interface UserData {
  id: number
  username: string
  name: string
  avatar: string
  is_following: boolean
}

export default function FollowTabs() {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers")
  const [followers, setFollowers] = useState<UserData[]>([])
  const [following, setFollowing] = useState<UserData[]>([])
  const profile = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const res = await api.get(`/follows?type=${activeTab}`)
      const data: UserData[] = res.data.data
      
        if (activeTab === "followers") {
          setFollowers(data);
        } else {
          setFollowing(data);
        }
      
    } catch (err) {
      console.error("Gagal fetch data:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const handleFollowToggle = async (targetId: number, currentlyFollowing: boolean) => {
    try {
      if (currentlyFollowing) {
        await api.delete(`/follows`, {
          data: { followed_id: targetId }
        });
      } else {
        await api.post(`/follows`,{followed_id: targetId}, {withCredentials: true}
           );
      }
      navigate(0);
    } catch (err) {
      console.error("Gagal follow/unfollow:", err);
    }
  };

  const renderList = (data: UserData[]) =>
    data.map((user) => (
      <div key={user.id} className="flex items-center justify-between border-b py-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          
          </div>
        </div>
        {user.id !== currentUserId && (
          <Button
          className="!bg-gray-800"
            variant={user.is_following ? "secondary" : "secondary"}
            onClick={() => handleFollowToggle(user.id, user.is_following)}
          >
            {user.is_following ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    ))

  
  const currentUserId = profile.id 

  return (
    <div className="w-full px-4 mt-4">
      <div className="flex !border-b mb-4">
        <p
          className={`flex-1 py-2 text-center text-sm !focus:outline-none cursor-pointer ${
            activeTab === "followers"
              ? "!text-white !border-b-2 !border-white !font-semibold"
              : "!text-gray-400"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </p>
        <p
          className={`flex-1 py-2 text-center text-sm focus:!outline-none cursor-pointer ${
            activeTab === "following"
              ? "text-white !border-b-2 !border-white font-semibold"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
      </p>
      </div>
      <div>
        {activeTab === "followers" ? renderList(followers) : renderList(following)}
      </div>
    </div>
  )
}