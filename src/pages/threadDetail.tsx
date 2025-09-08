import { addReplyLike, addThreadLike, removeReplyLike, removeThreadLike, setReplyLikes, setThreadLikes } from '@/features/likes/likesSlice';
import { useThreadSocket } from '@/hooks/useSocket';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import { ImagePlus, MoveLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

export default function ThreadsDetailPage() {
  const [thread, setThread] = useState<any>({});
  const [replies, setReplies] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile);
  const { thread_id } = useParams();
  const likedThreadIds = useSelector((state: RootState) => state.likes.likedThreadIds);
  const likedRepliesIds = useSelector((state: RootState) => state.likes.likedRepliesIds);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const threadDetail = await api.get(`/thread/${thread_id}`, { withCredentials: true });
        setThread(threadDetail.data.data);
        
          const data = threadDetail.data.data;
            if (data.isLiked) {
              dispatch(setThreadLikes([data.id]));
            } else {
              dispatch(setThreadLikes([]));
            }

        const repliesRes = await api.get(`/reply?thread_id=${thread_id}&limit=25`, { withCredentials: true });
        setReplies(repliesRes.data.data);
        
         const repliesData = repliesRes.data.data;
          const likedReplyIds = repliesData
          .filter((reply: any) => reply.isLiked)
          .map((reply: any) => reply.id);
          dispatch(setReplyLikes(likedReplyIds));
        
      } catch (err) {
        console.error('Gagal fetch thread:', err);
      }
    };
    fetchThreads();
  }, [dispatch]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const threadDetail = await api.get(`/thread/${thread_id}`, { withCredentials: true });
        setThread(threadDetail.data.data);
          const data = threadDetail.data.data;
            if (data.isLiked) {
              dispatch(setThreadLikes([data.id]));
            } else {
              dispatch(setThreadLikes([]));
            }

        const repliesRes = await api.get(`/reply?thread_id=${thread_id}&limit=25`, { withCredentials: true });
        setReplies(repliesRes.data.data);
        

         const repliesData = repliesRes.data.data;
          const likedReplyIds = repliesData
          .filter((reply: any) => reply.isLiked)
          .map((reply: any) => reply.id);
          dispatch(setReplyLikes(likedReplyIds));
        
      } catch (err) {
        console.error('Gagal fetch thread:', err);
      }
    };
    fetchThreads();
  }, []);

  
  useThreadSocket((newReply) => {
    setReplies(prev => [newReply, ...prev]);
  });

  const handlenewReply = async () => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      await api.post(`/reply?thread_id=${thread_id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(0);
    } catch (error: any) {
      console.log(error.response?.data?.message || 'Failed to post thread') 
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLikeThread = async (threadId: number) => {
      try {
        const isLiked = likedThreadIds.includes(threadId);
        if (isLiked) {
          await api.delete(`/thread/unLike/${threadId}`, {
            withCredentials: true,
          });
          dispatch(removeThreadLike(threadId));
          setThread((prev:any) => ({
              ...prev, likes_count: prev.likes_count - 1 
            })
          ) 

        } else {
           await api.post(`/thread/like/${threadId}`, null, {
            withCredentials: true,
          });
          
          dispatch(addThreadLike(threadId));
          setThread((prev:any) => ({
             ...prev, likes_count: prev.likes_count + 1 
          })
          );
        }
      } catch (error) {
        console.error("Gagal like/unlike thread:", error);
      }
    };

    const handleLikeReply = async (replyId: number) => {
      try {
        const isLiked = likedRepliesIds.includes(replyId);
        if (isLiked) {
          await api.delete(`/reply/unLike/${replyId}`, {
            withCredentials: true,
          });
          dispatch(removeReplyLike(replyId));
          setReplies((prev:any) =>
            prev.map((t:any) =>
              t.id === replyId ? { ...t, likes_count: t.likes_count - 1 } : t
            )
          );
        } else {
           await api.post(`/reply/like/${replyId}`, null, {
            withCredentials: true,
          });
          
          dispatch(addReplyLike(replyId));
          setReplies((prev:any) =>
            prev.map((t:any) =>
              t.id === replyId ? { ...t, likes_count: t.likes_count + 1 } : t
            )
          );
        }
      } catch (error) {
        console.error("Gagal like/unlike Reply:", error);
      }
    };
  

  return (
    <div className="w-full bg-black pt-6">
      <div className="w-full mb-2">
          <Link to="/">
              <h2 className="text-3xl flex justify-start items-center text-green-500 font-bold"><MoveLeft/> Thread Details</h2>
          </Link>
      </div>
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] p-4 rounded-lg" style={{ borderRadius: "4px 4px 4px 4px" }}>
          <div className="flex items-start space-x-3">
            <img
              src={thread?.user?.photo_profile}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col justify-start text-white">
                <div className="flex flex-col justify-start items-start gap-1 sm:!flex-row">
                  <span className="font-bold">{thread?.user?.full_name}</span>
                  <span>@{thread?.user?.username}</span>
                </div>
                <div className='flex justify-start'>
                    <p className="text-white mt-1">{thread.content}</p>
                </div>
              </div>
              {thread.image && (
                <img
                  src={thread.image}
                  alt="post"
                  className="rounded-lg mt-2 max-h-[400px] w-full object-cover"
                  style={{ borderRadius: "6px 6px 6px 6px" }}
                />
              )}
              <div className="flex items-start mt-3 gap-2">
                <span className="font-light text-sm">{new Date(thread?.created_at).toLocaleTimeString()}</span>
                <span className="font-light text-sm">{new Date(thread?.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-4 text-gray-500 text-sm">
                <button onClick={() => handleLikeThread(thread.id)} className='!bg-transparent'>
                  {likedThreadIds.includes(thread.id) ? '❤️' : '🤍'} {thread.likes_count}
                </button>
                <button
                  onClick={() => navigate(`/thread/${thread?.id}`)}
                  className="flex items-center hover:underline !bg-transparent"
                >
                  💬 {thread.number_of_replies} Replies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full rounded-lg mb-6" style={{ borderRadius: "6px 6px 6px 6px" }}>
        <div className="flex items-center w-full">
          <img
            src={profile.photo_profile}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover mr-2"
          />
          <input
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type Your Reply !"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="w-full max-h-[300px] overflow-hidden rounded-md" style={{ borderRadius: "6px 6px 6px 6px" }}>
              <img src={imagePreview} alt="Preview" className="w-full h-auto object-contain" style={{ borderRadius: "6px 6px 6px 6px" }} />
              
            </div>
          )}
          <div className="flex justify-end mt-3">
            <button className="!bg-transparent" type="button" onClick={handleImageClick}>
              <ImagePlus className="!bg-transparent text-green-400" />
            </button>
            <button className="!bg-green-600 text-white px-4 !rounded-full hover:bg-green-700" onClick={handlenewReply}>
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full">
        {replies.map((reply) => (
          <div key={reply.id} className="bg-[#1a1a1a] p-4 rounded-lg" style={{ borderRadius: "6px 6px 6px 6px" }}>
            <div className="flex items-start space-x-3">
              <img
                src={reply.user.photo_profile}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
                style={{ borderRadius: "6px 6px 6px 6px" }}
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm text-white">
                  <div className="flex flex-col justify-start items-start gap-1 sm:!flex-row">
                    <span className="font-bold mr-0.5">{reply.user.full_name}</span>
                    <span>@{reply.user.username}</span>
                  </div>
                  <span>{new Date(reply.created_at).toLocaleTimeString()}</span>
                </div>
                <div className='flex justify-start'>
                    <p className="text-white mt-1">{reply.content}</p>
                </div>
                {reply.image && (
                  <img
                    src={reply.image}
                    alt="post"
                    className="rounded-lg mt-2 max-h-[400px] w-full object-cover"
                  />
                )}
                <div className="flex space-x-4 text-gray-500 text-sm mt-3">
                  <button className='!bg-transparent' onClick={() => handleLikeReply(reply.id)}>
                  {likedRepliesIds.includes(reply.id) ? '❤️' : '🤍'} {reply.likes_count}
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
