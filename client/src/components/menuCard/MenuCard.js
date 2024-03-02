import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./MenuCard.css";

const MenuCard = ({ title, icon, description, link }) => {
  return (
    <Link to={link} className="menu-card-link">
      <Card className="menu-card">
        {icon && <Card.Img variant="top" src={icon} />}
        <Card.Body>
          <div className="card-title">{title}</div>
          {description && <Card.Text>{description}</Card.Text>}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default MenuCard;