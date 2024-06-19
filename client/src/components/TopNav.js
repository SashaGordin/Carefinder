import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import firebase from 'firebase/compat/app';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import for routing

export default function TopNav() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    const fetchData = async () => {

      const userRole = localStorage.getItem('localStorageCurrentUserRole');
      if (userRole) {
        setRole(userRole);
        setLoading(false);
      } else {
        try {
          const userDocRef = doc(firestore, "users", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role);
          }
        } catch (error) {
          console.log("the error: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (currentUser) {
      fetchData(); // Call the async function immediately
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User signed out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNavClick = (path) => {
    setActivePage(path);
  };

  const navLinkStyle = (path) => ({
    color: activePage === path ? "white" : "#777777",
    fontWeight: activePage === path ? "bold" : "normal",
  });

  if (loading) {
    // Display a loading indicator or spinner
    return <div>Loading...</div>; 
  }

  return (    
    <>
      <div id="CFNAV">
        <Navbar expand="lg" id="nav1">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img src="cflogo.png" alt="Company Logo" />
            </Navbar.Brand>
            <Navbar.Text as={Link} to="/" className="me-auto">Carefinder</Navbar.Text>
            <div className="ml-auto"> {/* Add this div with ml-auto class */}
              {/**
               *   ****************************************************************
               *   NO ROLE == GUEST VISITOR NOT LOGGED IN
               *   ****************************************************************
               */}
              {!role && (
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/login">Find a Home</Nav.Link>
                  <Nav.Link as={Link} to="/claim-profile">For AFH Providers</Nav.Link>
                  <Nav.Item>
                    <button onClick={() => navigate('/login')} style={{ backgroundColor: "#4CAF50",
                      color: "white", border: "none",
                      padding: "10px 20px",
                      cursor: "pointer",
                      borderRadius: "5px"
                    }}>Login</button>
                  </Nav.Item>
                </Nav>
              )}

              {/** 
               *   ****************************************************************
               *   END GUEST ROLE MENU
               *   ****************************************************************
               * 
               *   ****************************************************************
               *   BEGIN CLIENT ROLE == GUEST VISITOR LOGGED IN AS A CLIENT
               *   ****************************************************************
               */}
              {role === "client" && (
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/client-dashboard">Browse</Nav.Link>
                  <Nav.Link as={Link} to="/msg-inbox">Inbox</Nav.Link>
                  <NavDropdown title={<FaBars />} className="hamburger-menu">
                    <NavDropdown.Item href="/client-dashboard" title="Client Dashboard" onClick={() => handleNavClick("/client-dashboard")} style={{ color: activePage === "/client-dashboard" ? "white" : "#777777" }}>Client Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/client-menu" title="Client Menu" onClick={() => handleNavClick("/client-menu")} style={{ color: activePage === "/client-menu" ? "white" : "#777777" }}>Client Menu</NavDropdown.Item>
                    <NavDropdown.Item>
                      <button onClick={handleLogout} style={{ backgroundColor: "#F44336", color: "white",  border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}>Logout</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )}

              {/**
               *   ****************************************************************
               *   END CLIENT ROLE MENU
               *   ****************************************************************
               * 
               *   ****************************************************************
               *   BEGIN PROVIDER ROLE == GUEST VISITOR LOGGED IN AS A PROVIDER
               *   ****************************************************************
               */}
              {role === "provider" && (
                <Nav className="me-auto w-100 d-flex justify-content-between">
                  <Nav.Link as={Link} to="/care-provider-dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/msg-inbox">Inbox</Nav.Link>
                  <NavDropdown title={<FaBars />} className="hamburger-menu">
                    <NavDropdown.Item href="/provider-menu" title="Provider Menu" onClick={() => handleNavClick("/provider-menu")} style={{ color: activePage === "/provider-menu" ? "white" : "#777777" }}>Provider Menu</NavDropdown.Item>
                    <NavDropdown.Item href="/care-provider-dashboard" title="Provider Dashboard" onClick={() => handleNavClick("/care-provider-dashboard")} style={{ color: activePage === "/care-provider-dashboard" ? "white" : "#777777" }}>Provider Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/your-listings" title="Provider Listings" onClick={() => handleNavClick("/your-listings")} style={{ color: activePage === "/your-listings" ? "white" : "#777777" }}>Provider Listings</NavDropdown.Item>
                    <NavDropdown.Item>
                      <button onClick={handleLogout} style={{ backgroundColor: "#F44336", color: "white",  border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}>Logout</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )}

              {/**
               *   ****************************************************************
               *   END PROVIDER ROLE MENU
               *   ****************************************************************
               * 
               *   ****************************************************************
               *   BEGIN ADMIN ROLE == GUEST VISITOR LOGGED IN AS AN ADMIN
               *   ****************************************************************
               */}
              {role === "admin" && (
                <>
                  <NavDropdown title="Admin Utils" id="admin-utils" style={{ color: activePage.startsWith("/admin") ? "white" : "#777777" }}>
                    <NavDropdown.Item href="/msg-admin" title="Message Anyone from YOU" onClick={() => handleNavClick("/msg-admin")} style={{ color: activePage === "/msg-admin" ? "white" : "#777777" }}> Admin Messager </NavDropdown.Item>
                    <NavDropdown.Item href="/msg-admin-spoof" title="Message Anyone from ANYONE" onClick={() => handleNavClick("/msg-admin-spoof")} style={{ color: activePage === "/msg-admin-spoof" ? "white" : "#777777" }}> Admin Messager Spoof </NavDropdown.Item>
                    <NavDropdown.Item href="/admin-client-viewer" title="User Viewer" onClick={() => handleNavClick("/admin-client-viewer")} style={{ color: activePage === "/admin-client-viewer" ? "white" : "#777777" }}> User Viewer </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Clients" id="client-dropdown" style={{ color: activePage.startsWith("/client") ? "white" : "#777777" }}>
                    <NavDropdown.Item href="/client-dashboard" title="Client Dashboard" onClick={() => handleNavClick("/client-dashboard")} style={{ color: activePage === "/client-dashboard" ? "white" : "#777777" }}>Client Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/client-menu" title="Client Menu" onClick={() => handleNavClick("/client-menu")} style={{ color: activePage === "/client-menu" ? "white" : "#777777" }}> Client Menu</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Providers" id="provider-dropdown" style={{ color: activePage.startsWith("/provider") ? "white" : "#777777" }}>
                    <NavDropdown.Item href="/provider-menu" title="Provider Menu" onClick={() => handleNavClick("/provider-menu")} style={{ color: activePage === "/provider-menu" ? "white" : "#777777" }}>Provider Menu</NavDropdown.Item>
                    <NavDropdown.Item href="/care-provider-dashboard" title="Provider Dashboard" onClick={() => handleNavClick("/care-provider-dashboard")} style={{ color: activePage === "/care-provider-dashboard" ? "white" : "#777777" }}>Provider Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/your-listings" title="Provider Listings" onClick={() => handleNavClick("/your-listings")} style={{ color: activePage === "/your-listings" ? "white" : "#777777" }}>Provider Listings</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Messaging" id="admin-utils" style={{ color: activePage.startsWith("/msg") ? "white" : "#777777" }}>
                    <NavDropdown.Item href="/msg-inbox" title="Message Anyone" onClick={() => handleNavClick("/msg-inbox")} style={{ color: activePage === "/msg-inbox" ? "white" : "#777777" }}>Inbox</NavDropdown.Item>
                    <NavDropdown.Item href="/msg-outbox" title="User Viewer" onClick={() => handleNavClick("/msg-outbox")} style={{ color: activePage === "/msg-outbox" ? "white" : "#777777" }}>Outbox</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title={<FaBars />} className="hamburger-menu">
                    <NavDropdown.Item>
                      <button onClick={handleLogout} style={{ backgroundColor: "#F44336", color: "white",  border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}>Logout</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {/**
               *   ****************************************************************
               *   END ADMIN ROLE MENU
               *   ****************************************************************
               */}
            </div> {/* Close the div with ml-auto class */}
          </Container>
        </Navbar>
      </div>
    </>
  );
}
