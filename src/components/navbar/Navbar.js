import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem 
} from 'reactstrap';

class NavbarComponent extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { handleViewPage } = this.props;

    return (
      <Navbar className="NavbarComponent" color="light" light expand="md">
        <NavbarBrand onClick={() => handleViewPage("home")}>Playing For Ke[ETH]s</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <p onClick={() => handleViewPage("account")} className="nav-link">View Account</p>
            </NavItem>
            <NavItem>
              <p onClick={() => handleViewPage("createGame")} className="nav-link">View Create Game</p>
            </NavItem>
            <NavItem>
              <p onClick={() => handleViewPage("currentGame")} className="nav-link">View Game</p>
            </NavItem>
            <NavItem>
              <p onClick={() => handleViewPage("joinGame")} className="nav-link">View Join Game</p>
            </NavItem>
            <NavItem>
              <p onClick={() => handleViewPage("endGame")} className="nav-link">View End Game</p>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default NavbarComponent;
