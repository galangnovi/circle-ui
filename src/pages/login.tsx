import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {setUser, user, login}= useAuth()
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [errMsg, setErrorMsg]= useState("")

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try{ 
        if(identifier && password){
        const res = await api.post("/auth/login", {
        identifier,
        password: password
        }, { withCredentials: true });
        const user = {
                id: res.data.data.user_id,
                username: res.data.data.username,
                name: res.data.data.name,
                email: res.data.data.email,
                avatar: res.data.data.avatar
        }

        login(res.data.data.token)
        setUser(user);
        navigate("/")
        } else {
            setErrorMsg ("username / password kososng")
        }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login gagal";
      setErrorMsg(msg);
    }
    }

    useEffect(() => {
      setIdentifier(user?.email || "");
    }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md ">
        <div className="flex flex-col items-start ml-8">
            <h1 className=" !text-5xl font-bold text-green-500 mb-4 text-center">circle</h1>
            <h2 className=" !text-2xl text-white text-center mb-3 font-semibold">Login to Circle</h2>
        </div>
        <form onSubmit={handleLogin} className=" p-6 rounded-md shadow">
          <div className="mb-4">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email/userName *"
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ borderRadius: "6px 6px 6px 6px" }}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              required
              className="w-full px-4 py-2 bg-transparent text-white placeholder:text-gray-500 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ borderRadius: "6px 6px 6px 6px" }}
            />
          </div>

          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-gray-400 hover:text-green-500">
              Forgot password?
            </a>
          </div>
          {errMsg && <p className="text-red-700">{errMsg}</p>}
          <button
            type="submit"
            className="w-full !bg-green-500 hover:bg-green-600 text-white py-2 !rounded-full font-semibold"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account yet?{" "}
            <a href="/register" className="text-green-500 hover:underline">
              Create account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}