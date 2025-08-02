
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contex/auth-profider";
import PrivateRoute from "./lib/private-route";
import Home from './pages/home';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginPage from './pages/login';
import Register from './pages/register';
import MainLayout from './lib/main-layout';
import ThreadsDetailPage from './pages/threadDetail';
import FollowTabs from './pages/follows';
import SearchResult from './pages/search';
import ProfilePage from './pages/profile';
import RecomendationLayout from './lib/Recomendation-Layout';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
            <Routes>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<Register/>}/>
                <Route path='/' element={
                  <PrivateRoute>
                      <MainLayout>
                        <Home/>
                      </MainLayout>
                  </PrivateRoute>}/>
                <Route path="/thread/:thread_id" element={
                  <PrivateRoute>
                    <MainLayout>
                      <ThreadsDetailPage />
                    </MainLayout>
                  </PrivateRoute>} />
                <Route path="/follows" element={
                  <PrivateRoute>
                    <MainLayout>
                      <FollowTabs />
                    </MainLayout>
                  </PrivateRoute>} />
                <Route path="/search" element={
                  <PrivateRoute>
                    <MainLayout>
                      <SearchResult />
                    </MainLayout>
                  </PrivateRoute>} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <RecomendationLayout>
                      <ProfilePage />
                    </RecomendationLayout>
                  </PrivateRoute>} />
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}
      
export default App
