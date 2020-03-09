import React from 'react';

import './styles.css';

import {
    Container ,
    Row
} from 'reactstrap';

import { TopMenu } from './TopMenu';
import { Footer } from './Footer';

const LandingPageLayout = ({content}) => (
    <Container 
        fluid={true}  
        // className="container-fluid d-flex h-100 flex-column"
        style={{ minHeight: '100%' , paddingLeft: 0 , paddingRight: 0}}
    >
        <TopMenu />
        <Row style={{
            backgroundColor:'transparent' , 
            justifyContent:'center',
            display: 'flex',
            flex: 1,
        }}>
            {content}
        </Row>
        <Footer />
    </Container>
)

export default LandingPageLayout;