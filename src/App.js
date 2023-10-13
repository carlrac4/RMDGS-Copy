import { useState, useRef, useSelector } from 'react';
import './App.css';
import { auth } from "./firebase-config";
import Loginpage from "./pages/login";
import ForgotPage from "./pages/forgot";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Driver from "./pages/driver";
import Operator from "./pages/operators";
import ActivityLogs from "./pages/activitylogs";
import CollectionLogs from "./pages/collectionLogs";
import OperatorLogs from "./pages/OperatorLogs";
import {Generate} from "./pages/document/renderer";
import { BrowserRouter as Router, Routes, Route, Link, useParams} from "react-router-dom";
import AdminProfile from './pages/adminProfile';
import Collection from './pages/collection';
import CollectionDetails from './pages/components/collectionModal';
import Announcement_editable from './pages/announcement_editable';
import 'react-tooltip/dist/react-tooltip.css'



function App() {
 

  // Check if user is logged in and set user data to persist state between page reloads
 
    return(
     <Router>
      <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path="/forgotPass" element={<ForgotPage/>} />
      <Route path="/collections/:collectorID/:authLvl/:Collect" element={<Collection />} />  
      <Route path="/driver/:userID/logs" element={<ActivityLogs />} />  
      <Route path="/collections/:userID/logs" element={<CollectionLogs />} />  
      <Route path="/operator/:userID/logs" element={<OperatorLogs />} />  
        <Route path="/collection/:userID/:memberid/:authLvl/:Collect" element={<CollectionDetails/>} />
        <Route path="/announcement" element={<Announcement_editable />} />
        <Route path="/admin/:id" element={<AdminProfile />} />
        <Route path="/operator/:userID/:authLvl" element={<Operator />} />
        <Route path="/driver/:userID/:authLvl" element={<Driver />} />
        <Route path="/profile/:userID/:id/:authLvl" element={<Profile />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
      </Router> 
    );
  }  



export default App;
