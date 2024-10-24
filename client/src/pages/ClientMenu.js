import React from 'react'
import MenuCard from '../components/menuCard/MenuCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopNav from "../components/TopNav";
import Footer from '../components/Footer';

export default function ClientMenu() {

  const menuItems = [
    { title: 'Personal Info', icon: 'personal_info.png', description: 'Provide personal info so we can reach you', link:'../msg-inbox' },
    { title: 'Login & Security', icon: 'login.png', description: 'Update password and secure account', link:'../msg-inbox' },
    { title: 'Payment & Payout', icon: 'payment.png', description: 'Payment and billing area', link:'../msg-inbox' },
    { title: 'Edit Survey', icon: 'personal_info.png', description: 'Edit your survey answers', link:'../msg-inbox'  },

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