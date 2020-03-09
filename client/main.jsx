
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Amplify AWS
import Amplify from 'aws-amplify';
import aws_config from '../imports/api/aws/config';
Amplify.configure(aws_config);

// import gql from 'graphql-tag';
// import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
// import { ApolloProvider } from 'react-apollo';

// const client = new AWSAppSyncClient({
//     url: AppSync.aws_appsync_graphqlEndpoint,
//     region: AppSync.aws_appsync_region,
//     auth: {
//         type: AUTH_TYPE.API_KEY,
//         apiKey: aws_config.aws_appsync_apiKey,
//     }
// });



// Init App
import '../imports/startup/client';