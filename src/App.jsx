import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CompetitorProfile from './pages/CompetitorProfile';
import Comparison from './pages/Comparison';
import Swot from './pages/Swot';
import Monopoly from './pages/Monopoly';
import Positioning from './pages/Positioning';
import Scoring from './pages/Scoring';
import Research from './pages/Research';
import Export from './pages/Export';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/research" element={<Research />} />
          <Route path="/competitor/:id" element={<CompetitorProfile />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/swot" element={<Swot />} />
          <Route path="/monopoly" element={<Monopoly />} />
          <Route path="/positioning" element={<Positioning />} />
          <Route path="/scoring" element={<Scoring />} />
          <Route path="/export" element={<Export />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
