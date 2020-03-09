import React from 'react';
import { MemberScreen } from '../../components/Admin/Member';
import { listUsers , getUser  } from '../../graphql/queries';
import { updateUser } from '../../graphql/mutations';
import { API , graphqlOperation } from 'aws-amplify';
import moment from 'moment-timezone';
import { Auth } from 'aws-amplify';
import { ActionCell } from '../../components/ActionCell';
import { isNull , getProperty } from '../../utils';

import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import config from '../../../api/aws/config';

const welcomeHtml = require('../../../api/template/welcome');
const bypassHtml = require('../../../api/template/bypass');

export class MemberContainer extends React.Component {

    state  = {
        modalIsOpen: false,
        modalMode: '',
        loading: false,
        data: [],
        nextToken: '',
        count: 0,
        columns: [], 
        loadingContent: '',
        // modal form
        
        // download data
        dataToDownload: [],
        // search
        search: '',
        searchIn: 'firstName',
        // refresh: false
    }

    // requiredFields = [
    //     'title' ,
    //     'startTime',
    //     'endtime',
    //     'address',
    // ]

    reactTable = React.createRef();
    csvLink = React.createRef();
    
    timer = null;

    csvFields = [
        {
            label: 'ID',
            accessor: 'id',
        },
        {
            label:'First Name',
            accessor: 'firstName',
        },
        {
            label:'Last Name',
            accessor: 'lastName',
        },
        {
            label:'Address',
            accessor: 'address',
        },
        {
            label:'District',
            accessor: 'district',
        },
        {
            label:'Province',
            accessor: 'province',
        },
        {
            label:'Birth Date',
            accessor: 'birthDate',
        },
        {
            label:'Mobile Phone',
            accessor: 'mobilePhone',
        },
        {
            label:'Email',
            accessor: 'email',
        }
    ]
    
    
    componentDidMount() {        
        this.onList(true);
        this.setState({
            columns: [
                {
                    Header: 'First Name',
                    accessor: 'firstName',
                },
                {
                    Header: 'Last Name',
                    accessor: 'lastName',
                },
                {
                    Header:'Email',
                    accessor: 'email',
                },
                // {
                //     Header:'Active',
                //     accessor: 'active',
                //     Cell: row => {
                //         console.log(value)
                //         if(row.value) {
                //             return (<p>Active</p>)
                //         }
                //         return (
                //             <p>Un-active</p>
                //         )
                //     }
                // },
                {
                    Header: 'Actions',
                    id: 'member',
                    accessor: (row) => row ,
                    minWidth: 120, 
                    Cell: row => {
                        return (
                            <ActionCell 
                                onView={this.onView}
                                onActiveMail={this.sendPaymentEmail}
                                onSetToAdmin={()=>{
                                    this.setToAdmin(row.value.username)
                                }}
                                onToggleActive={this.toggleActiveAccount}
                                // onEdit={this.onShowEditPost}
                                // onDelete={this.onDeletePost}
                                id={row.value.id}
                            />
                        )
                    }
                    
                }
            ]
        })
         
    }

    openModal = () => {
        this.setState({modalIsOpen: true , modalMode:'create'});
    }

    afterOpenModal = () => {
        
    }

    closeModal = () => {
        this.setState({modalIsOpen: false , modalEditIsOpen: false , modalViewIsOpen: false});
    }

    handleChange = (key , value) =>{
        this.setState(state=>{
            state[key] = value;
            // console.log(state);
            return state;
        })
    }

    fileChange = (event) => {
        let file_size = event.target.files[0].size;
        if(file_size > 2097152) {
            alert('This file has size over 2MB');
            event.preventDefault();
            return;
        }
        this.handleChange('photo' , event.target.files[0]);
    }

    onList = async() => {
        try {
            let results = await this._recurOnList(100);
            this.setState({
                data: results,
                count: results.length
            })
        }catch(error) {
            console.log(error);
        }
    }

    _recurOnList = async(limit = 1000 , recurrResults = []) => {
        let results = [];
        let variable = (this.state.nextToken) 
                    ? {
                        nextToken: this.state.nextToken
                    }
                    : {
                        filter: {
                            level: {
                                eq: 'user'
                            }
                        },
                        limit: limit
                    }
        try {
            let fetchData = await API.graphql(graphqlOperation(listUsers,variable))
            results = [...recurrResults , ...fetchData.data.listUsers.items];
            if(fetchData.data.listUsers.nextToken) {
                this.state.nextToken = fetchData.data.listUsers.nextToken;
                return this._recurOnList(limit , results);
            } else {
                return results;
            } 
        }catch(error) {
            throw new Error(error);
        }
    }

    onCreate = async() => {
        try {
        
            this.closeModal();
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onShowQuata = () => {
        
    }

    onView = async(id) => {
        try {

            let result = await API.graphql(graphqlOperation(getUser, {id: id}));
            const { data } = result;
            this.setState({
                firstName: data.getUser.firstName,
                lastName: data.getUser.lastName,
                email: data.getUser.email,
                mobilePhone: data.getUser.mobilePhone,
                amgId: data.getUser.amgId,
                amgModel: data.getUser.amgModel,
                amgShowroom: data.getUser.amgShowroom,
                address: data.getUser.address,
                district: data.getUser.district,
                province: data.getUser.province ,
                active: data.getUser.active,
                birthDate: data.getUser.birthDate,
                modalIsOpen: true,
                modalMode: 'view'
            })
        }catch(error) { 
            console.log(error);
        }
    }

    onShowEdit = async(id) => {
        try {
            
        }catch(error) { 
            console.log(error);
        }
    }

    onEdit = async() => {
        try {
            this.closeModal();
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onDelete = async(id) => {
        try {
            if(confirm('Are you sure to remove this event?')) {
                
            }
        }catch(error){
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onExportCSV = (event) => {
        // convert all field to string
        const _data = [...this.state.data];
        let download_data = _data.map((item)=>{
            let newItem = {};
            console.log(item);    
            this.csvFields.forEach((csvItem)=>{
                let propertyValue = getProperty(csvItem.accessor , item);
                newItem[csvItem.label] = propertyValue;
            });
            return newItem;
        })
        this.setState({dataToDownload: download_data} , ()=>{
            this.csvLink.current.link.click();
        })      
    }

    onActive = (id) => {
        
    }

    sendPaymentEmail = async(id) => {
        if(confirm('Do you want to send welcome email to this user?')) {
            try {
                let result = await API.graphql(graphqlOperation(getUser, {id: id}));
                const { data } = result;
                if(data.getUser.active) {
                    Meteor.call(
                        'sendEmail',
                        data.getUser.email,
                        'no-reply@amgclubthailand.com',
                        'Welcome to AMG Club Thailand',
                        '',
                        bypassHtml()
                    );
                }else {
                    Meteor.call(
                        'sendEmail',
                        data.getUser.email,
                        'no-reply@amgclubthailand.com',
                        'Welcome to AMG Club Thailand',
                        '',
                        welcomeHtml()
                    );
                }
                
                // let variables = {
                //     input: {id: id , active: true}
                // }
                // let updateData = await API.graphql(graphqlOperation(updateUser, variables));
                alert('Send success.')
            }catch(error) { 
                console.log(error);
            }
        }
        
    }

    toggleActiveAccount = async(id) => {
        try {
            let userData = await API.graphql(graphqlOperation(getUser, {id: id}));
            let active = !userData.data.getUser.active;
            let variables = {
                input: {id: id , active: active}
            }
            let updateData = await API.graphql(graphqlOperation(updateUser, variables));
            if(!active) {
                alert('Un-active success.');
            } else {
                alert('Active success.');
            }
        }catch(error) {
            throw new Error(error.message);
        }
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
            client.adminListGroupsForUser({
                UserPoolId: config.aws_user_pools_id,
                Username: username
            })
            .promise()
            .then((result)=>{
                if(result.Groups.findIndex((item)=>item.GroupName === 'Admins') === -1) {
                    client.adminAddUserToGroup({
                        GroupName: "Admins",
                        UserPoolId: config.aws_user_pools_id,
                        Username: username
                    })
                    .promise()
                    .then((result)=>{
                        alert('Add permission admin success.');
                    })
                    .catch((error)=>{
                        alert('Something went wrong')
                    })
                } else {
                    client.adminRemoveUserFromGroup({
                        GroupName: "Admins",
                        UserPoolId: config.aws_user_pools_id,
                        Username: username
                    })
                    .promise()
                    .then((result)=>{
                        alert('Remove permission admin success.');
                    })
                    .catch((error)=>{
                        alert('Something went wrong')
                    })
                }
            })
            
        )
    }

    

    render() {
        return <MemberScreen
            {...this.props}
            columns={this.state.columns}
            data={this.state.data}
            onOpenModal={this.openModal}
            onCloseModal={this.closeModal}
            onHandleChange={this.handleChange}
            onFileChange={this.fileChange}
            state={this.state}
            onCreate={this.onCreate}
            onEdit={this.onEdit}
            refReactTable={this.reactTable}
            refCsvLink={this.csvLink}
            onExportCSV={this.onExportCSV}
        />;
    }
}