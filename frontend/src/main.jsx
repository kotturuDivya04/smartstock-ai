import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

const savedTheme = localStorage.getItem('ss_theme');
if (savedTheme === 'dark') document.body.className = 'dark';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AuthProvider><AppProvider><AppRoutes /></AppProvider></AuthProvider></BrowserRouter></React.StrictMode>);
