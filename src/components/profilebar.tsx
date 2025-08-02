import {  useEffect, useState } from "react";
import { api } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setProfile } from "@/features/profile/profileSlice";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogEditProfile } from "./edit-Profile";
import { Button } from "./ui/button";



export default function Profilebar() {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector((state: RootState) => state.profile);
    const [recomendation, setRecomendation] = useState<any[]>([])
    const [tempFollowStatus, setTempFollowStatus] = useState<{ [id: number]: boolean }>({});
    useEffect(() => {
        const fetchThreads = async () => {
          const res = await api.get("/myProfile", {withCredentials: true});
          const profile = res.data.data
          dispatch(setProfile(profile))
      };
        fetchThreads();

      }, [dispatch]);

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
        await api.delete(`/follows`, {data: { followed_id: targetId }, withCredentials: true} );
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
    <aside className=" hidden lg:block w-[26%] px-4 py-6 text-white space-y-6 fixed right-0 top-0">
  
  <div className="bg-[#16181c]  shadow-md !overflow-hidden relative" style={{ borderRadius: "8px 8px 8px 8px" }}>
    <div className="h-20 overflow-hidden" style={{ borderRadius: "6px 6px 0 0" }}>
        {profile.cover_photo ? <img src={`${profile.cover_photo}`}
          alt="cover" className="h-fit w-full"/> : <div className="h-full bg-gradient-to-r from-green-400 to-yellow-300"></div> }
    </div>
    <div className="px-4 pb-4 -mt-10 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={profile.photo_profile}
          alt="profile"
          className="w-16 h-16 rounded-full object-cover border-4 border-[#16181c]"
        />
      </div>
      <Dialog>
        <DialogTrigger asChild className="md:-mr-10 xl:-mr-40">
            <button className="text-4xl px-1 py-1 !rounded-full !border-gray-500 !bg-transparent text-white hover:!bg-gray-700 -mb-15">
              Edit Profile
            </button>
        </DialogTrigger>
        <DialogEditProfile/>
      </Dialog>
    </div>

    
    <div className="px-4 pb-4 text-sm flex flex-col items-start" style={{ borderRadius: "0 0 6px 6px" }}>
       <div className="flex flex-col items-start">
          <h3 className="text-white font-bold text-base leading-5">✨ {profile.full_name} ✨</h3>
          <p className="text-gray-400 text-sm">@{profile.username}</p>
        </div>
      
      <p className="text-gray-300 mb-3">{profile.bio}</p>
      <div className="flex gap-4 text-gray-400">
        <span><span className="font-semibold text-white">{profile.followingCount}</span> Following</span>
        <span><span className="font-semibold text-white">{profile.followerCount}</span> Followers</span>
      </div>
    </div>
  </div>

  
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
                    className="!bg-gray-800"
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