import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SSHClass from './pages/SSHClass';
import KeygenClass from './pages/KeygenClass';

import ConfigSSHClass from './pages/ConfigSSHClass';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ssh" element={<SSHClass />} />
          <Route path="keygen" element={<KeygenClass />} />
          <Route path="config-ssh" element={<ConfigSSHClass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
