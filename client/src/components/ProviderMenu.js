import React from 'react'
import MenuCard from './menuCard/MenuCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopNav from "./TopNav";
import Footer from './Footer';

export default function ProviderMenu() {

  const menuItems = [
    { title: 'Personal Info', icon: 'personal_info.png', description: 'Provide personal info so we can reach you', link: "/personal-info"},
    { title: 'Login & Security', icon: 'login.png', description: 'Update password and secure account' },
    { title: 'Payment and Payout', icon: 'payment.png' },
    { title: 'Policies', icon: 'policies.png', description: 'Update password and secure account' },
    { title: 'Privacy', icon: 'privacy.png', description: 'Provide personal info so we can reach you', link: "/privacy"},
    { title: 'My Profile', icon: 'profile.png', description: 'Provide personal info so we can reach you' },
    { title: 'Delete Account'},


    // Add more menu items as needed
  ];

  return (
    <>
      <TopNav />
      <div className="contentContainer utilityPage clientMenu">

      <Container>
        <Row xs={1} sm={2} md={4}>
          {menuItems.map((menuItem, index) => (
            <Col key={index}>
              <MenuCard {...menuItem} />
            </Col>
          ))}
        </Row>
      </Container>

      </div>
      <Footer />
    </>
  );
};