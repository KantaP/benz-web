import React from 'react';
import './style.css';
import { 
    Button, 
    Form, 
    FormGroup, 
    Input, 
    Col , 
    Row,
    Alert
} from 'reactstrap';

// import LoadingOverlay from 'react-loading-overlay';

 
export const DownloadPage = (props) => (
    <div style={{
        backgroundImage: `url(/images/downloadBg.png)`, 
        paddingTop: '3rem', 
        paddingBottom: '3rem',
        backgroundSize:'cover',
        flex: 1
    }}>
       <Row>
           <Col xs="2" md="3" sm="2"></Col>
           <Col xs="8" md="6" sm="8">
                <div style={{
                    background:'rgba(0,0,0,0.4)',
            
                    position: 'relative',
                    display: 'flex' ,
                    flexDirection: 'row',
                    justifyContent:'center'
                }}>
                    <div style={{padding: 10}}>
                        <Row style={{margin: 0 , justifyContent:'center' , textAlign:'center'}}>
                            <p style={{fontSize: 24 , color:'#fff'}}>
                                Welcome
                            </p>
                        </Row>
                        <Row style={{margin: 0 , paddingTop: 10 , justifyContent:'center' , textAlign:'center'}}>
                            <p style={{color:'#fff' , fontSize: 14}}>
                                and thanks for joining us at AMG Club Thailand!
                                Username and Password to log in to
                                www.amgclubthailand.com
                            </p>
                        </Row>
                        <Row style={{margin: 0 , paddingTop: 10 , justifyContent:'center' , textAlign:'center'}}>
                            <img src="/images/downloadApp.png" style={{height: '400px'}} />
                        </Row>
                        <Row style={{margin: 0 , paddingTop: 20 , justifyContent:'center' , textAlign:'center'}}>
                            <img src="/images/downloadBtn.png" style={{height: 60 , width: 400}} />
                        </Row>
                    </div>
                </div>
           </Col>
           <Col xs="2" md="3" sm="2"></Col>
       </Row>
    </div>
)

