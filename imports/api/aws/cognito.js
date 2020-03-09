import { Auth  , Api , graphqlOperation } from 'aws-amplify';

export const signIn = async({username , password}) => {
    try {
        const email = username;
        const user = await Auth.signIn(email, password);
        return user;
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
            alert('User need to confirm in email.');
            return false;
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
            alert('User need to reset password.');
            return false;
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
            alert('Username or password incorrect.');
            return false;
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
            alert('Not found username.');
            return false;
        } else {
            console.log(err);
            return false;
        }
    }
}

export const signout = () => {
    return Auth.signOut();
}

export const signup = async({email , password , birthdate , name , family_name }) => {
    try {
        const user = await Auth.signUp({
            username: email,
            password: password ,
            attributes: {
                email,
                birthdate,
                name,
                family_name
            }
        });
        return user;
    }catch(err) {
        // alert(err.code);
        return false;
    }
}

export const addUserProfile = async(userItem) => {
    try {
        const createUser = `mutation CreateUser($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }
          `;
        const userDetail = Object.assign({} , userItem , {
            type: 'User',
            active: 0
        });
        const newUser = await API.graphql(graphqlOperation(createUser, {input: userDetail}));
        return newUser;
    }catch(err) {
        alert(err.code);
        return false;
    }
}

// currently , use cognito trigger
// export const confirm = async({email , code}) => {
//     try {
//         const user = await Auth.confirmSignUp(email, code, {
//             // Optional. Force user confirmation irrespective of existing alias. By default set to True.
//             forceAliasCreation: true    
//         })
//         return user;
//     }catch(err) {
//         alert(err.code);
//         return false;
//     }
// }

export const currentSession = () => {
    return  Auth.currentAuthenticatedUser()
}