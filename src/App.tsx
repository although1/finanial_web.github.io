import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FinancialPage from './components/FinancialPage';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-2 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/financial" element={<FinancialPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;