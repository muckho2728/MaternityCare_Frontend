import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
import { Provider } from 'react-redux';
import { store } from './store/config';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import Profile from './pages/Profile/Profile';
<<<<<<< HEAD
import LoginPage from './pages/Login/Login';
import RegisPage from './pages/Register/Register';
import ForgetPage from './pages/ForgotPassword/ForgetP';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreateFetus from './pages/CreateFetus/CreateFetus'
import CreateFetusHealth from './pages/CreateFetusHealth/CreateFetusHealth'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { AuthProvider } from './constants/AuthContext'
;

>>>>>>> 3fdc1630381ab5478dd11853af547530739edbb2
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/management-users" element={<ManageUsersPage />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/regis" element={<RegisPage />} />
              <Route path="/forget" element={<ForgetPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </Provider>
    </AuthProvider>
  )
}

export default App