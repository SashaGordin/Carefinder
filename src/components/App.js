//import logo from './logo.svg';
import React from 'react';
import Signup from './Signup';
import Login from "./Login";
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </AuthProvider>
        </div>
      </Container>
    </Router>
  );
}

export default App;
