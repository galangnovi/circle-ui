import { DialogEditProfile } from "@/components/edit-Profile";
import ImageThreads from "@/components/imageInProfile";
import ContentThreads from "@/components/threadsInProfile";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { setProfile } from "@/features/profile/profileSlice";
import { api } from "@/services/api";
import type { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";





export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector((state: RootState) => state.profile);
    const [activeTab, setActiveTab] = useState<"image" | "content">("image")

     useEffect(() => {
            const fetchThreads = async () => {
              const res = await api.get("/myProfile", {withCredentials: true});
              const profile = res.data.data
              dispatch(setProfile(profile))
          };
            fetchThreads();
            
          }, [dispatch]);

    return (
        <div className="w-full">
            <div className="h-20 overflow-hidden rounded-t-xl" style={{ borderRadius: "8px 8px 0 0" }}>
                {profile.cover_photo ? <img src={profile.cover_photo}
                alt="cover" className="h-fit w-full"/> : <div className="h-full bg-gradient-to-r from-green-400 to-yellow-300 !rounded-t-xl" ></div> }
            </div>
            <div className=" w-full px-4 pb-4 -mt-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img
                    src={profile.photo_profile}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-[#16181c]"
                    />
                </div>
                <div className="-mb-20">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-5xl px-1 py-1 !rounded-full !border-gray-500 !bg-transparent text-white hover:!bg-gray-700 -mb-24">
                            Edit Profile
                            </button>
                        </DialogTrigger>
                        <DialogEditProfile/>
                    </Dialog>
                </div>
            
            </div>

            <div className="px-4 pb-4 text-sm flex flex-col items-start">
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

            <div className="w-full px-4 mt-4">
                <div className="flex !border-b mb-4">
                    <p
                    className={`flex-1 py-2 text-center text-sm !focus:outline-none cursor-pointer ${
                        activeTab === "image"
                        ? "!text-white !border-b-2 !border-white !font-semibold"
                        : "!text-gray-400"
                    }`}
                    onClick={() => setActiveTab("image")}
                    >
                    Image
                    </p>
                    <p
                    className={`flex-1 py-2 text-center text-sm focus:!outline-none cursor-pointer ${
                        activeTab === "content"
                        ? "text-white !border-b-2 !border-white font-semibold"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("content")}
                    >
                    Content
                </p>
                </div>
                <div>
                    {activeTab === "image" ? <ImageThreads/> : <ContentThreads/> }
                </div>
            </div>

        </div>
    )
}