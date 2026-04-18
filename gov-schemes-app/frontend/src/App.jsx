import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MadhubaniLayout from './components/MadhubaniLayout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Schemes from './pages/Schemes';
import Profile from './pages/Profile';
import SchemeDetail from './pages/SchemeDetail';
import LoginPage from './pages/LoginPage';
import AccessibilityBar from './components/AccessibilityBar';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('govschemes_user')) || null; } catch { return null; }
  });

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#fefce8] dark:bg-gray-950 transition-colors duration-300">
        <Navbar currentUser={currentUser} />
        <AccessibilityBar />

        {/* Every page gets the Madhubani border frame */}
        <MadhubaniLayout>
          <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<LoginPage setCurrentUser={setCurrentUser} />} />
              <Route path="/chat"       element={<Chat currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="/schemes"    element={<Schemes currentUser={currentUser} />} />
              <Route path="/schemes/:id" element={<SchemeDetail />} />
              <Route path="/profile"    element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            </Routes>
          </main>
        </MadhubaniLayout>
      </div>
    </Router>
  );
}

export default App;
