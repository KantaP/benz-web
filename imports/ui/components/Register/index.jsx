import React from 'react';

import { 
    Container ,
    Col , 
    Row
} from 'reactstrap';

import './styles.css';

import { RegisterForm } from './RegisterForm';
import { ThankyouContent } from './Thankyou';

const RegisterPage = (props) => (
    // <div style={{
    //     backgroundImage: `url(/images/bg.jpg)` , 
    //     backgroundRepeat: 'no-repeat'  , 
    //     backgroundSize: 'cover' ,
    //     paddingTop: '3rem', 
    //     paddingBottom: '3rem',
    //     flex: 1,
    //     display:'flex',
    //     justifyContent:'center'
    // }}>
       <Row
       style={{
            backgroundImage: `url(/images/bg.jpg)` , 
            backgroundRepeat: 'no-repeat'  , 
            backgroundSize: 'cover' ,
            paddingTop: '3rem', 
            paddingBottom: '3rem',
            flex: 1
       }}
       >
           <Col xs="1" md="1" sm="1" lg="1"></Col>
           <Col xs="10" md="10" sm="10" lg="10">
                <RegisterForm {...props} />
           </Col>
           <Col xs="1" md="1" sm="1" lg="1"></Col>
       </Row>
    // </div>
)

export const ThankyouPage = (props) => (
    <div style={{
        backgroundImage: `url(/images/bg.jpg)` , 
        backgroundRepeat: 'no-repeat'  , 
        backgroundSize: 'cover' ,
        paddingTop: '3rem', 
        paddingBottom: '3rem',
        flex: 1
    }}>
       <Row>
           <Col xs="2" md="2" sm="2"></Col>
           <Col xs="8" md="8" sm="10" style={{minHeight: '480px', display: 'flex' , alignItems:'center' , justifyContent:'center'}}>
                <ThankyouContent {...props} />
           </Col>
           <Col xs="2" md="2" sm="2"></Col>
       </Row>
    </div>
)

export default RegisterPage;