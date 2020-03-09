import React from 'react';
import { Auth } from 'aws-amplify';
export class SignOutContainer extends React.Component {

    componentDidMount() {
        Auth.signOut();
        window.location.href = '/admin';
    }

    render() {
        return null;
    }
}