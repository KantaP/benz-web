module.exports = {
  app: {
    // TODO: change app name and path
    type: 'aws-beanstalk',
    name: 'amgclubthailand',
    path: '../',
    // servers: {
    //   one: {},
    // },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://amgclubthailand.com',
      // MONGO_URL: 'mongodb://mongodb/meteor',
      // MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    // enableUploadProgressBar: true,

    // (required) Minimum number of servers running your app
    minInstances: 2,
    // (optional, default is minInstances) Maximum number of servers
    // for autoscale to scale up to
    maxInstances: 5,

    auth: {
      // IAM user's Access key ID
      id: 'AKIATPT3KBUTFHLOQ6HF',
      // IAM user's Secret access key
      secret: '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'
    },

    // (optional, default is t2.micro) Type of instance to use
    instanceType: 't2.micro',
    // (optional, default is us-east-1) AWS region to deploy to
    region: 'ap-southeast-1',
  },
  plugins: ['mup-aws-beanstalk']

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
