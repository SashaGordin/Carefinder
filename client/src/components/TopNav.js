import React from "react";
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';

const TopNav = () => (

    <>

        <div className='topnavigation'>

            <div className="contentContainer">

                <div className="topNavLeft">
                    <img src='cflogo.png' alt="Welcome to CareFinder" />
                    Carefinder
                </div>

                <div className="topNavRight">

                    <Nav variant="pills">

                        <Nav.Item>
                            <Nav.Link href="/" title="Item">Browse</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link href="##" title="Item">Hub</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link href="###" title="Item">Inbox</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link href="/client-menu" title="Item">Menu</Nav.Link>
                        </Nav.Item>

                        <NavDropdown title="Dropdown" id="nav-dropdown">
                            <NavDropdown.Item>Action</NavDropdown.Item>
                            <NavDropdown.Item>Another action</NavDropdown.Item>
                            <NavDropdown.Item>Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item>Separated link</NavDropdown.Item>
                        </NavDropdown>

                    </Nav>

                </div>

                <div className="clear"></div>

            </div>

        </div>

    </>

);

export default TopNav;

