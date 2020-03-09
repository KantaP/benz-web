import React from 'react';
import AdminPageLayout from '../../components/Layout/AdminPage';
import { Authenticator } from 'aws-amplify-react/dist/Auth';
import { SignIn  , Greetings } from 'aws-amplify-react';
import { CustomSignIn } from './CustomSignIn';
import { CustomGreetings } from './CustomGreetings';

class AdminPageLayoutContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    
    componentWillReceiveProps(newProps) {
      if(newProps.authData) {
        if(!newProps.authData.signInUserSession.accessToken.payload['cognito:groups'].includes('Admins')) {
            alert('This session for admin only');
            window.history.back();
            return;
        }
      }
    }

    render() {
      
        
        if (this.props.authState == "signedIn") {
            return (<AdminPageLayout {...this.props} />);
        }
        return null;
    }
}

export class AdminPageWithAuth extends React.Component {
    constructor(props, context) {
      super(props, context);
    }
  
    render() {
      return (
        <div>
          <Authenticator hide={[SignIn , Greetings]}>
            <CustomSignIn />
            <CustomGreetings />
            <AdminPageLayoutContainer {...this.props} />
          </Authenticator>
        </div>
      );
    }
  }