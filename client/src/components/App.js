//import logo from './logo.svg';
import React from 'react';
import Signup from '../pages/Signup';
import Login from "../pages/Login";
import LandingPage from '../pages/LandingPage';
import ForgotPassword from '../pages/ForgotPassword';
import Survey from '../pages/Survey'
import CPLandingPage from '../pages/CPLandingPage';
import ClaimProfile from '../pages/ClaimProfile';
import CPDashboard from '../pages/CPDashboard';
import CPListings from './CPListings';
import ClientDashboard from '../pages/ClientDashboard';
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
import ClientMenu from '../pages/ClientMenu';
import ProviderMenu from '../pages/ProviderMenu';
import PersonalInfoPage from './menu/PersonalInfo'
import PrivacyPage from './menu/Privacy'
import MsgInbox from './MsgInbox';
import FileUpload from './FileUpload';
import CPHomeSurvey from './CPListings/CPHomeSurvey';


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
              <Route path="/temp-file-upload" element={<FileUpload />} />
              <Route path="/msg-inbox" element={
                  <PrivateRoute redirectPath="/login" allowedRoles={['admin','client', 'provider']}>
                      <MsgInbox />
                  </PrivateRoute>
                } />
              <Route path="/join-team" element={<CareFinderJoinTeam />} />
              <Route path="/contact-us" element={<CareFinderContactUs />} />
              <Route path="/sitemap" element={<CareFinderSitemap />} />
              <Route path="/privacy-policy" element={<CareFinderPrivacy />} />
              <Route path="/terms-of-service" element={<CareFinderTerms />} />
              <Route
                path="/client-dashboard"
                element={
                  <PrivateRoute
                  redirectPath="/login"
                    allowedRoles={
                       ['client','admin']
                    }>
                      <ClientDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/care-provider-dashboard"
                element={
                  <PrivateRoute
                    redirectPath="/login"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <CPDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/client-menu"
                element={
                  <PrivateRoute
                    redirectPath="/login"
                    allowedRoles={
                      ['client','admin']
                    }>
                      <ClientMenu />
                  </PrivateRoute>
                }
              />
               <Route
                path="/provider-menu"
                element={
                  <PrivateRoute
                    redirectPath="/login"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <ProviderMenu />
                  </PrivateRoute>
                }
              />
              <Route
                path="/personal-info"
                element={
                  <PrivateRoute
                    redirectPath="/login"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <PersonalInfoPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PrivateRoute
                    redirectPath="/login"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <PrivacyPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/your-listings"
                element={
                  <PrivateRoute
                    redirectPath="/signup"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <CPListings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home-survey"
                element={
                  <PrivateRoute
                    redirectPath="/signup"
                    allowedRoles={
                      ['provider','admin']
                    }>
                      <CPHomeSurvey />
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
