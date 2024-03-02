import React from 'react'
import MenuCard from './menuCard/MenuCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopNav from "./TopNav";

export default function ClientMenu() {

  const menuItems = [
    { title: 'Personal Info', icon: '/path/to/icon1.png', description: 'Provide personal info so we can reach you' },
    { title: 'Login & Security', icon: '/path/to/icon2.png', description: 'Update password and secure account' },
    { title: 'Payment and Payout', icon: '/path/to/icon3.png' },
    { title: 'Edit Survey' },
    { title: 'Privacy', icon: '/path/to/icon3.png', description: 'Provide personal info so we can reach you' },

    // Add more menu items as needed
  ];

  return (
    <>
      <TopNav />
      <Container>
        <Row xs={1} sm={2} md={4}>
          {menuItems.map((menuItem, index) => (
            <Col key={index}>
              <MenuCard {...menuItem} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};