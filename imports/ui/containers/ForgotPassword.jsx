import React from 'react';
import Amplify , { Auth } from 'aws-amplify';
import {ForgotPasswordPage} from '../components/ForgotPassword';
export class ForgotPasswordContainer extends React.Component {

    state = {
        loading: false ,
        submit: false,
        email: '',
        forgotSend: false,
        verifyCode: '',
        newPassword: '',
        confirmPassword: ''
    }

    onForgotPassword = async() => {
        try {
            if(!this.state.email) {
                alert('Please input email');
                return;
            }
            await this.setState({loading: true});
            await Auth.forgotPassword(this.state.email)
            alert('Please check your email.');
            await this.setState({loading: false , forgotSend: true});
        }catch(error) {
            await this.setState({loading: false , forgotSend: false});
            alert(error.message)
        }
    }

    onResetPassword = async() => {
        try {
            await this.setState({ submit: true});
            if(this.state.newPassword !== this.state.confirmPassword) {
                alert('New password and confirm password should same')
                return;
            }
            await this.setState({loading: true});
            // Collect confirmation code and new password, then
            await Auth.forgotPasswordSubmit(this.state.email, this.state.verifyCode, this.state.newPassword);
            await this.setState({loading: false , submit: false , forgotSend: false});
        }catch(error) {
            await this.setState({loading: false});
            alert(error.message)
        }
    }

    render() {
        return <ForgotPasswordPage {...this.props} state={this.state} onResetPassword={this.onResetPassword} onForgotPassword={this.onForgotPassword} />;
    }
}

