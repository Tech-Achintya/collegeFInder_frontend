/**
 * @fileoverview App component - Root component with routing configuration.
 * Sets up React Router with Layout wrapper and all page routes.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CollegesPage from './pages/CollegesPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import ComparePage from './pages/ComparePage';
import PredictorPage from './pages/PredictorPage';

function App() {
  return (
    <CompareProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<CollegesPage />} />
            <Route path="/colleges/:id" element={<CollegeDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/predictor" element={<PredictorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CompareProvider>
  );
}

export default App;
