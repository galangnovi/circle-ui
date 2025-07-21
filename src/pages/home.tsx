import { useAuth } from "../hooks/auth";

export default function Home() {
    const{logout} = useAuth()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Home Page</h1>
      <p>Welcome to the Home page!</p>
      <button onClick={()=>logout()}></button>
    </div>
  );
} 