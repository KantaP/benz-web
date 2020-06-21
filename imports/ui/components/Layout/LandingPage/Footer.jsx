import React from 'react';

import {
    Row ,
} from 'reactstrap';

export const Footer = () => (
    <Row style={{
        justifyContent:'center' ,
        alignItems:'center',
        backgroundColor:'#000' , 
        padding: 10
    }}>
        <p style={{color:'#fff' , fontSize: '10px'}}>
            &copy; 2020 Mercedes-Benz (Thailand) Limited. All rights reversed (provider)
        </p>
    </Row>
)