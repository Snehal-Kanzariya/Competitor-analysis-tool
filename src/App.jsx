import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CompetitorProfile from './pages/CompetitorProfile';
import Comparison from './pages/Comparison';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/competitor/:id" element={<CompetitorProfile />} />
          <Route path="/compare" element={<Comparison />} />
          <Route
            path="/swot"
            element={
              <ComingSoon
                title="SWOT Analysis"
                description="Strengths, Weaknesses, Opportunities & Threats analysis for each competitor."
              />
            }
          />
          <Route
            path="/positioning"
            element={
              <ComingSoon
                title="Market Positioning"
                description="Interactive 2x2 quadrant map to visualize competitive positioning."
              />
            }
          />
          <Route
            path="/scoring"
            element={
              <ComingSoon
                title="Weighted Scoring"
                description="Quantitative competitor ranking with customizable weighted criteria."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
