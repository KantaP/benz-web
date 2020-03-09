import React from 'react';
import '../styles.css';
import {
    Row ,
    Input ,
    Form ,
    FormGroup ,
    Label ,
    Col,
    FormText ,
    Button ,
} from 'reactstrap';
import { Table } from '../../Table';
import { LocationSearchInput } from '../../LocationSearchInput';
import Modal from 'react-modal';
import LoadingOverlay from 'react-loading-overlay';
import { CSVLink } from "react-csv";
import _ from 'lodash';
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      minWidth              : '510px',
      maxWidth              : '510px'
    }
  };

const customStylesForm = {
    maxHeight: '300px',
    overflow: 'scroll',
    marginTop : 10
}

export const UserScreen = (
    {
        state,
        onCreateUser,
        handleChange
    }) => (
    <LoadingOverlay
        active={state.loading}
        spinner
        FormText={state.loadingContent}
    >
        {/* Top Bar */}
        <Row className="mr-0 ml-0 p-3" style={{justifyContent:'space-between' , backgroundColor:'#000'}}>
            {/* Header */}
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }} >
                <i className="far fa-edit" style={{color:'#b21e23'}}></i>
                <div style={{color:'#fff' , marginLeft: 10}}>Create User</div>
            </Row>
        </Row>
        {/* End Top Bar */}
        {/* Content */}
        <div style={{display:'flex' , justifyContent:'center' , width: '100%'}}>
            <Col style={{paddingLeft:40,paddingRight:40}}>
            <Form className="pr-5 pl-5 mt-5">
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>Email</Label>
                    <Col sm={9}>
                        <Input type="email" name="email" id="email" 
                        value={state.email}
                        onChange={(e)=>{
                            handleChange('email' , e.target.value);
                        }} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>Password</Label>
                    <Col sm={9}>
                        <Input type="password" name="password" id="password" 
                        value={state.password}
                        onChange={(e)=>{
                            handleChange('password' , e.target.value);
                        }} 
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>Staff ID</Label>
                    <Col sm={9}>
                        <Input type="text" name="staffId" id="staffId" 
                        value={state.staffID}
                        onChange={(e)=>{
                            handleChange('staffID' , e.target.value);
                        }} 
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>First Name</Label>
                    <Col sm={9}>
                        <Input type="text" name="firstName" id="firstName" 
                        value={state.firstName}
                        onChange={(e)=>{
                            handleChange('firstName' , e.target.value);
                        }} 
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>Last Name</Label>
                    <Col sm={0}>
                        <Input type="text" name="lastName" id="lastName" 
                        value={state.lastName}
                        onChange={(e)=>{
                            handleChange('lastName' , e.target.value);
                        }} 
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className="customLabel"  sm={3}>Mobile Phone</Label>
                    <Col sm={9}>
                        <Input type="text" name="phone" id="phone" 
                        value={state.mobilePhone}
                        onChange={(e)=>{
                            handleChange('mobilePhone' , e.target.value);
                        }} 
                        />
                    </Col>
                </FormGroup>
                <FormGroup row className="mr-0 ml-0 mt-5" style={{justifyContent:'center'}}>
                    <Button 
                    onClick={()=>{
                        onCreateUser();
                    }}
                    style={{
                        backgroundColor:'#CF1F25',
                        padding: 5,
                        color:'#fff', 
                        fontSize:14,
                        border:0,
                        width: 250
                    }}>
                        Create
                    </Button>
                </FormGroup>
            </Form>
            </Col>
        </div>
        {/* End Content */}
    </LoadingOverlay>
)