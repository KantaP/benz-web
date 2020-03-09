import React from 'react';

import {
    Row , 
    Col 
} from 'reactstrap';

export const PackageList = (props) => (
    <Row>
        <Col className="border pointer">
            <div className="text-center">
                <h3>Package #1</h3>
            </div>
            <div>$100</div>
        </Col>
        <Col className="border pointer">
            <div>
                <h3>Package #2</h3>
            </div>
            <div>$100</div>
        </Col>
        <Col className="border pointer">
            <div>
                <h3>Package #3</h3>
            </div>
            <div>$100</div>
        </Col>
    </Row>
)

