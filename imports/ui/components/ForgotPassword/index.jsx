import React from 'react';

import { 
    Button, 
    Form, 
    FormGroup, 
    Input, 
    Col , 
    Row,
    Alert
} from 'reactstrap';

import LoadingOverlay from 'react-loading-overlay';

const styles = {
    customInput: (required) => {
        if(!required) {
            return {
                backgroundColor:'transparent',
                border:0,
                borderRadius: 0,
                borderBottom:'1px solid #cccccc',
                color:'#fff',
            }
        } 
        return {
            backgroundColor:'transparent',
            border:0,
            borderRadius: 0,
            borderBottom:'1px solid red',
            color:'#fff',
        }
    }
}



export const ForgotPasswordPage = (props) => {
    let verifyCodeValidator = (props.state.submit && !props.state.verifyCode) ? true : false;
    let passwordValidator = (props.state.submit && !props.state.password) ? true : false;
    let confirmPasswordValidator = (props.state.submit && !props.state.confirmPassword) ? true : false;
    return (
    <div style={{
        backgroundImage: `url(/images/bg.jpg)`, 
        paddingTop: '3rem', 
        paddingBottom: '3rem',
        height: '100vh',
        flex: 1
    }}>
        <LoadingOverlay
            active={props.state.loading}
            spinner
            text='Loading...'
        >
       <Row>
           <Col xs="2" md="2" sm="2"></Col>
           <Col xs="8" md="8" sm="8">
                {/* <label>Forgot Password</label> */}
                {
                    !props.state.forgotSend &&
                    (
                        <Form>
                        <FormGroup row>
                            <Input 
                                type="text" 
                                name="email" 
                                id="email" 
                                placeholder="Your Email" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    props.state.email = e.target.value;
                                }}
                            />
                        </FormGroup>
                        <FormGroup row style={{justifyContent:'center' ,marginTop: 30}}>
                            <Button
                            onClick={()=>{
                                props.onForgotPassword();
                            }}
                            type="button"
                            style={{
                                backgroundColor:'transparent',
                                border:'1px solid #ffffff',
                                width: '170px',
                                height: '30px',
                                fontSize: '14px'
                            }}>
                                SUBMIT
                            </Button>
                        </FormGroup>
                    </Form>
                    )
                }
                {
                    props.state.forgotSend &&
                    (
                        <Form>
                            <FormGroup row>
                                <Input 
                                    type="text" 
                                    name="code" 
                                    id="code" 
                                    placeholder="Your Verification Code" 
                                    style={styles.customInput(verifyCodeValidator)}
                                    onChange={(e)=>{
                                        props.state.verifyCode = e.target.value;
                                    }}
                                />
                            </FormGroup>
                            <FormGroup row>
                                <Input 
                                    type="password" 
                                    name="newPassword" 
                                    id="newPassword" 
                                    placeholder="New Password" 
                                    style={styles.customInput(passwordValidator)}
                                    onChange={(e)=>{
                                        props.state.newPassword = e.target.value;
                                    }}
                                />
                            </FormGroup>
                            <FormGroup row>
                                <Input 
                                    type="password" 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                    placeholder="Confirm Password" 
                                    style={styles.customInput(confirmPasswordValidator)}
                                    onChange={(e)=>{
                                        props.state.confirmPassword = e.target.value;
                                    }}
                                />
                            </FormGroup>
                            <FormGroup row style={{justifyContent:'center' ,marginTop: 30}}>
                                <Button
                                onClick={()=>{
                                    props.onResetPassword();
                                }}
                                type="button"
                                style={{
                                    backgroundColor:'transparent',
                                    border:'1px solid #ffffff',
                                    width: '170px',
                                    height: '30px',
                                    fontSize: '14px'
                                }}>
                                    RESET PASSWORD
                                </Button>
                            </FormGroup>
                        </Form>
                    )
                }
           </Col>
           <Col xs="2" md="2" sm="2"></Col>
       </Row>
       </LoadingOverlay>
    </div>
    )
}

