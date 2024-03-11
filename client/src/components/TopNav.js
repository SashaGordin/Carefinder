import React from "react";
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';


const TopNav = (props) => {

    const userRole = props?.userRole ?? "client"; //not sure what default should be
    const clientNavItems = <>
        <Nav.Item>
            <Nav.Link href="/" title="Item">Browse</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="#" title="Item">Hub</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="/msg-inbox" title="Item">Inbox</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="##" title="Item">Menu</Nav.Link>
        </Nav.Item></>
   const providerNavItems = <> <Nav.Item>
        <Nav.Link href="/care-provider-dashboard" title="Item">Home</Nav.Link>
    </Nav.Item>

        <Nav.Item>
            <Nav.Link href="/your-listings" title="Item">My Listing</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="/msg-inbox" title="Item">Inbox</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            <Nav.Link href="#" title="Item">Menu</Nav.Link>
        </Nav.Item></>
    const NavItems = userRole == "provider" ? providerNavItems : clientNavItems;
    return (
        <>
            <div className='topnavigation'>

                <div className="contentContainer">

                    <div className="topNavLeft">
                        <img src='cflogo.png' alt="Welcome to CareFinder" />
                        Carefinder
                    </div>

                    <div className="topNavRight">

                        <Nav variant="pills">

                            {NavItems}
{
/* //don't think we need a dropdown menu, unless maybe for mobile. Can use a @media query to manage that - JG
                            <NavDropdown title="Dropdown" id="nav-dropdown">
                                <NavDropdown.Item>Action</NavDropdown.Item>
                                <NavDropdown.Item>Another action</NavDropdown.Item>
                                <NavDropdown.Item>Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item>Separated link</NavDropdown.Item>
                            </NavDropdown> */}

                        </Nav>

                    </div>

                    <div className="clear"></div>

                </div>

            </div>

        </>

    );
};

export default TopNav;

