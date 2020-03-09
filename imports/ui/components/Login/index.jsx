import React from 'react';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const LoginPage = ({stateChange , onSignIn}) => (
    <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input 
          type="email" 
          name="email" 
          id="userEmail" 
          placeholder="Email" 
          onChange={(e)=>{
            stateChange('email' , e.target.value);
          }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Password</Label>
          <Input 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Password" 
          onChange={(e)=>{
            stateChange('password' , e.target.value);
          }}
          />
        </FormGroup>
        <FormGroup>
            <Button
                onClick={()=>{
                  if(onSignIn) {
                    onSignIn();
                  }  
                }}
            >Submit</Button>
        </FormGroup>
    </Form>
)

export default LoginPage;