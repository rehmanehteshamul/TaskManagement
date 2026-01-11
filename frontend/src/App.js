import React, { useState, useEffect } from 'react';
import TaskManager from './components/TaskManager';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? <TaskManager setLoggedIn={setIsLoggedIn} /> : <Login setLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

export default App;
