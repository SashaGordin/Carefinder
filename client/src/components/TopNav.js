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
						<img src="cflogo.png" alt="Welcome to CareFinder" />
						Carefinder
					</div>

					<div className="topNavRight">
						{role === "client" && (
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link href="/" title="Item">
										Browse
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="##" title="Item">
										Hub
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="###" title="Item">
										Inbox
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/client-menu" title="Item">
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
						{role === "provider" && (
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link href="/care-provider-dashboard" title="Item">
										Home
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="##" title="Item">
										My Listings
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="##" title="Item">
										Inbox
									</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link href="/provider-menu" title="Item">
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
					</div>

					<div className="clear"></div>
				</div>
			</div>
		</>
	);
}
