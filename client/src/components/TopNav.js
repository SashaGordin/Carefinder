// import React, { useState, useEffect } from "react";
// import { Nav } from "react-bootstrap";
// import { NavDropdown } from "react-bootstrap";
// import { getDoc, doc } from "firebase/firestore";
// import { firestore } from "../firebase"; // Import your Firestore instance
// import { useAuth } from "../contexts/AuthContext";
// import firebase from 'firebase/compat/app';

// export default function TopNav() {
// 	const [role, setRole] = useState("");
// 	const { currentUser } = useAuth();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const userDocRef = doc(firestore, "users", currentUser.uid);
// 				const userDocSnapshot = await getDoc(userDocRef);
// 				if (userDocSnapshot.exists()) {
// 					const userData = userDocSnapshot.data();
// 					setRole(userData.role);
// 				}
// 			} catch (error) {
// 				console.log("the error: ", error);
// 			}
// 		};
// 		if (currentUser) {
// 			fetchData(); // Call the async function immediately
// 		}
// 	}, []);

// 	const handleLogout = () => {
// 		firebase.auth().signOut().then(() => {
// 		  // Sign-out successful.
// 		  console.log("User signed out successfully");
// 		}).catch((error) => {
// 		  // An error happened.
// 		  console.error("Error signing out:", error);
// 		});
// 	  };


// 	return (
// 		<>
// 			<div className="topnavigation">
// 				<div className="contentContainer">
// 					<div className="topNavLeft">
// 					<a href={process.env.PUBLIC_URL + '/'}>
// 						<img src={process.env.PUBLIC_URL + '/cflogo.png'} alt="Welcome to CareFinder" />
// 						Carefinder
// 					</a>
// 					</div>

// 					<div className="topNavRight">

// 						{!role && (

// 							<Nav variant="pills">
// 								<Nav.Item>
// 									<Nav.Link href="/" title="About Us">
// 										About Carefinder
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/login" title="Login">
// 										Login
// 									</Nav.Link>
// 								</Nav.Item>

// 							</Nav>
// 						)}

// 						{role === "client" && (
// 							<Nav variant="pills">
// 								<Nav.Item>
// 									<Nav.Link href="/client-dashboard" title="Browse">
// 										Browse
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/msg-inbox" title="Inbox">
// 										Inbox
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/msg-outbox" title="Outbox">
// 										Outbox
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/client-menu" title="Menu">
// 										Menu
// 									</Nav.Link>
// 								</Nav.Item>

// 							</Nav>
// 						)}
// 						{role === "provider" && (
// 							<Nav variant="pills">
// 								<Nav.Item>
// 									<Nav.Link href="/care-provider-dashboard" title="Home">
// 										Home
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/your-listings" title="Your listings">
// 										My Listings
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/msg-inbox" title="Inbox">
// 										Inbox
// 									</Nav.Link>
// 								</Nav.Item>

// 								<Nav.Item>
// 									<Nav.Link href="/msg-outbox" title="Outbox">
// 										Outbox
// 									</Nav.Link>
// 								</Nav.Item>


// 								<Nav.Item>
// 									<Nav.Link href="/provider-menu" title="Menu">
// 										Menu
// 									</Nav.Link>
// 								</Nav.Item>

// 								{/* <NavDropdown title="Dropdown" id="nav-dropdown">
//                             <NavDropdown.Item>Action</NavDropdown.Item>
//                             <NavDropdown.Item>Another action</NavDropdown.Item>
//                             <NavDropdown.Item>Something else here</NavDropdown.Item>
//                             <NavDropdown.Divider />
//                             <NavDropdown.Item>Separated link</NavDropdown.Item>
//                         </NavDropdown> */}
// 							</Nav>
// 						)}
// 						{role === "admin" && (
// 							<Nav variant="pills">
// 								<Nav.Item>
// 									<Nav.Link href="/" title="Home">
// 										CareFinder Home
// 									</Nav.Link>
// 								</Nav.Item>

// 								<NavDropdown title="Messaging" id="admin-utils">
// 									<NavDropdown.Item href="/msg-inbox" title="Message Anyone">Inbox</NavDropdown.Item>
// 									<NavDropdown.Item href="/msg-outbox" title="User Viewer">Outbox</NavDropdown.Item>
// 								</NavDropdown>

// 								<NavDropdown title="Admin Utils" id="admin-utils">
// 								<NavDropdown.Item href="/msg-admin" title="Message Anyone from YOU">Admin Messager</NavDropdown.Item>
// 								<NavDropdown.Item href="/msg-admin-spoof" title="Message Anyone from ANYONE">Admin Messager Spoof</NavDropdown.Item>
// 									<NavDropdown.Item href="/admin-client-viewer" title="User Viewer">User Viewer</NavDropdown.Item>
// 								</NavDropdown>

// 								<NavDropdown title="Clients" id="client-dropdown">
// 									<NavDropdown.Item href="/client-dashboard" title="Client Dashboard">Client Dashboard</NavDropdown.Item>
// 									<NavDropdown.Item href="/client-menu" title="Client Menu">Client Menu</NavDropdown.Item>
// 								</NavDropdown>

// 								<NavDropdown title="Providers" id="provider-dropdown">
// 									<NavDropdown.Item href="/provider-menu" title="Provider Menu">Provider Menu</NavDropdown.Item>
// 									<NavDropdown.Item href="/care-provider-dashboard" title="Provider Dashboard">Provider Dashboard</NavDropdown.Item>
// 									<NavDropdown.Item href="/your-listings" title="Provider Listings">Provider Listings</NavDropdown.Item>
// 								</NavDropdown>

// 								<Nav.Item>
// 									<Nav.Link onClick={handleLogout} title="Logout">
// 										Logout
// 									</Nav.Link>
// 								</Nav.Item>

// 							</Nav>

// 							)}

// 					</div>

// 					<div className="clear"></div>
// 				</div>
// 			</div>
// 		</>
// 	);
// }
import React, { useState, useEffect } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import firebase from 'firebase/compat/app';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TopNav() {
  const [role, setRole] = useState("");
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setRole(userData.role);
        }
      } catch (error) {
        console.log("the error: ", error);
      }
    };
    if (currentUser) {
      fetchData(); // Call the async function immediately
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

  return (
    <>
      <div className="topnavigation" style={{ backgroundColor: "#1E1E1E", padding: "10px 0" }}>
        <div className="contentContainer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="topNavLeft">
            <a href={process.env.PUBLIC_URL + '/'} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "white", fontSize: "24px" }}>
              <img src={process.env.PUBLIC_URL + '/cflogo.png'} alt="Welcome to CareFinder" style={{ marginRight: "10px", width: "40px", height: "40px" }} />
              Carefinder
            </a>
          </div>

          <div className="topNavRight" style={{ display: "flex", gap: "20px" }}>
            {!role && (
              <Nav className="nav-pills" style={{ gap: "20px" }}>
                <Nav.Item>
                  <Nav.Link
                    href="/"
                    title="About Us"
                    onClick={() => handleNavClick("/")}
                    style={navLinkStyle("/")}
                  >
                    About Carefinder
                  </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link
                    href="/login"
                    title="Login"
                    onClick={() => handleNavClick("/login")}
                    style={navLinkStyle("/login")}
                  >
                    Login
                  </Nav.Link>
                </Nav.Item> */}
              </Nav>
            )}

            {role === "client" && (
              <Nav className="nav-pills" style={{ gap: "20px", fontWeight: 500, color: "white" }}>
                <Nav.Item>
                  <Nav.Link
                    href="/client-dashboard"
                    title="Browse"
                    onClick={() => handleNavClick("/client-dashboard")}
                    style={navLinkStyle("/client-dashboard")}
                  >
                    Browse
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="/msg-inbox"
                    title="Inbox"
                    onClick={() => handleNavClick("/msg-inbox")}
                    style={navLinkStyle("/msg-inbox")}
                  >
                    Inbox
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}

            {role === "provider" && (
              <Nav className="nav-pills" style={{ gap: "20px", fontWeight: 500, color: "white" }}>
                <Nav.Item>
                  <Nav.Link
                    href="/care-provider-dashboard"
                    title="Home"
                    onClick={() => handleNavClick("/care-provider-dashboard")}
                    style={navLinkStyle("/care-provider-dashboard")}
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="/your-listings"
                    title="Your listings"
                    onClick={() => handleNavClick("/your-listings")}
                    style={navLinkStyle("/your-listings")}
                  >
                    My Listings
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="/msg-inbox"
                    title="Inbox"
                    onClick={() => handleNavClick("/msg-inbox")}
                    style={navLinkStyle("/msg-inbox")}
                  >
                    Inbox
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}

            {role === "admin" && (
              <Nav className="nav-pills" style={{ gap: "20px", fontWeight: 500, color: "white" }}>
                <Nav.Item>
                  <Nav.Link
                    href="/"
                    title="Home"
                    onClick={() => handleNavClick("/")}
                    style={navLinkStyle("/")}
                  >
                    CareFinder Home
                  </Nav.Link>
                </Nav.Item>
                <NavDropdown
                  title="Messaging"
                  id="admin-utils"
                  style={{ color: activePage.startsWith("/msg") ? "white" : "#777777" }}
                >
                  <NavDropdown.Item
                    href="/msg-inbox"
                    title="Message Anyone"
                    onClick={() => handleNavClick("/msg-inbox")}
                    style={{ color: activePage === "/msg-inbox" ? "white" : "#777777" }}
                  >
                    Inbox
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/msg-outbox"
                    title="User Viewer"
                    onClick={() => handleNavClick("/msg-outbox")}
                    style={{ color: activePage === "/msg-outbox" ? "white" : "#777777" }}
                  >
                    Outbox
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="Admin Utils"
                  id="admin-utils"
                  style={{ color: activePage.startsWith("/admin") ? "white" : "#777777" }}
                >
                  <NavDropdown.Item
                    href="/msg-admin"
                    title="Message Anyone from YOU"
                    onClick={() => handleNavClick("/msg-admin")}
                    style={{ color: activePage === "/msg-admin" ? "white" : "#777777" }}
                  >
                    Admin Messager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/msg-admin-spoof"
                    title="Message Anyone from ANYONE"
                    onClick={() => handleNavClick("/msg-admin-spoof")}
                    style={{ color: activePage === "/msg-admin-spoof" ? "white" : "#777777" }}
                  >
                    Admin Messager Spoof
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/admin-client-viewer"
                    title="User Viewer"
                    onClick={() => handleNavClick("/admin-client-viewer")}
                    style={{ color: activePage === "/admin-client-viewer" ? "white" : "#777777" }}
                  >
                    User Viewer
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="Clients"
                  id="client-dropdown"
                  style={{ color: activePage.startsWith("/client") ? "white" : "#777777" }}
                >
                  <NavDropdown.Item
                    href="/client-dashboard"
                    title="Client Dashboard"
                    onClick={() => handleNavClick("/client-dashboard")}
                    style={{ color: activePage === "/client-dashboard" ? "white" : "#777777" }}
                  >
                    Client Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/client-menu"
                    title="Client Menu"
                    onClick={() => handleNavClick("/client-menu")}
                    style={{ color: activePage === "/client-menu" ? "white" : "#777777" }}
                  >
                    Client Menu
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="Providers"
                  id="provider-dropdown"
                  style={{ color: activePage.startsWith("/provider") ? "white" : "#777777" }}
                >
                  <NavDropdown.Item
                    href="/provider-menu"
                    title="Provider Menu"
                    onClick={() => handleNavClick("/provider-menu")}
                    style={{ color: activePage === "/provider-menu" ? "white" : "#777777" }}
                  >
                    Provider Menu
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/care-provider-dashboard"
                    title="Provider Dashboard"
                    onClick={() => handleNavClick("/care-provider-dashboard")}
                    style={{ color: activePage === "/care-provider-dashboard" ? "white" : "#777777" }}
                  >
                    Provider Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/your-listings"
                    title="Provider Listings"
                    onClick={() => handleNavClick("/your-listings")}
                    style={{ color: activePage === "/your-listings" ? "white" : "#777777" }}
                  >
                    Provider Listings
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Item>
                  <Nav.Link
                    onClick={handleLogout}
                    title="Logout"
                    style={navLinkStyle("#logout")}
                  >
                    Logout
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}

            <Nav.Item>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#F44336",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                >
                  Login
                </button>
              )}
            </Nav.Item>
          </div>
        </div>
      </div>
    </>
  );
}
