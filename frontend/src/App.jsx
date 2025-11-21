import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BrowseClients from './pages/BrowseClients';
import ClientDetails from './pages/ClientDetails';
import SubmitReview from './pages/SubmitReview';
import AIAnalyzer from './pages/AIAnalyzer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center text-xl font-bold text-indigo-600">
                  🚩 Rate My Client
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    Browse Clients
                  </Link>
                  <Link
                    to="/submit"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    Submit Review
                  </Link>
                  <Link
                    to="/ai-analyzer"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    AI Job Analyzer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseClients />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/submit" element={<SubmitReview />} />
            <Route path="/ai-analyzer" element={<AIAnalyzer />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Rate My Client - Protecting freelancers from red flag clients
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
