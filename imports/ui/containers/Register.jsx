import React from 'react';
import RegisterPage , { ThankyouPage } from '../components/Register';


export class RegisterContainer extends React.Component {
    render()  {
        return ( <RegisterPage /> );
    }
}

export class ThankyouSignUpContainer extends React.Component {
    render() {
        return (<ThankyouPage />)
    }
}