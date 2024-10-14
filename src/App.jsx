import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Form from './components/Form';
import Table from './components/Table';
import Header from './components/Header';
import User from './components/user';
import PickupsTable from './components/Pickups';
import FeedbacksTable from './components/Feedbacks';
import InspectorsTable from './components/Inspectors';
import CollectorsTable from './components/Collectors';
import ReportsTable from './components/Reports';
import IncentivesTable from './components/Incentives';


function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar will take up a fixed width and the rest will be for main content */}
        <Sidebar className="w-1/4 bg-gray-800 text-white" /> 
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<><User/></>} />
            <Route path="/form" element={<Form />} />
            <Route path="/table" element={<Table />} />
            <Route path="/users" element={<User />} />
            <Route path="/pickups" element={<PickupsTable />} />
            <Route path="/feedbacks" element={<FeedbacksTable />} />
            <Route path="/inspectors" element={<InspectorsTable />} />
            <Route path="/collectors" element={<CollectorsTable />} />
            <Route path="/reports" element={<ReportsTable />} />
            <Route path="/incentives" element={<IncentivesTable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
