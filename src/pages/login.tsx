import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-500 mb-2 text-center">circle</h1>
        <h2 className="text-white text-center mb-6 text-lg font-semibold">Login to Circle</h2>

        <form className="bg-[#1a1a1a] p-6 rounded-md shadow">
          <div className="mb-4">
            <label className="block text-white mb-1">Email/Username<span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1">Password<span className="text-red-500">*</span></label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-gray-400 hover:text-green-500">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account yet? <a href="#" className="text-green-500 hover:underline">Create account</a>
          </p>
        </form>
      </div>
    </div>
  );
}