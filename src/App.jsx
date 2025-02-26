import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/config';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import Profile from './pages/Profile/Profile';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import CreateFetus from './pages/CreateFetus/CreateFetus'
import CreateFetusHealth from './pages/CreateFetusHealth/CreateFetusHealth'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import LoginPage from './pages/Login/Login';
//import ForgetPage from './pages/ForgotPassword/ForgetP';
import { AuthProvider } from './constants/AuthContext'
import ViewFetusHealth from './pages/ViewFetusHealth/ViewFetusHealth'
import Blog from './pages/Community/Blog'
import { ToastContainer } from 'react-toastify';
import Censor from './pages/AdminCensor/Censor'
import PackageList from './pages/PackageList/PackageList'
import CreatePackage from './pages/Admin/CreatePackage';  
import { ThemeProvider } from './constants/ThemeContext';
import PaymentDetail from './pages/PaymentDetail/PaymentDetail';
import PaymentPage from './pages/PaymentPage/PaymentPage';



//import PackageList from './pages/PackageList/PackageList'

//import PaymentPage from './pages/PaymentPage/PaymentPage';
//import PaymentDetail from './pages/PaymentDetail/PaymentDetail';
//import CreatePackage from './pages/Admin/CreatePackage';
//import UpdatePackage from './pages/Admin/UpdatePackage';


function Layout() {
  const location = useLocation()
  const isLoginRegister = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!isLoginRegister && <Header />}
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
          <Route path="/package-list" element={<PackageList />} />
          <Route path="/create-package" element={<CreatePackage />} />
          {/* <Route path="/create-package" element={<CreatePackage />} /> */}
          {/* <Route path="/update-package" element={<UpdatePackage />} /> */}
          {/* <Route path="/forget-password" element={<ForgetPage />} /> */}
          <Route path="/payment-detail" element={<PaymentDetail />} />
          <Route path="/payment-page" element={<PaymentPage />} />
          <Route path="/Censor" element={<Censor />} />
        </Routes>
        <ToastContainer />
      </main>
      {!isLoginRegister && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Provider store={store}>
          <Router>
            <Layout />
          </Router>
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App