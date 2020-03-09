import { Meteor } from 'meteor/meteor';

import { Email } from 'meteor/email';
import { check } from 'meteor/check';


Meteor.startup(() => {
  // console.log('start server side')
  process.env.MAIL_URL = 'smtp://i3gateway_tester:@1q2w3e4r5D@smtp.sendgrid.net:587';
  Meteor.methods({
    sendEmail(to, from, subject, text , html) {
      // Make sure that all arguments are strings.
      check([to, from, subject, text , html], [String]);
  
      // Let other method calls from the same client start running, without
      // waiting for the email sending to complete.
      this.unblock();
  
      Email.send({ to, from, subject, text , html });
    }
  });
});
