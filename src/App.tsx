
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contex/auth-profider";
import PrivateRoute from "./lib/private-route";
import Home from './pages/home';
import LoginPage from './pages/login';
import Register from './pages/register';

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<Register/>}/>
            <Route path='/' element={
              <PrivateRoute>
                <Home/>
                </PrivateRoute>}/>
        </Routes>
    </AuthProvider>
    </BrowserRouter>
    
  )
}
      
export default App
