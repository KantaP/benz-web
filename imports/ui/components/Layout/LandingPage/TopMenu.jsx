import React from 'react';

import { 
    Nav ,
    Navbar ,
    NavbarToggler , 
    NavbarBrand ,
    Collapse ,
    Row
} from 'reactstrap'; 


export class TopMenu extends React.Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    render() {
      return (
        <Row style={{
          backgroundColor:'#000' , 
          padding: 10
      }}>
          <Navbar style={{backgroundColor:'#000' , padding: '0rem 1rem'}} expand="md">
            <NavbarBrand href="/" style={{paddingTop: '0rem' , paddingBottom: '0rem'}}>
              <img src="/images/logo.png" style={{width:'120px' , height: '80px'}} />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
              </Nav>
            </Collapse>
          </Navbar>
        </Row>
      );
    }
  }