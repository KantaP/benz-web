import React from 'react';

import { 
    Nav ,
    Navbar ,
    Collapse ,
    Row
} from 'reactstrap'; 
import { FlowRouter } from 'meteor/kadira:flow-router'

export class TopMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        currentRoute: ""
      };
      this.menus = {
          'broadcast' : {
            icon: 'fas fa-podcast',
            title: 'Boardcast Post & Privilege'
          } ,
          'event' : {
            icon: 'far fa-calendar',
            title: 'Event Management'
          } ,
          'member' : {
            icon: 'far fa-user',
            title: 'Member Management'
          } ,
          'report' : {
              icon: 'fas fa-exclamation-circle',
              title: 'Ticket Report'
          } ,
          'create_user' : {
              icon: 'far fa-edit',
              title: 'Create User'
          }
      }
    }
    componentDidMount() {
        let currentRoute = FlowRouter.current().route.name.toLowerCase();
        // console.log(currentRoute);
        this.setState({currentRoute:currentRoute});
    }
    render() {
      return (
        <div>
          <Navbar style={{backgroundColor:'#000' , padding: '0rem 1rem'}} expand="md">
            <Nav className="ml-auto" navbar>
                {
                    (this.state.currentRoute) &&
                    (
                        <Row style={{padding: 5 , alignItems:'center', marginLeft: 40}}>
                            <i className={this.menus[this.state.currentRoute].icon} style={{color:'#b21e23'}}></i>
                            <div style={{color:'#fff' , marginLeft: 5}}>{this.menus[this.state.currentRoute].title}</div>
                        </Row>
                    )
                }
                
            </Nav>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar></Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }
  }