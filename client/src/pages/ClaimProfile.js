import React from 'react';
import { useLocation } from 'react-router-dom';

import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import ClaimProfileSurvey from '../components/ClaimProfile/ClaimProfileSurvey';

export default function ClaimProfile() {
  const location = useLocation();
  const { state } = location;
  const { addAFH, uid } = state || {};

  return (
    <>
      <TopNav />
      <ClaimProfileSurvey userId={uid} addAFH={addAFH} />
      <Footer />
    </>
  );
}
