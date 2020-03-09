import React from 'react';
import LandingPageLayout from '../../components/Layout/LandingPage';
import { Authenticator } from 'aws-amplify-react/dist/Auth';
import { SignIn  , Greetings } from 'aws-amplify-react';
import { CustomSignInUser } from './CustomSignInUser';
import { CustomGreetings } from './CustomGreetings';
import "react-datepicker/dist/react-datepicker.css";

import { signout } from '../../../api/aws/cognito';

export class LandingPageLayoutContainer extends React.Component{
    render() {
        return <LandingPageLayout {...this.props} />;
    }   
}


export class LandingAuthPageContainer extends React.Component{

    async componentWillReceiveProps(newProps) {
      console.log(newProps);
      if(newProps.authData) {
        if(!newProps.authData.signInUserSession.accessToken.payload['cognito:groups'].includes('Users')) {
            alert('This session for user only');
            window.history.back();
            return;
        }
        let token = await window.localStorage.getItem('@benz-token');
        if(token !== newProps.authData.signInUserSession.refreshToken.token) {
            await signout();
            window.location.reload();
            return;
        }
      }
    }

    render() {
        if (this.props.authState == "signedIn") {
            return(
                <LandingPageLayout {...this.props} />
            );
        }
        return null;
    }   
}

export class LandingPageWithAuth extends React.Component {
    constructor(props, context) {
      super(props, context);
    }
  
    render() {
      return (
        // <div style={{backgroundColor:'#000', height: '100%'}}>
          <Authenticator hide={[SignIn , Greetings]}>
            <CustomSignInUser />
            <CustomGreetings />
            <LandingAuthPageContainer {...this.props} />
          </Authenticator>
        // </div>
      );
    }
  }