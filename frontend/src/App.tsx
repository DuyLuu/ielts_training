import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LoginPage from './components/auth/LoginPage';

// Pages
const Home = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">YouPass IELTS Training</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to YouPass</h2>
        <p className="text-gray-700 mb-6">
          Your comprehensive platform for IELTS preparation. Access courses, practice tests, track your progress, and connect with other learners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">Courses</h3>
            <p className="text-gray-600 mb-4">Access structured courses for all IELTS sections: Reading, Writing, Listening, and Speaking.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              Explore Courses
            </button>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">Practice Tests</h3>
            <p className="text-gray-600 mb-4">Take mock tests and section-specific practice to prepare for the real exam.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              Start Practicing
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Add more routes as they are developed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
