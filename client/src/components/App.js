//import logo from './logo.svg';
import React from 'react';
import Signup from './Signup';
import Login from "./Login";
import LandingPage from './LandingPage';
import ForgotPassword from './ForgotPassword';
import Survey from './Survey';
import CPLandingPage from './CPLandingPage';
import ClaimProfile from './ClaimProfile';
import CPDashboard from './CPDashboard';
import CPListings from './CPListings';
import ClientDashboard from './ClientDashboard';
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoute from './PrivateRoute';
import '../css/carefinder.css';
import SupportReportIssue from './SupportReportIssue';
import SupportConnectAdvisor from './SupportConnectAdvisor';
import SupportSuggestion from './SupportSuggestion';
import CareFinderJoinTeam from './CareFinderJoinTeam';
import CareFinderContactUs from './CareFinderContactUs';
import CareFinderSitemap from './CareFinderSitemap';
import CareFinderPrivacy from './CareFinderPrivacy';
import CareFinderTerms from './CareFinderTerms';


function App() {
  return (
    <Router>

      {/*
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
      */}

          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/care-provider" element={<CPLandingPage />} />
              <Route path="/claim-profile" element={<ClaimProfile />} />
              <Route path="/support-report-issue" element={<SupportReportIssue />} />
              <Route path="/support-advisor" element={<SupportConnectAdvisor />} />
              <Route path="/support-suggestion" element={<SupportSuggestion />} />
              <Route path="/join-team" element={<CareFinderJoinTeam />} />
              <Route path="/contact-us" element={<CareFinderContactUs />} />
              <Route path="/sitemap" element={<CareFinderSitemap />} />
              <Route path="/privacy-policy" element={<CareFinderPrivacy />} />
              <Route path="/terms-of-service" element={<CareFinderTerms />} />
              <Route
                path="/client-dashboard"
                element={
                  <PrivateRoute
                  redirectPath="/signup"
                    allowedRoles={
                       'client'
                    }>
                      <ClientDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/care-provider-dashboard"
                element={
                  <PrivateRoute
                    redirectPath="/signup"
                    allowedRoles={
                      'provider'
                    }>
                      <CPDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/your-listings"
                element={
                  <PrivateRoute
                    redirectPath="/signup"
                    allowedRoles={
                      'provider'
                    }>
                      <CPListings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
          
      {/*  
        </div>
      </Container>
      */}

    </Router>
  );
}

export default App;
