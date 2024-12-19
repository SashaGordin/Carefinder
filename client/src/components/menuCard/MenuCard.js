import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MenuCard.css';

const MenuCard = ({ title, icon, description, link }) => {
  return (
    <Link to={link} className="menu-card-link">
      <Card className="menu-card-container">
        {icon && (
          <Card.Img className="menu-card-icon" variant="top" src={icon} />
        )}
        <Card.Body className="menu-card-body">
          <div className="menu-card-content">
            {' '}
            {/* Added wrapping div */}
            <div className="menu-card-title">{title}</div>
            {description && <Card.Text>{description}</Card.Text>}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default MenuCard;
