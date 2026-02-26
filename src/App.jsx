import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CompetitorProfile from './pages/CompetitorProfile';
import Comparison from './pages/Comparison';
import Monopoly from './pages/Monopoly';
import Swot from './pages/Swot';
import Research from './pages/Research';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';

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
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/positioning"
            element={
              <ComingSoon
                title="Market Positioning"
                description="Interactive 2x2 quadrant map to visualize competitive positioning. Coming in the next build."
              />
            }
          />
          <Route
            path="/scoring"
            element={
              <ComingSoon
                title="Weighted Scoring"
                description="Quantitative competitor ranking with customizable weighted criteria. Coming in the next build."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
