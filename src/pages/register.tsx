import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../hooks/auth";

export default function Register() {
  const {setUser, login}= useAuth()
  const [username, setUserName] = useState("")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrorMsg]= useState("")

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try{ 
          if(username && fullname && email && password){
          const res = await api.post("/auth/register", {
          username,
          name:fullname,
          email,
          password
          }, { withCredentials: true });
          const user = {
                  id: res.data.data.user_id,
                  username: res.data.data.username,
                  name: res.data.data.full_name,
                  email: res.data.data.email,
                  avatar: null
          }
  
          login(res.data.data.token)
          setUser(user); 
          navigate("/")
          } else {
              setErrorMsg ("username / password kososng")
          }
      } catch (error: any) {
        // Tangkap error dari backend
        const msg = error.response?.data?.message || "Login gagal";
        setErrorMsg(msg);
      }
      }


  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-green-500">circle</h1>
        <h2 className="text-2xl font-semibold">Create your account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nickname"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {errMsg && <p className="text-red-700">{errMsg}</p>}
          <button
            type="submit"
            className="w-full py-2 !rounded-full !bg-green-600 hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}