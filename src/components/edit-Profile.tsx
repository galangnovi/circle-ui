import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/services/api"
import type { RootState } from "@/store"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Textarea } from "./ui/textarea"
import { useNavigate } from "react-router-dom"


export function DialogEditProfile() {
  const profile = useSelector((state: RootState) => state.profile);
  const [profilePreview, setprofilePreview] = useState<string | null>(null);
  const [coverPreview, setcoverPreview] = useState<string | null>(null);
  const [photoProfile, setPhotoProfile] = useState<File | null>(null)
  const [photoCover, setPhotoCover] = useState<File | null>(null)
  const [username, setUsername] =useState("")
  const [fullname, setFullname] =useState("")
  const [bio, setBio] =useState("")
  const [email, setEmail] =useState("")
  const navigate = useNavigate()

  useEffect(() => {
  if (profile) {
    setUsername(profile.username || "")
    setFullname(profile.full_name || "")
    setBio(profile.bio || "")
    setEmail(profile.email || "")
  }
}, [profile])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file1 = e.target.files?.[0];
        if (file1) {
        setPhotoCover(file1)
        const imageURL1 = URL.createObjectURL(file1);
        setcoverPreview(imageURL1);
        }
    };
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file2 = e.target.files?.[0];
        if (file2) {
        setPhotoProfile(file2)
        const imageURL2 = URL.createObjectURL(file2);
        setprofilePreview(imageURL2);
        }
    };

  
    const handleEditProfile = async () => {
      try {const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("full_name", fullname);
        formData.append("bio", bio);
        
        if (photoProfile) {
        formData.append("photo_profile", photoProfile); 
        }
        if (photoCover) {
        formData.append("cover_Photo", photoCover)
        }

        await api.put("/myProfile/edit", formData,
        {withCredentials: true, 
          headers: {
            "Content-Type": "multipart/form-data",
        },})

        navigate(0)
      } catch (error: any) {
        console.log(error.response?.data?.message || "Failed to post thread") 
    }
    }
  

  return (
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className=" hidden lg:block h-20 overflow-hidden w-full">
            { coverPreview ? <img src={coverPreview}
              alt="cover" className="w-full rounded-t-xl"/>  : <div> {profile.cover_photo ? <img src={profile.cover_photo}
              alt="cover" className=" w-full rounded-t-xl" style={{ borderRadius: "6px 6px 0 0" }}/> : <div className="h-20 rounded-t-xl bg-gradient-to-r from-green-400 to-yellow-300" style={{ borderRadius: "6px 0 6px 0" }}></div>} </div>}
            </div>
        <div className="px-4 pb-4 -mt-10 flex items-center justify-between">
          <div className=" hidden lg:block flex items-center space-x-3">
            {profilePreview ? <img
              src={profilePreview}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-[#16181c]"
            /> : <img
              src={profile.photo_profile}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-[#16181c]"
            />}
          </div>
          </div>
            <div className="grid gap-3">
              <Label htmlFor="profile">Photo Profile</Label>
              <Input id="profile" name="name" type="file" onChange={handleProfileChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="coverProfile">Cover photo</Label>
              <Input id="coverProfile" name="name" type="file" onChange={handleCoverChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="userName">Username</Label>
              <Input id="userName" name="name" value={username} onChange={(e) => {setUsername(e.target.value)}} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="Fullname">Fullname</Label>
              <Input id="Fullname" name="username" value={fullname}  onChange={(e) => {setFullname(e.target.value)}} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="Bio">Bio</Label>
              <Textarea id="bio" name="bio" rows={3} value={bio}  onChange={(e) => {setBio(e.target.value)}} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="username" type="email" value={email}  onChange={(e) => {setEmail(e.target.value)}}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="!bg-transparent" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="text-white !bg-transparent" onClick={handleEditProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}
