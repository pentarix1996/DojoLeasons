import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SSHClass from './pages/SSHClass';
import KeygenClass from './pages/KeygenClass';

import ConfigSSHClass from './pages/ConfigSSHClass';
import ApacheBasicClass from './pages/ApacheBasicClass';

import ApacheConfigClass from './pages/ApacheConfigClass';
import BashBasicClass from './pages/BashBasicClass';
import BashAdvancedClass from './pages/BashAdvancedClass';
import ExamApacheClass from './pages/ExamApacheClass';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ssh" element={<SSHClass />} />
          <Route path="keygen" element={<KeygenClass />} />
          <Route path="config-ssh" element={<ConfigSSHClass />} />
          <Route path="apache-basic" element={<ApacheBasicClass />} />

          <Route path="apache-config" element={<ApacheConfigClass />} />
          <Route path="bash-basic" element={<BashBasicClass />} />
          <Route path="bash-advanced" element={<BashAdvancedClass />} />
          <Route path="exam01" element={<ExamApacheClass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
