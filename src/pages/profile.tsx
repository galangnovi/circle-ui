import { DialogEditProfile } from "@/components/edit-Profile";
import ImageThreads from "@/components/imageInProfile";
import ContentThreads from "@/components/threadsInProfile";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { setProfile } from "@/features/profile/profileSlice";
import { api } from "@/services/api";
import type { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoveLeft } from 'lucide-react';
import { Link } from "react-router-dom";





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
        <div className="w-full pb-20 md:pb-0">
            <div className="w-full mb-0">
                <Link to="/">
                    <h2 className="text-2xl md:text-3xl flex justify-start items-center text-green-500 font-bold"><MoveLeft size={24} className="mr-2"/> Profile</h2>
                </Link>
            </div>
            <div className="h-16 md:h-20 overflow-hidden rounded-t-xl" style={{ borderRadius: "12px 12px 0 0" }}>
                {profile.cover_photo ? <img src={profile.cover_photo}
                alt="cover" className="h-fit w-full"/> : <div className="h-full bg-gradient-to-r from-green-400 to-yellow-300 !rounded-t-xl" ></div> }
            </div>
            <div className=" w-full px-4 pb-4 -mt-8 md:-mt-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img
                    src={profile.photo_profile}
                    alt="profile"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-[#16181c]"
                    />
                </div>
                <div className="-mb-16 md:-mb-20">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-3xl md:text-5xl px-1 py-1 !rounded-full !border-gray-500 !bg-transparent text-white hover:!bg-gray-700 -mb-20 md:-mb-24">
                            Edit Profile
                            </button>
                        </DialogTrigger>
                        <DialogEditProfile/>
                    </Dialog>
                </div>

            </div>

            <div className="px-4 pb-4 text-sm flex flex-col items-start">
            <div className="flex flex-col items-start">
                <h3 className="text-white font-bold text-sm md:text-base leading-5">✨ {profile.full_name} ✨</h3>
                <p className="text-gray-400 text-xs md:text-sm">@{profile.username}</p>
                </div>

            <p className="text-gray-300 mb-3 text-sm md:text-base">{profile.bio}</p>
            <div className="flex gap-4 text-gray-400 text-xs md:text-sm">
                <span><span className="font-semibold text-white">{profile.followingCount}</span> Following</span>
                <span><span className="font-semibold text-white">{profile.followerCount}</span> Followers</span>
            </div>
            </div>

            <div className="w-full px-4 mt-4">
                <div className="flex !border-b mb-4">
                    <p
                    className={`flex-1 py-2 text-center text-xs md:text-sm !focus:outline-none cursor-pointer ${
                        activeTab === "image"
                        ? "!text-green-500 !border-b-2 !border-green-500 !font-semibold"
                        : "!text-gray-400"
                    }`}
                    onClick={() => setActiveTab("image")}
                    >
                    Image
                    </p>
                    <p
                    className={`flex-1 py-2 text-center text-xs md:text-sm focus:!outline-none cursor-pointer ${
                        activeTab === "content"
                        ? "text-green-500 !border-b-2 !border-green-500 font-semibold"
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