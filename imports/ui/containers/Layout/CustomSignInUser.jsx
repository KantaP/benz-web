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

export class CustomSignInUser extends SignIn {
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
        if(!user.signInUserSession.idToken.payload['cognito:groups'].includes('Users')) {
            await this.setState({error:'This session for user only.' , loading: false});
            await signout();
            return;
        }

        await window.localStorage.setItem('@benz-token' , user.signInUserSession.refreshToken.token);
       
        // console.log('user logged' , user);
        window.location.reload()
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
                        <Col xs="2" md="3" sm="1"></Col>
                        <Col xs="8" md="6" sm="10" style={{
                            minHeight: '320px',
                            backgroundColor:'#fff'
                        }}>
                            <Row style={{
                                justifyContent:'center', 
                                flexWrap:'wrap' , 
                                marginTop: 20 , 
                                paddingLeft: '6rem' , 
                                paddingRight: '6rem',
                                textAlign:'center'
                            }}>
                                <p style={{fontSize:'16px',fontWeight:'bold'}}>Please login with your email and password to proceed registration and payment</p>
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
                        <Col xs="2" md="3" sm="1"></Col>
                    </Row>
                </div>
            </LoadingOverlay>
        );
      }
}