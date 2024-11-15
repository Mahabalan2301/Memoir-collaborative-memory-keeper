import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' for React 18
import './index.css';  // Your styles
import App from './App';  // Your main component
import reportWebVitals from './reportWebVitals';

// Create a root element and render the app into it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Report web vitals (you can remove this if not using it)
reportWebVitals();
