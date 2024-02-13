//import logo from './logo.svg';
import React from 'react';
import Signup from './Signup';
import Login from "./Login";
import LandingPage from './LandingPage';
import ForgotPassword from './ForgotPassword';
import Survey from './Survey';
import CPLandingPage from './CPLandingPage';
import ClaimProfile from './ClaimProfile';
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import '../css/carefinder.css';

function App() {
  return (
    <Router>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/care-provider" element={<CPLandingPage />} />
              <Route path="/claim-profile" element={<ClaimProfile />} />
            </Routes>
          </AuthProvider>
        </div>
      </Container>
    </Router>
  );
}

export default App;
