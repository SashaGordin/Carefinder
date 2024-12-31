import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope, FaHeart, FaCog, FaCloud } from 'react-icons/fa'; // Import desired icons

export default function TopNav() {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false); // Track other dropdowns

  useEffect(() => {
    const fetchData = async () => {
      const userRole = localStorage.getItem('localStorageCurrentUserRole');
      if (userRole) {
        setRole(userRole);
        setLoading(false);
      } else {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role);
          }
        } catch (error) {
          console.log('the error: ', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (currentUser) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const toggleHamburgerMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the hamburger menu or any other dropdown
    if (!event.target.closest('.CF2-hamburger') && isOpen) {
      setIsOpen(false);
    }

    // Assuming you have another dropdown with a class like 'CF2-dropdown-menu'
    if (otherDropdownOpen && !event.target.closest('.CF2-dropdown-menu')) {
      setIsOpen(false); // Close hamburger menu if another dropdown is open
      setOtherDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, otherDropdownOpen]);

  // Function to open other dropdowns
  const openOtherDropdown = () => {
    setOtherDropdownOpen(true);
    setIsOpen(false); // Close hamburger menu if another dropdown is opened
  };

  // Function to close other dropdowns
  const closeOtherDropdown = () => {
    setOtherDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="CF2-navwrapper">
      <nav className="CF2-navbar">
        <div className="CF2-logo-container">
          <img src="cflogo.png" alt="Carefinder Logo" className="CF2-logo" />
          <span className="CF2-site-name">
            <a href="/">
              <b>CareFinder</b>
            </a>
          </span>
        </div>

        {/**
         *   ****************************************************************
         *   NO ROLE == GUEST VISITOR NOT LOGGED IN
         *   ****************************************************************
         */}

        {!role && (
          <ul className="CF2-menu">
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#ffffff',
                color: '#ff9900',
                border: 'none',
                padding: '10px 40px',
                cursor: 'pointer',
                borderRadius: '30px',
                position: 'relative',
                top: '3px',
                marginLeft: 10,
              }}
            >
              Login
            </button>
          </ul>
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

        {role === 'client' && (
          <ul className="CF2-menu">
            <li className="CF2-menu-item CF2-hamburger">
              <a onClick={toggleHamburgerMenu}>☰</a>

              <div className={`CF2-hamburger-popover ${isOpen ? 'show' : ''}`}>
                <ul>
                  {/* let's put a button here so people don't get trapped in this menu! */}
                  <button
                    onClick={toggleHamburgerMenu}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    ✕{' '}
                  </button>

                  <a href="/client-dashboard">
                    <li>
                      <FaHome style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Schedule
                    </li>
                  </a>
                  <a href="/msg-inbox">
                    <li>
                      <FaEnvelope
                        style={{ marginRight: '8px', color: 'white' }}
                      />{' '}
                      Messages
                    </li>
                  </a>
                  <a href="/client-dashboard">
                    <li>
                      <FaHeart style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Matches
                    </li>
                  </a>

                  <li
                    style={{
                      borderBottom: '6px solid orange',
                      margin: '35px 0',
                      borderRadius: '9px',
                    }}
                  ></li>

                  <a href="/personal-info">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Personal Info
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Account
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Billing History
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Settings
                    </li>
                  </a>
                  <a href="/feedback">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Submit Feedback
                    </li>
                  </a>

                  <li
                    onClick={handleLogout}
                    className="centered-item"
                    style={{
                      marginTop: '40px',
                      fontWeight: 'bold',
                      fontSize: '125%',
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </li>
                  <li className="centered-item">
                    <a href="/terms-of-service" className="custom-link-terms">
                      Terms of service
                    </a>
                  </li>
                  <li className="centered-item">
                    <a href="/privacy-policy" className="custom-link-privacy">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
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

        {role === 'provider' && (
          <ul className="CF2-menu">
            {/*     <li className="CF2-menu-item"><a href="/">Home</a></li>
            <li className="CF2-menu-item CF2-dropdown">
              <a onMouseEnter={openOtherDropdown} className="CF2-dropdown-toggle" onMouseLeave={closeOtherDropdown}>Dashboard</a>
              <ul className={`CF2-dropdown-menu ${otherDropdownOpen ? 'show' : ''}`}>
                <li><a href="/care-provider-dashboard">Dashboard</a></li>
                <li><a href="/my-afh">My Listings</a></li>
              </ul>
            </li>
            <li className="CF2-menu-item"><a href="/msg-inbox">Inbox</a></li> */}

            <li className="CF2-menu-item CF2-hamburger">
              <a onClick={toggleHamburgerMenu}>☰</a>

              <div className={`CF2-hamburger-popover ${isOpen ? 'show' : ''}`}>
                <ul>
                  {/* let's put a button here so people don't get trapped in this menu! */}
                  <button
                    onClick={toggleHamburgerMenu}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    ✕{' '}
                  </button>

                  <a href="/###">
                    <li>
                      <FaHome style={{ marginRight: '8px', color: 'gray' }} />{' '}
                      Schedule
                    </li>
                  </a>
                  <a href="/msg-inbox">
                    <li>
                      <FaEnvelope
                        style={{ marginRight: '8px', color: 'white' }}
                      />{' '}
                      Messages
                    </li>
                  </a>
                  <a href="/my-afh">
                    <li>
                      <FaHome style={{ marginRight: '8px', color: 'white' }} />{' '}
                      My AFH
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaHeart style={{ marginRight: '8px', color: 'gray' }} />{' '}
                      State residents
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCloud style={{ marginRight: '8px', color: 'gray' }} />{' '}
                      Community
                    </li>
                  </a>

                  <li
                    style={{
                      borderBottom: '6px solid orange',
                      margin: '35px 0',
                      borderRadius: '9px',
                    }}
                  ></li>

                  {/*   <a href="/personal-info"><li><FaCog style={{ marginRight: '8px', color: 'white' }} /> Personal Info</li></a>
                  <li><a href="/provider-menu">Login & Security</a></li>
                  <li><a href="/provider-menu">Provider Menu</a></li>
                 */}
                  <a href="/account">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Account
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'gray' }} />{' '}
                      Billing History
                    </li>
                  </a>
                  <a href="/settings">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Settings
                    </li>
                  </a>
                  <a href="/feedback">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Submit Feedback
                    </li>
                  </a>

                  <li
                    onClick={handleLogout}
                    className="centered-item"
                    style={{
                      marginTop: '40px',
                      fontWeight: 'bold',
                      fontSize: '125%',
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </li>
                  <li className="centered-item">
                    <a href="/terms-of-service" className="custom-link-terms">
                      Terms of service
                    </a>
                  </li>
                  <li className="centered-item">
                    <a href="/privacy-policy" className="custom-link-privacy">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
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

        {role === 'admin' && (
          <ul className="CF2-menu">
            <li className="CF2-menu-item CF2-dropdown">
              <a
                onMouseEnter={openOtherDropdown}
                className="CF2-dropdown-toggle"
                onMouseLeave={closeOtherDropdown}
              >
                Admin
              </a>
              <ul
                className={`CF2-dropdown-menu ${otherDropdownOpen ? 'show' : ''}`}
              >
                <li>
                  <a href="/msg-inbox">Inbox</a>
                </li>
                <li>
                  <a href="/msg-admin">Admin Messenger</a>
                </li>
                <li>
                  <a href="/msg-admin-spoof">Admin Messenger Spoof</a>
                </li>
                <li>
                  <a href="/admin-client-viewer">User Viewer</a>
                </li>
              </ul>
            </li>

            <li className="CF2-menu-item CF2-dropdown">
              <a
                onMouseEnter={openOtherDropdown}
                className="CF2-dropdown-toggle"
                onMouseLeave={closeOtherDropdown}
              >
                Clients
              </a>
              <ul
                className={`CF2-dropdown-menu ${otherDropdownOpen ? 'show' : ''}`}
              >
                <li>
                  <a href="/client-dashboard">Client Dashboard</a>
                </li>
                <li>
                  <a href="/client-menu">Client Menu</a>
                </li>
              </ul>
            </li>

            <li className="CF2-menu-item CF2-dropdown">
              <a
                onMouseEnter={openOtherDropdown}
                className="CF2-dropdown-toggle"
                onMouseLeave={closeOtherDropdown}
              >
                Providers
              </a>
              <ul
                className={`CF2-dropdown-menu ${otherDropdownOpen ? 'show' : ''}`}
              >
                <li>
                  <a href="/care-provider">Provider Info</a>
                </li>
                <li>
                  <a href="/care-provider-dashboard">Provider Dashboard</a>
                </li>
                <li>
                  <a href="/provider-menu">Provider Menu</a>
                </li>
                <li>
                  <a href="/my-afh">Provider Listings</a>
                </li>
              </ul>
            </li>

            <li className="CF2-menu-item CF2-hamburger">
              <a onClick={toggleHamburgerMenu}>☰</a>

              <div className={`CF2-hamburger-popover ${isOpen ? 'show' : ''}`}>
                <ul>
                  {/* let's put a button here so people don't get trapped in this menu! */}
                  <button
                    onClick={toggleHamburgerMenu}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    ✕{' '}
                  </button>

                  <a href="/###">
                    <li>
                      <FaHome style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Schedule
                    </li>
                  </a>
                  <a href="/msg-inbox">
                    <li>
                      <FaEnvelope
                        style={{ marginRight: '8px', color: 'white' }}
                      />{' '}
                      Messages
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaHeart style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Matches
                    </li>
                  </a>

                  <li
                    style={{
                      borderBottom: '6px solid orange',
                      margin: '35px 0',
                      borderRadius: '9px',
                    }}
                  ></li>

                  <a href="/personal-info">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Personal Info
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Account
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Billing History
                    </li>
                  </a>
                  <a href="/###">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Settings
                    </li>
                  </a>
                  <a href="/feedback">
                    <li>
                      <FaCog style={{ marginRight: '8px', color: 'white' }} />{' '}
                      Submit Feedback
                    </li>
                  </a>

                  <li
                    onClick={handleLogout}
                    className="centered-item"
                    style={{
                      marginTop: '40px',
                      fontWeight: 'bold',
                      fontSize: '125%',
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </li>
                  <li className="centered-item">
                    <a href="/terms-of-service" className="custom-link-terms">
                      Terms of service
                    </a>
                  </li>
                  <li className="centered-item">
                    <a href="/privacy-policy" className="custom-link-privacy">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        )}

        {/**
         *   ****************************************************************
         *   END ADMIN ROLE MENU
         *   ****************************************************************
         */}
      </nav>
    </div>
  );
}
