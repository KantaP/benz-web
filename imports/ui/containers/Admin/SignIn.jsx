import React from 'react';
import { SignInScreen } from '../../components/Admin/SignIn';
export class SignInContainer extends React.Component {

    componentDidMount() {
        window.location.replace('/admin/post')
    }

    render() {
        return <SignInScreen />;
    }
}