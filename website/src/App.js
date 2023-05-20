import React from 'react';
import logo from './logo.svg';
import './App.css';
import Grid from './pages/Grid.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.js';
import SnakeGame from './pages/SnakeGame';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/snake-game" element={<SnakeGame />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
