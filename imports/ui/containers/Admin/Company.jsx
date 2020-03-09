import React from 'react';
import { CompanyScreen } from '../../components/Admin/Company';
import { listCompanys , getCompany  } from '../../graphql/queries';
import { API , graphqlOperation } from 'aws-amplify';
// import moment from 'moment-timezone';
import { ActionCell } from '../../components/ActionCell';
// import { StatusDropDown } from '../../components/StatusDropDrown';
import {  getProperty } from '../../utils';

export class CompanyContainer extends React.Component {

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
        createdAt: '',
        name: '' ,
        description: '',
        phone : '',
        id: '',
        address: '',
        website: '',
        email: '',
        image: '',
        logo: '',
        // download data
        dataToDownload: [],
        // search
        search: '',
        searchIn: 'type'
    }

    reactTable = React.createRef();
    csvLink = React.createRef();
    
    timer = null;

    csvFields = [
        {
            label: 'ID',
            accessor: 'id',
        },
        {
            label:'Name',
            accessor: 'name',
        },
        {
            label:'Detail',
            accessor: 'description',
        },
        {
            label:'Phone',
            accessor: 'phone',
        },
        {
            label:'Email',
            accessor: 'email',
        },
        {
            label:'Address',
            accessor: 'address',
        },
        {
            label:'Website',
            accessor: 'website',
        },
    ]
    
    
    componentDidMount() {        
        this.onList();
        this.setState({
            columns: [
                {
                    Header: 'Logo',
                    accessor: 'logo',
                    minWidth: 120, 
                    Cell: row => {
                        if(row.value) {
                            return (
                                <img src={row.value} style={{width: 120}} />
                            )
                        }
                        return <p>No logo</p>
                    }
                },
                {
                    Header:'Name',
                    accessor: 'name',
                },
                {
                    Header:'Phone',
                    accessor: 'phone',
                },
                {
                    Header:'Email',
                    accessor: 'email',
                },
                {
                    Header: 'Actions',
                    accessor: 'id',
                    minWidth: 120, 
                    Cell: row => {
                        return (
                            <ActionCell 
                                onView={this.onView}
                                id={row.value}
                            />
                        )
                    }
                    
                }
            ]
        })
        
    }

    // onClearFormValue = () => {
    //     this.setState({
    //         createdAt: '',
    //         type: '' ,
    //         description: '',
    //         from : {},
    //         id: '',
    //     })
    // }

    openModal = () => {
        this.setState({modalIsOpen: true , modalMode:'create'});
    }

    // afterOpenModal = () => {
        
    // }

    closeModal = () => {
        this.onClearFormValue();
        this.setState({modalIsOpen: false , modalEditIsOpen: false , modalViewIsOpen: false});
    }

    // handleChange = (key , value) =>{
    //     this.setState(state=>{
    //         state[key] = value;
    //         // console.log(state);
    //         return state;
    //     })
    // }

    // getRequiredFields = () => {
    //     let requiredFields = [
    //         'title' ,
    //         'description' ,
    //         'startTime' ,
    //         'endTime' ,
    //         'address'
    //     ]

    //     return requiredFields; 
    // }

    // fileChange = (event) => {
    //     let file_size = event.target.files[0].size;
    //     if(file_size > 2097152) {
    //         alert('This file has size over 2MB');
    //         event.preventDefault();
    //         return;
    //     }
    //     this.handleChange('photo' , event.target.files[0]);
    // }

    onList = async() => {
        try {
            let results = await this._recurOnList(100);
            console.log(results);
            this.setState({
                data: results,
                count: results.length
            })
        }catch(error) {
            console.log(error);
        }
    }

    _recurOnList = async(limit = 100 , recurrResults = []) => {
        let results = [];
        let variable = (this.state.nextToken) 
                    ? {
                        nextToken: this.state.nextToken
                    }
                    : {
                        limit: limit
                    }
        try {
            let fetchData = await API.graphql(graphqlOperation(listCompanys,variable))
            let items = [...fetchData.data.listCompanys.items];
            results = [...recurrResults , ...items];
            if(fetchData.data.listCompanys.nextToken) {
                this.state.nextToken = fetchData.data.listCompanys.nextToken;
                return this._recurOnList(limit , results);
            } else {
                return results;
            } 
        }catch(error) {
            throw new Error(error);
        }
        
    }

    

    onView = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getCompany, {id: id}));

            this.setState({
                createdAt: result.data.getCompany.createdAt,
                name: result.data.getCompany.name ,
                description: result.data.getCompany.description,
                phone : result.data.getCompany.phone,
                id: result.data.getCompany.id,
                address: result.data.getCompany.address,
                website: result.data.getCompany.website,
                email: result.data.getCompany.email,
                image: result.data.getCompany.image,
                logo: result.data.getCompany.logo,
                modalMode:'view',
                modalIsOpen: true
            })
        }catch(error) { 
            console.log(error);
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



    render() {
        return <CompanyScreen
            {...this.props}
            columns={this.state.columns}
            data={this.state.data}
            onOpenModal={this.openModal}
            onCloseModal={this.closeModal}
            state={this.state}
            refReactTable={this.reactTable}
            refCsvLink={this.csvLink}
            onExportCSV={this.onExportCSV}
        />;
    }
}