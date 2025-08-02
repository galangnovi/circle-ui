import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ImagePlus } from 'lucide-react';
import { useAuth } from "../hooks/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  const { user } = useAuth();
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
      const response = await api.get("http://localhost:3000/api/v1/thread?limit=25", {
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

  useEffect(() => {
    const fetchThreads = async () => {
      const response = await api.get("http://localhost:3000/api/v1/thread?limit=25", {
        withCredentials: true,
      });

      const data: ThreadType[] = response.data.data;
      setThreads(data);
    };
    fetchThreads();
  }, []);


  useThreadSocket((newThread) => {
    setThreads((prev) => [newThread, ...prev]);
  });

  return (
    <div className="min-h-screen w-full bg-black pt-0">
      <Dialog>
        <DialogTrigger className="flex justify-between items-center w-full rounded-lg mb-6">
          <div className="flex items-center w-full">
            <img
              src={`http://localhost:3000/uploads/${encodeURIComponent(String(profile.photo_profile))}`}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
            <input
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
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
          <div key={thread.id} className="bg-[#1a1a1a] p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <img
                src={`http://localhost:3000/uploads/${encodeURIComponent(profile.photo_profile)}`}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex flex-col justify-start items-start gap-1 sm:!flex-row">
                    <span className="font-bold mr-0.5 text-white">{profile.full_name}</span>
                    <span>@{profile.username}</span>
                  </div>
                  <span>{new Date(thread.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-start">
                  <p className="text-white mt-1">{thread.content}</p>
                </div>
                {thread.image && (
                  <img
                    src={`http://localhost:3000/uploads/${encodeURIComponent(thread.image)}`}
                    alt="post"
                    className="rounded-lg mt-2 h-auto w-full xl:w-[95%] object-cover"
                  />
                )}
                <div className="flex space-x-4 text-gray-500 text-sm mt-3">
                  <button onClick={() =>  handleLike(thread.id)}  className="p-0 w-fit">
                    {likedThreadIds.includes(thread.id) ? '❤️' : '🤍'} {thread.likes_count}
                  </button>
                  <button
                    onClick={() => navigate(`/thread/${thread.id}`)}
                    className="flex items-center hover:underline"
                  >
                    💬 {thread.number_of_replies ? thread.number_of_replies : 0} Replies
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