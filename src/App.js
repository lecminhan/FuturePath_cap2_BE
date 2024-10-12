import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Revenue from './pages/Revenue';
import Machine from './pages/Machine';
import User from './pages/User';
import Change from './pages/Change';
import Alert from './pages/Alert';

// ... other imports
function App() {

    return (
        <div className="main">
            <Router>
            <Sidebar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/revenue" element={<Revenue />} />
                    <Route path="/machine-status" element={<Machine />} />
                    <Route path="/revenue" element={<Revenue />} />
                    <Route path="/user-info" element={<User/>} />
                    <Route path="/change" element={<Change/>} />
                    <Route path="/alert" element={<Alert/>} />
                </Routes>
            </div>
        </Router>
        </div>
    );
}

export default App;
