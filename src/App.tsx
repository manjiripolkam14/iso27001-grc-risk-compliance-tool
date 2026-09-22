import { HashRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useGrcData } from './utils/storage';
import Dashboard from './pages/Dashboard';
import AssetRegister from './pages/AssetRegister';
import RiskRegister from './pages/RiskRegister';
import RiskMatrix from './pages/RiskMatrix';
import ControlLibrary from './pages/ControlLibrary';
import RiskControlMapping from './pages/RiskControlMapping';
import ComplianceGaps from './pages/ComplianceGaps';
import RemediationTracker from './pages/RemediationTracker';

export default function App() {
  const { data, setData, logActivity, reset } = useGrcData();

  const shared = { data, setData, logActivity };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header onReset={reset} />
          <main className="p-6 max-w-[1400px] mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard {...shared} />} />
              <Route path="/assets" element={<AssetRegister {...shared} />} />
              <Route path="/risks" element={<RiskRegister {...shared} />} />
              <Route path="/risk-matrix" element={<RiskMatrix {...shared} />} />
              <Route path="/controls" element={<ControlLibrary {...shared} />} />
              <Route path="/mapping" element={<RiskControlMapping {...shared} />} />
              <Route path="/gaps" element={<ComplianceGaps {...shared} />} />
              <Route path="/remediation" element={<RemediationTracker {...shared} />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
