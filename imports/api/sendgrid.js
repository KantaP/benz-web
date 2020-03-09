const API_KEY = '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';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(API_KEY);


export default sgMail