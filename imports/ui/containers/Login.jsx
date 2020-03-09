import React from 'react';
import LoginPage from '../components/Login';

import { stateChange } from '../utils';
import { signin  , currentSession} from '../../api/aws/cognito';

export class LoginContainer extends React.Component {

    render()  {
        return ( <LoginPage /> );
    }
}