import React from 'react';

import './styles.css';

import {
    Container ,
} from 'reactstrap';
import { TopMenu } from './TopMenu';
import { SideBar } from './SideBar';

const AdminPageLayout = ({content}) => (
    <Container 
        fluid={true} 
        style={{paddingLeft: 0 , paddingRight: 0}}
    >
        {/* <TopMenu/> */}
        <SideBar content={content} />
    </Container>
)

export default AdminPageLayout;