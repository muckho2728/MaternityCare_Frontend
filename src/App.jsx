import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/config';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import Profile from './pages/Profile/Profile';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateFetus from './pages/CreateFetus/CreateFetus'
import CreateFetusHealth from './pages/CreateFetusHealth/CreateFetusHealth'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import LoginPage from './pages/Login/Login';
import ForgetPage from './pages/ForgotPassword/ForgetP';
import { AuthProvider } from './constants/AuthContext'
import ViewFetusHealth from './pages/ViewFetusHealth/ViewFetusHealth'
import Blog from './pages/Community/Blog'
import { ToastContainer } from 'react-toastify';
import Censor from './pages/AdminCensor/Censor';
function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-fetus" element={<CreateFetus />} />
              <Route path="/create-fetus-health" element={<CreateFetusHealth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/management-users" element={<ManageUsersPage />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/view-fetus-health" element={<ViewFetusHealth />} /> 
              <Route path="/community" element={<Blog />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forget-password" element={<ForgetPage />} />
              <Route path="/censor" element={<Censor />} />
            </Routes>
            <ToastContainer/>
          </main>
          <Footer />
        </div>
      </Router>
      </Provider>
    </AuthProvider>
  )
}

export default App