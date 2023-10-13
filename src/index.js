import React from 'react';
import userInformation from './redux/users';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'tailwindcss/tailwind.css';
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>


       <App />
  
  
  </React.StrictMode>
);
