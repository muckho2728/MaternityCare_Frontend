import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/config';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import Profile from './pages/Profile/Profile';
import LoginPage from './pages/Login/Login';
import RegisPage from './pages/Register/Register';
import ForgetPage from './pages/ForgotPassword/ForgetP';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <main className="main-content">
            <Routes>
              <Route path="/management-users" element={<ManageUsersPage />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/regis" element={<RegisPage />} />
              <Route path="/forget" element={<ForgetPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;