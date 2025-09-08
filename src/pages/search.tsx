import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input" // jika pakai shadcn
import { api } from "@/services/api"
import { Link } from "react-router-dom"
import { MoveLeft } from "lucide-react"


interface User {
  id: number
  username: string
  name: string
  avatar: string
  follower: number
  is_following: boolean
}

export default function SearchResult() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        fetchSearchResults()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const fetchSearchResults = async () => {
    try {
      const res = await api.get(`/search?keyword=${query}`)
      setResults(res.data.data)
      
    } catch (err) {
      console.error("Gagal mencari user", err)
    }
  }

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
      fetchSearchResults();
    } catch (err) {
      console.error("Gagal follow/unfollow:", err);
    }
  };

  return (
    <div className="w-full px-6 py-4">
      <div className="w-full mb-2">
          <Link to="/">
              <h2 className="text-3xl flex justify-start items-center text-green-500 font-bold"><MoveLeft/> Search User</h2>
          </Link>
      </div>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="!bg-[#272727] text-white border border-neutral-700 rounded-full"
        />
      </div>

      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-neutral-400 text-xs">@{user.username}</p>
                  <p className="text-neutral-400 text-xs">{user.follower} Followers</p>
                </div>
              </div>
              <button onClick={()=> handleFollowToggle(user.id, user.is_following)} className="text-sm px-4 py-1 !bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-300 transition">
                {user.is_following ? "Followed":"Follow"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && (
        <p className="text-neutral-500 mt-6 text-center">No users found.</p>
      )}
    </div>
  )
}