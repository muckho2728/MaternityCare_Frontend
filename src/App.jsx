import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/config';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import Profile from './pages/Profile/Profile';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <main className="main-content">
            <Routes>
              <Route path="/management-users" element={<ManageUsersPage />} />
              <Route path="/profile" element={<Profile />} /> 
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;