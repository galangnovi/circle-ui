import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/auth";
import { api } from "@/services/api";
import { ImagePlus } from 'lucide-react';
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dialogform() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [image, setImage] = useState<File|null>(null)
    const [content, setContent] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const handlenewThreads = async () => {
    try {
        const formData = new FormData();
        formData.append("content", content);
        if (image) {
        formData.append("image", image); // hanya kalau ada gambar
        }

        await api.post("/auth/thread", formData, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        navigate(0);
    } catch (error: any) {
        const msg = error.response?.data?.message || "Failed to post thread";
        setErrMsg(msg);
    }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        setImage(file)
        const imageURL = URL.createObjectURL(file);
        setImagePreview(imageURL);
        }
    };

    const {user} = useAuth()
    return (
   <DialogContent className="max-w-xl w-full">
    <DialogHeader>
      <DialogTitle>New Threads</DialogTitle>
      <DialogDescription>
        <div className="flex flex-col rounded-lg mb-6">
            <div className="flex justify-start">
                <img
                    src={`http://localhost:3000/uploads/${encodeURIComponent(String(user?.avatar))}`}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover mr-2"
                />
                <textarea
                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none whitespace-normal break-words resize-none"
                    placeholder="What is happening?!"
                    rows={3}
                    value={content}
                    onChange={(e)=> setContent(e.target.value)}
                />
            </div>
            <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                />

                {imagePreview && (
                    <div className="w-full max-h-[300px] overflow-hidden rounded-md">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-contain"
                    />
                    </div>
                )}
            <div className="flex justify-end mt-3">
                <button className="!bg-transparent" type="button" onClick={handleImageClick}>
                <ImagePlus className="!bg-transparent text-green-400"/>
                </button>
                <button className="!bg-green-600 text-white px-4 !rounded-full hover:bg-green-700" onClick={handlenewThreads}>
                Post
                </button>
            </div>
          </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent> 
)}