import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import { LandingPageLayoutContainer , LandingPageWithAuth } from '../../ui/containers/Layout/LandingPage';
import { AdminPageWithAuth } from '../../ui/containers/Layout/AdminPage';
import { RegisterContainer , ThankyouSignUpContainer } from '../../ui/containers/Register';
import { HomeContainer } from '../../ui/containers/Home';
import { BroadCastContainer } from '../../ui/containers/Admin/Broadcast';
import { LoginContainer } from '../../ui/containers/Login';
import { EventContainer } from '../../ui/containers/Admin/Event';
import { MemberContainer } from '../../ui/containers/Admin/Member';
import { ReportContainer } from '../../ui/containers/Admin/Report';
import { UserContainer } from '../../ui/containers/Admin/User';
import { ForgotPasswordContainer } from '../../ui/containers/ForgotPassword';
import { PaymentContainer } from '../../ui/containers/Payment';
import { SignInContainer } from '../../ui/containers/Admin/SignIn';
import { DownloadContainer } from '../../ui/containers/Download';
import { SignOutContainer } from '../../ui/containers/Admin/SignOut';
import { FeedbackContainer } from '../../ui/containers/Admin/Feedback';
import { CompanyContainer } from '../../ui/containers/Admin/Company';
import { PrivacyContainer } from '../../ui/containers/Privacy';

var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
    // console.log('running group triggers');
  }]
});

adminRoutes.route('/', {
  name: 'SignIn',
  action(){
    mount( AdminPageWithAuth, {
      content: <SignInContainer />
    })
  }
})

adminRoutes.route('/post', {
  name: 'Broadcast',
  action(){
    mount( AdminPageWithAuth, {
      content: <BroadCastContainer />
    })
  }
})

adminRoutes.route('/event', {
  name: 'Event',
  action(){
    mount( AdminPageWithAuth, {
      content: <EventContainer />
    })
  }
})

adminRoutes.route('/member', {
  name: 'Member',
  action(){
    mount( AdminPageWithAuth, {
      content: <MemberContainer />
    })
  }
})

adminRoutes.route('/company', {
  name: 'Company',
  action(){
    mount( AdminPageWithAuth, {
      content: <CompanyContainer />
    })
  }
})

adminRoutes.route('/report', {
  name: 'Report',
  action(){
    mount( AdminPageWithAuth, {
      content: <ReportContainer />
    })
  }
})

adminRoutes.route('/feedback', {
  name: 'Feedback',
  action(){
    mount( AdminPageWithAuth, {
      content: <FeedbackContainer />
    })
  }
})

adminRoutes.route('/user', {
  name: 'User',
  action(){
    mount( AdminPageWithAuth, {
      content: <UserContainer />
    })
  }
})

adminRoutes.route('/signout', {
  name: 'SignOut',
  action(){
    mount( AdminPageWithAuth, {
      content: <SignOutContainer />
    })
  }
})


FlowRouter.route('/signup', {
  name: 'Register',
  action(){
    mount( LandingPageLayoutContainer, {
      content: <RegisterContainer />
    })
  },
})

FlowRouter.route('/signup/thankyou' , {
  name: 'RegisterThankyou',
  action() {
    mount( LandingPageLayoutContainer , {
      content: <ThankyouSignUpContainer />
    })
  }
})

FlowRouter.route('/forgotpassword' , {
  name: 'ForgotPassword',
  action() {
    mount( LandingPageLayoutContainer , {
      content: <ForgotPasswordContainer />
    })
  }
})

FlowRouter.route('/payment' , {
  name: 'Payment',
  action(params, queryParams) {
    mount( LandingPageWithAuth , {
      content: <PaymentContainer params={params} queryParams={queryParams} />
    })
  }
})

FlowRouter.route('/download' , {
  name: 'Download',
  action() {
    mount( LandingPageLayoutContainer, {
      content: <DownloadContainer />
    })
  }
})

FlowRouter.route('/privacy-policy' , {
  name: 'Privacy',
  action() {
    mount( LandingPageLayoutContainer, {
      content: <PrivacyContainer />
    })
  }
})