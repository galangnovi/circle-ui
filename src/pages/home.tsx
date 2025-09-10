import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ImagePlus } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialogform } from "@/components/dialog-formThreads";
import { useThreadSocket } from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  addThreadLike,
  removeThreadLike,
  setThreadLikes,
} from "../features/likes/likesSlice";
import { Heart, MessageCircle } from "lucide-react";

export default function Home() {
  type ThreadType = {
    id: number;
    content: string;
    image: string | null;
    user: {
      id: number;
      username: string;
      full_name: string;
      photo_profile: string;
    };
    created_at: string;
    number_of_replies: number;
    likes_count: number;
    isLiked: boolean;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile);
  const likedThreadIds = useSelector((state: RootState) => state.likes.likedThreadIds);

  const [threads, setThreads] = useState<ThreadType[]>([]);

  const handleLike = async (threadId: number) => {
    try {
      const isLiked = likedThreadIds.includes(threadId);
      if (isLiked) {
        await api.delete(`/thread/unLike/${threadId}`, {
          withCredentials: true,
        });
        dispatch(removeThreadLike(threadId));
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId ? { ...t, likes_count: t.likes_count - 1 } : t
          )
        );
      } else {
         await api.post(`/thread/like/${threadId}`, null, {
          withCredentials: true,
        });
        dispatch(addThreadLike(threadId));
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId ? { ...t, likes_count: t.likes_count + 1 } : t
          )
        );
      }
    } catch (error) {
      console.error("Gagal like/unlike thread:", error);
    }
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const response = await api.get("/thread?limit=25", {
        withCredentials: true,
      });

      const data: ThreadType[] = response.data.data;
      setThreads(data);

      const likedIds = data
        .filter((t) => t.isLiked)
        .map((t) => t.id);
      dispatch(setThreadLikes(likedIds));
    };

    fetchThreads();
  }, [dispatch]);

  function timeAgo(dateString: string) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // selisih dalam detik

      if (diff < 60) return `${diff} seconds ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
      if (diff < 31104000) return `${Math.floor(diff / 2592000)} months ago`;
      return `${Math.floor(diff / 31104000)} years ago`;
  }

  // useEffect(() => {
  //   const fetchThreads = async () => {
  //     const response = await api.get("/thread?limit=25", {
  //       withCredentials: true,
  //     });

  //     const data: ThreadType[] = response.data.data;
  //     setThreads(data);
  //   };
  //   fetchThreads();
  // }, []);


  useThreadSocket((newThread) => {
    setThreads((prev) => [newThread, ...prev]);
  });

  return (
    <div className="min-h-screen w-full bg-black pt-0 pb-20 md:pb-0">
      <div className="w-full mb-2">
        <h2 className="text-2xl md:text-3xl flex justify-start text-green-500 font-bold">Home</h2>
      </div>
      <Dialog>
        <DialogTrigger className="flex justify-between items-center w-full rounded-lg mb-6 !bg-transparent !border !border-green-500 p-3" style={{ borderRadius: "20px 20px 20px 20px" }}>
          <div className="flex items-center w-full">
            <img
              src={profile.photo_profile}
              alt="profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2"
            />
            <input
              className="w-full bg-transparent text-white outline-none text-sm md:text-base"
              placeholder="What is happening?!"
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <button className="!bg-transparent">
              <ImagePlus className="!bg-transparent text-green-400" size={20} />
            </button>
            <button className="!bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 !rounded-full hover:bg-green-700 text-sm md:text-base">
              Post
            </button>
          </div>
        </DialogTrigger>
        <Dialogform />
      </Dialog>

      <div className="space-y-4 md:space-y-6 w-full">
        {threads.map((thread) => (
          <div key={thread.id} className="bg-[#1a1a1a] p-3 md:p-4 rounded-lg shadow-md" style={{ borderRadius: "12px" }}>
            <div className="flex items-start space-x-3">
              <img
                src={thread.user.photo_profile}
                alt="profile"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between text-xs md:text-sm text-gray-400">
                  <div className="flex flex-col justify-start items-start gap-1 md:flex-row">
                    <span className="font-bold mr-0.5 text-white text-sm md:text-base">{thread.user.full_name}</span>
                    <span className="text-xs md:text-sm">@{thread.user.username}</span>
                  </div>
                  <span className="text-xs md:text-sm">{timeAgo(thread.created_at)}</span>
                </div>
                <div className="flex justify-start">
                  <p className="text-white mt-1 text-sm md:text-base">{thread.content}</p>
                </div>
                {thread.image && (
                  <img
                    src={thread.image}
                    alt="post"
                    className="rounded-lg mt-2 h-auto w-full object-cover"
                    style={{ borderRadius: "12px" }}
                  />
                )}
                <div className="flex space-x-4 text-gray-500 text-xs md:text-sm mt-3">
                  <button
                    onClick={() => handleLike(thread.id)}
                    className="p-0 w-fit flex items-center gap-1 !bg-transparent hover:text-red-400 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={`${
                        likedThreadIds.includes(thread.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{thread.likes_count}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/thread/${thread.id}`)}
                    className="flex items-center gap-1 hover:underline !bg-transparent hover:text-green-400 transition-colors"
                  >
                    <MessageCircle size={16} className="text-gray-400" />
                    <span>{thread.number_of_replies} Replies</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}