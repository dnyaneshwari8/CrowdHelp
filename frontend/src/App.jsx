import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Success from './pages/Success';
import Failure from './pages/Failure';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-failure" element={<Failure />} />
            <Route path="/donations" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  main: {
    padding: '0 2rem',
    minHeight: '80vh'
  }
};

export default App;
