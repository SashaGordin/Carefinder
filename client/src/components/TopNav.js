import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase"; // Import your Firestore instance
import { useAuth } from "../contexts/AuthContext";

export default function TopNav() {
	const [role, setRole] = useState("");
	const { currentUser } = useAuth();

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
	}, []);

	return (
		<>
			<div className="topnavigation">
				<div className="contentContainer">
					<div className="topNavLeft">
					<a href={process.env.PUBLIC_URL + '/'}>
						<img src={process.env.PUBLIC_URL + '/cflogo.png'} alt="Welcome to CareFinder" />
						Carefinder
					</a>
					</div>

					<div className="topNavRight">
						{role === "client" && (
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link href="/" title="Browse">
										Browse
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/msg-inbox" title="Inbox">
										Inbox
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/client-menu" title="Menu">
										Menu
									</Nav.Link>
								</Nav.Item>

							</Nav>
						)}
						{role === "provider" && (
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link href="/care-provider-dashboard" title="Home">
										Home
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/your-listings" title="Your listings">
										My Listings
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/msg-inbox" title="Inbox">
										Inbox
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/provider-menu" title="Menu">
										Menu
									</Nav.Link>
								</Nav.Item>

								{/* <NavDropdown title="Dropdown" id="nav-dropdown">
                            <NavDropdown.Item>Action</NavDropdown.Item>
                            <NavDropdown.Item>Another action</NavDropdown.Item>
                            <NavDropdown.Item>Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item>Separated link</NavDropdown.Item>
                        </NavDropdown> */}
							</Nav>
						)}
						{role === "admin" && (
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link href="/" title="Home">
										CareFinder Home
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/msg-inbox" title="Inbox">
										Inbox
									</Nav.Link>
								</Nav.Item>

								<NavDropdown title="Clients" id="client-dropdown">
									<NavDropdown.Item href="/client-dashboard" title="Client Dashboard">Client Dashboard</NavDropdown.Item>
									<NavDropdown.Item href="/client-menu" title="Client Menu">Client Menu</NavDropdown.Item>
									<NavDropdown.Item href="/admin-client-viewer" title="Client Viewer">Client Viewer</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown title="Providers" id="provider-dropdown">
									<NavDropdown.Item href="/provider-menu" title="Provider Menu">Provider Menu</NavDropdown.Item>
									<NavDropdown.Item href="/care-provider-dashboard" title="Provider Dashboard">Provider Dashboard</NavDropdown.Item>
									<NavDropdown.Item href="/your-listings" title="Provider Listings">Provider Listings</NavDropdown.Item>
								</NavDropdown>
							</Nav>

							)}

					</div>

					<div className="clear"></div>
				</div>
			</div>
		</>
	);
}
