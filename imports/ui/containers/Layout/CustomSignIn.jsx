import React from 'react';
import { SignIn } from 'aws-amplify-react/dist/Auth';
import { signIn , signout } from '../../../api/aws/cognito';
import LoadingOverlay from 'react-loading-overlay';
import './styles.css';
import { 
    Col ,
    Row ,
    Button, 
    Form, 
    FormGroup, 
    Input, 
} from 'reactstrap';

export class CustomSignIn extends SignIn {
    constructor(props) {
        super(props);
        this._validAuthStates = ["signIn", "signedOut", "signedUp"];
        this.state = {
            username: '',
            password: '',
            error: '',
            submit: false,
            loading: false
        }
    }

    customSignIn = async() => {
        try {
            await this.setState({submit: true});
            if(!this.state.username) {
                await this.setState({error:'Username cannot empty.'});
                return;
            }
            if(!this.state.password) {
                await this.setState({error:'Password cannot empty.'});
                return;
            }
            await this.setState({loading: true});
            let user = await signIn(this.state);
            if(!user.signInUserSession.idToken.payload['cognito:groups'].includes('Admins')) {
                await this.setState({error:'This session for admin only.' , loading: false});
                await signout();
                return;
            }
            window.location.reload()
        }catch(error) {
            window.location.reload()
        }
        
        // console.log('user logged' , user);
        
    }

    showComponent(theme) {
        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner
                text='Signing In...'
            >
                <div style={{backgroundColor:'#000', padding: 40 , height: '100vh'}}>
                    <Row style={{justifyContent:'center'}}>
                    <img
                        style={{width: 240 , height: 160}}
                        src="/images/logo.png"
                    />
                    </Row>
                    <Row>
                        <Col xs="0" md="3" className="hidden-sm hidden-xs"></Col>
                        <Col xs="12" md="6" sm="12" style={{
                            minHeight: '320px',
                            backgroundColor:'#fff',
                            padding: '10px'
                        }}>
                            <Row style={{
                                justifyContent:'center', 
                                flexWrap:'wrap' , 
                                marginTop: 20 , 
                                // paddingLeft: '6rem' , 
                                // paddingRight: '6rem',
                                textAlign:'center'
                            }}>
                                <p style={{fontSize:'16px',fontWeight:'bold'}}>Log in with your email address and password</p>
                            </Row>
                            <Row style={{justifyContent:'center' , marginTop: 15}}>
                                <FormGroup style={{width: '80%'}}>
                                    <Input 
                                        type="text" 
                                        name="username" 
                                        key="username"
                                        onChange={(e)=>{
                                            this.state.username = e.target.value;
                                        }}
                                        id="username" 
                                        placeholder="Username" 
                                        className="custom_input"
                                    />
                                </FormGroup>
                            </Row>
                            <Row style={{justifyContent:'center' , marginTop: 15}}>
                                <FormGroup style={{width: '80%'}}>
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        key="password"
                                        placeholder="Password" 
                                        onChange={(e)=>{
                                            this.state.password = e.target.value;
                                        }}
                                        className="custom_input"
                                    />
                                </FormGroup>
                            </Row>
                            <Row style={{justifyContent:'center' , marginTop: 3}}>
                                <div style={{width:'80%' , textAlign:'right'}}>
                                    <a href='/forgotpassword' style={{fontSize: 12, color:'#000'}}>Forgot password</a>
                                </div>
                            </Row>
                            <Row style={{justifyContent:'center'  , marginTop: 15}}>
                                <Button 
                                onClick={() => this.customSignIn()}
                                style={{width: '70%' , backgroundColor:'#000'}}>
                                    Login
                                </Button>
                            </Row>
                            {
                                (this.state.submit && this.state.error) &&
                                (
                                    <Row style={{justifyContent:'center'  , marginTop: 15}}>
                                        <p style={{color:'red'}}>{this.state.error}</p>
                                    </Row>
                                )
                            }
                        </Col>
                        <Col xs="0" md="3" className="hidden-sm hidden-xs"></Col>
                    </Row>
                </div>
            </LoadingOverlay>
        );
      }
}