import React from 'react';
import { createUser } from '../../graphql/mutations';
import { signup } from '../../../api/aws/cognito';
import { API , graphqlOperation , Auth } from 'aws-amplify';
import { UserScreen } from '../../components/Admin/User'

import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import config from '../../../api/aws/config';

export class UserContainer extends React.Component {

    state = {
        email: '',
        password: '',
        staffID: '',
        firstName: '',
        lastName: '',
        mobilePhone: '',
        loading: false ,
        loadingContent: ''
    }

    clearForm = () => {
        this.setState({
            email: '',
            password: '',
            staffID: '',
            firstName: '',
            lastName: '',
            mobilePhone: '',
        })
    }

    handleChange = (key , value) =>{
        this.setState(state=>{
            state[key] = value;
            // console.log(state);
            return state;
        })
    }

    setToAdmin = (username) => {
        const credentials = {
            accessKeyId: 'AKIATPT3KBUTFHLOQ6HF',
            secretAccessKey: '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',
            region: 'ap-southeast-1',
            apiVersion: '2016-04-18',
        };
        Promise.resolve(
            new CognitoIdentityServiceProvider(credentials)
        )
        .then(client =>
            client.adminAddUserToGroup({
                GroupName: "Admins",
                UserPoolId: config.aws_user_pools_id,
                Username: username
            })
            .promise()
            .then((result)=>{
                alert('Add Permission admin success.');
            })
            .catch((error)=>{
                alert('Something went wrong')
            })
        )
    }


    onCreateUser = async() => {
        try {
            await this.setState({loading: true , loadingContent: 'Creating User...'});
            let requiredFields = this.getRequiredFields();
           
            for(let field of requiredFields) {
                if(!this.state[field]) {
                    console.log(field);
                    await this.setState({loading: false , loadingContent: ''});
                    return;
                } 
            }
            const { loading , loadingContent  , password , ...userItem } = this.state;
            const user = await signup({
                email: userItem.email,
                name: userItem.firstName,
                family_name: userItem.lastName,
                password: password,
                birthdate: '1970-01-01'
            });
            // add user profile
            if(user) {
                let addUserItem = Object.assign({} , userItem, {
                    id: user.userSub ,
                    level: 'admin'
                })
                let newAddUserItem = Object.keys(addUserItem).reduce((object, key) => {
                    if (addUserItem[key]) {
                      object[key] = addUserItem[key];
                    }
                    return object
                }, {});
    
                // console.log(newAddUserItem);
                const userProfile = await API.graphql(graphqlOperation(createUser,{input: newAddUserItem}));
                this.setToAdmin(userItem.email)
                this.clearForm();
                alert('Create user success.');
            } else {
                alert('Something went wrong');
            }
            await this.setState({loading: false});
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }
    
    getRequiredFields = () => {
        let requiredFields = [
            'email' ,
            'password' ,
            'staffID' ,
            'firstName' ,
            'lastName' ,
            'mobilePhone'
        ]
        return requiredFields;
    }

    render() {
        return <UserScreen 
                state={this.state} 
                onCreateUser={this.onCreateUser} 
                handleChange={this.handleChange} 
                />;
    }
}