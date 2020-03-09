import React from 'react';
import './styles.css';
import {
    Col,
    Row,
    ListGroup, 
    ListGroupItem
} from 'reactstrap';

import { Auth } from 'aws-amplify';

const styles = {
    link : {
        cursor: 'pointer',
        backgroundColor:'transparent'
    },
    footer : {
        position:'fixed' , 
        bottom: 10 , 
        color:'#fff' , 
        paddingLeft: 10 , 
        paddingRight: 10,
        fontSize: 10,
        maxWidth: '25%',
        width: '100%',
        textAlign: 'center' ,
    }
}

export class SideBar extends React.Component {

    menus = {
        'broadcast' : {
          icon: 'fas fa-podcast',
          title: 'Broadcast Post & Privilege',
          link : '/admin/post',
        } ,
        'event' : {
          icon: 'far fa-calendar',
          title: 'Event Management',
          link : '/admin/event',
        } ,
        'member' : {
          icon: 'far fa-user',
          title: 'Member Management',
          link : '/admin/member',
        } ,
        'company' : {
            icon: 'far fa-building',
            title: 'Member Company',
            link : '/admin/company',
        } ,
        'report' : {
            icon: 'fas fa-exclamation-circle',
            title: 'Ticket Report',
            link : '/admin/report',
        } ,
        'feedback' : {
            icon: 'fas fa-exclamation-circle',
            title: 'Feedback',
            link : '/admin/feedback',
        } ,
        'create_user' : {
            icon: 'far fa-edit',
            title: 'Create User',
            link : '/admin/user',
        },
        'sign_out' : {
            icon: "fas fa-sign-out-alt",
            title: "Sign out",
            link : '/admin/signout'
        }
    }

    state = {
        user: {
            attributes: {
                name: '',
                family_name: ''
            }
        }
    }

    async componentDidMount() {
        let currentUser = await Auth.currentAuthenticatedUser();
        console.log(currentUser);
        this.setState({user: currentUser});
    }


    render() {
        return [
            <Col 
                key={0}
                className="col-md-3 col-xs-1 pl-0 pr-0 float-left" 
                id="sidebar" 
            >
                <Row className="ml-0 mr-0" style={{justifyContent:'center'}}>
                    <img src="/images/logo.png" style={{width:'200px' , height: '160px'}} />
                </Row>
                <Row className="ml-0 mr-0" style={{justifyContent: 'center' ,alignItems: 'center'}}>
                    <img src="/images/user-blank.jpg" style={{width: 40, height: 40 , borderRadius: 20}} />
                    <div style={{color:'#fff' , marginLeft: 20}}>
                        {this.state.user.attributes.name} {this.state.user.attributes.family_name}
                    </div>
                </Row>
                <ListGroup style={{marginTop: 30 , marginBottom: 30}}>
                    {
                        Object.keys(this.menus).map((key , index)=>(
                            <ListGroupItem key={index} style={styles.link} onClick={()=>{window.location.href = this.menus[key].link}}>
                                <Row className="ml-0 mr-0" style={{alignItems:'center' , paddingLeft: 20 , flexWrap:'nowrap'}}>
                                    <i className={this.menus[key].icon} style={{color:'#b21e23'}}></i>
                                    <div style={{color:'#fff' , marginLeft: 20}}>{this.menus[key].title}</div>
                                </Row>
                            </ListGroupItem>
                        ))
                    }
                </ListGroup>
                <div style={styles.footer}>
                    &copy; 2019 Mercedes-Benz (Thailand) Ltd.
                </div>
            </Col> ,
            <Col key={1} className="col-md-9 col-xs-11 pl-0 pr-0 float-right">
                {this.props.content}
            </Col>
        ]
    }
}