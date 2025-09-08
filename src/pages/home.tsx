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
    <div className="min-h-screen w-full bg-black pt-0">
      <div className="w-full">
        <h2 className="text-2xl flex justify-start text-green-500 font-bold">Home</h2>
      </div>
      <Dialog>
        <DialogTrigger className="flex justify-between items-center w-full rounded-lg mb-6 !bg-transparent !border !border-green-500" style={{ borderRadius: "20px 20px 20px 20px" }}>
          <div className="flex items-center w-full ">
            <img
              src={profile.photo_profile}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
            <input
              className="w-full bg-transparent text-white  outline-none"
              placeholder="What is happening?!"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button className="!bg-transparent">
              <ImagePlus className="!bg-transparent text-green-400" />
            </button>
            <button className="!bg-green-600 text-white px-4 py-2 !rounded-full hover:bg-green-700">
              Post
            </button>
          </div>
        </DialogTrigger>
        <Dialogform />
      </Dialog>

      <div className="space-y-6 w-full">
        {threads.map((thread) => (
          <div key={thread.id} className="bg-[#1a1a1a] p-4 rounded-lg " style={{ borderRadius: "6px 6px 6px 6px" }}>
            <div className="flex items-start space-x-3">
              <img
                src={thread.user.photo_profile}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex flex-col justify-start items-start gap-1 sm:!flex-row">
                    <span className="font-bold mr-0.5 text-white">{thread.user.full_name}</span>
                    <span>@{thread.user.username}</span>
                  </div>
                  <span>{new Date(thread.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-start">
                  <p className="text-white mt-1">{thread.content}</p>
                </div>
                {thread.image && (
                  <img
                    src={thread.image}
                    alt="post"
                    className="rounded-lg mt-2 h-auto w-full xl:w-[95%] object-cover"
                    style={{ borderRadius: "6px 6px 6px 6px" }}
                  />
                )}
                <div className="flex space-x-4 text-gray-500 text-sm mt-3">
                  <button onClick={() =>  handleLike(thread.id)}  className="p-0 w-fit !bg-transparent">
                    {likedThreadIds.includes(thread.id) ? '❤️' : '🤍'} {thread.likes_count}
                  </button>
                  <button
                    onClick={() => navigate(`/thread/${thread.id}`)}
                    className="flex items-center hover:underline !bg-transparent"
                  >
                    💬 {thread.number_of_replies} Replies
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