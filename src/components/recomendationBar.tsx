import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Button } from "./ui/button";



export default function Recomendationbar() {
    
    const [recomendation, setRecomendation] = useState<any[]>([])
    const [tempFollowStatus, setTempFollowStatus] = useState<{ [id: number]: boolean }>({});
    
    useEffect( () => {
        const fetchData = async () => {
        const recomendation = await api.get("/recomendation", {withCredentials: true})
          const data = recomendation.data.data
          setRecomendation(data)
      };
      fetchData()
    }, [])

    const handleFollowToggle = (targetId: number, currentlyFollowing: boolean) => {
  setTempFollowStatus((prev) => ({
    ...prev,
    [targetId]: !currentlyFollowing,
  }));

  setTimeout(async () => {
    try {
      if (currentlyFollowing) {
        await api.delete(`/follows`, {
          data: { followed_id: targetId }, withCredentials: true
        });
      } else {
        await api.post(`/follows`, { followed_id: targetId }, { withCredentials: true });
      }

      if (!currentlyFollowing) {
        setRecomendation((prev) => prev.filter((r) => r.id !== targetId));
      }
    } catch (err) {
      console.error("Gagal follow/unfollow:", err);

      setTempFollowStatus((prev) => ({
        ...prev,
        [targetId]: currentlyFollowing,
      }));
    }
  }, 1500);
};
    
  return (
<aside className=" hidden lg:block w-[26%] px-4 py-6 text-white space-y-6 fixed top-0 right-0">
  <div>
    <h4 className="font-semibold mb-3 text-white">Suggested for you</h4>
    <ul className="flex flex-col gap-4">
    {recomendation.map((r) => (
            <li key={r.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={r.avatar}
                  alt={r.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <p className="text-white font-semibold">{r.name}</p>
                  <p className="text-neutral-400 text-xs">@{r.username}</p>
                </div>
              </div>
            
                <Button
                    variant={r.is_following || tempFollowStatus[r.id] ? "secondary" : "secondary"}
                    onClick={() => handleFollowToggle(r.id, r.is_following || tempFollowStatus[r.id])}
                  >
                    {(r.is_following || tempFollowStatus[r.id]) ? "Following" : "Follow"}
                </Button>
            </li>
          ))}
         </ul>
  </div>

  
  <footer className="text-xs text-gray-400 mt-6">
    <p>Developed by Galang Anggara • 🔗</p>
  </footer>
</aside>
  )}