import React from 'react';
import { ReportScreen } from '../../components/Admin/Report';
import { listReports , getReport  } from '../../graphql/queries';
import { deleteReport , updateReport } from '../../graphql/mutations';
import { API , graphqlOperation } from 'aws-amplify';
import moment from 'moment-timezone';
import { ActionCell } from '../../components/ActionCell';
import { StatusDropDown } from '../../components/StatusDropDrown';
import { isNull , getProperty } from '../../utils';

export class ReportContainer extends React.Component {

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
        type: '' ,
        description: '',
        from : {},
        id: '',
        status: '',
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
            label:'Created At',
            accessor: 'createdAt',
        },
        {
            label:'Type',
            accessor: 'type',

        },
        {
            label:'Detail',
            accessor: 'description',
        },
        {
            label:'From',
            accessor: 'reporter',
        },
    ]
    
    
    componentDidMount() {        
        this.onList();
        this.setState({
            columns: [
                {
                    Header: 'Created At',
                    accessor: 'createdAt',
                    minWidth: 130,
                    Cell: row => {
                        return moment(row.value).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
                    }
                },
                {
                    Header: 'Type',
                    accessor: 'type',
                },
                {
                    Header: 'Detail',
                    accessor: 'description',
                    minWidth: 130,
                    Cell: row => {
                        return (
                            <div className="text_overflow">
                                {row.value}
                            </div>
                        )
                    }
                },
                {
                    Header:'From',
                    accessor: 'reporter.firstName',
                },
                {
                    Header:'Status',
                    accessor: 'statusParams',
                    minWidth: 130,
                    Cell:row => {
                        return (
                            <StatusDropDown
                                statusParams={row.value}
                                onChange={this.onChangeStatus}
                            />
                        )
                    }
                },
                {
                    Header: 'Actions',
                    accessor: 'id',
                    minWidth: 120, 
                    Cell: row => {
                        return (
                            <ActionCell 
                                onView={this.onView}
                                // onEdit={this.onShowEdit}
                                onDelete={this.onDelete}
                                id={row.value}
                            />
                        )
                    }
                    
                }
            ]
        })
        
    }

    onClearFormValue = () => {
        this.setState({
            createdAt: '',
            type: '' ,
            description: '',
            from : {},
            id: '',
        })
    }

    openModal = () => {
        this.setState({modalIsOpen: true , modalMode:'create'});
    }

    afterOpenModal = () => {
        
    }

    closeModal = () => {
        this.onClearFormValue();
        this.setState({modalIsOpen: false , modalEditIsOpen: false , modalViewIsOpen: false});
    }

    handleChange = (key , value) =>{
        this.setState(state=>{
            state[key] = value;
            // console.log(state);
            return state;
        })
    }

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
            let fetchData = await API.graphql(graphqlOperation(listReports,variable))
            let items = [...fetchData.data.listReports.items];
            items.forEach((item)=>{
                item.statusParams = {
                    id: item.id,
                    status: item.status
                }
            })
            results = [...recurrResults , ...items];
            if(fetchData.data.listReports.nextToken) {
                this.state.nextToken = fetchData.data.listReports.nextToken;
                return this._recurOnList(limit , results);
            } else {
                return results;
            } 
        }catch(error) {
            throw new Error(error);
        }
        
    }

    // onUploadImage(file) {
    //     return new Promise((resolve ,reject) => {
    //         const options = {
    //             ACL: 'public-read',
    //             level: "public",
    //             contentType: file.type
    //         };
    //         Storage.put(file.name , file , options)
    //         .then (result => {
    //             // console.log(result)
    //             console.log('add image');
    //             // add Image
    //             let params = {
    //                 uri: `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
    //             }
    //             resolve(params);
    //         })
    //         .catch(err => reject(err));
    //     })  
        
    // }

    // onCreate = async() => {
    //     try {
    //         await this.setState({loading: true , loadingContent: 'Creating Event...'});
    //         let requiredFields = this.getRequiredFields(this.state.postType);
    //         for(let key of requiredFields) {
    //             if(!this.state[key]) {
    //                 console.log(key,this.state[key]);
    //                 alert('Please input all required fields');
    //                 await this.setState({loading: false});
    //                 return false;
    //             }
    //         }
    //         let user = await Auth.currentAuthenticatedUser();
    //         // console.log(user);
    //         let variable = {
    //             title: this.state.title,
    //             startTime: `${this.state.startTime}`,
    //             endTime: `${this.state.endTime}`,
    //             startTimeUnix: moment(`${this.state.startTime}`).format('x'),
    //             endTimeUnix: moment(`${this.state.endTime}`).format('x'),
    //             description: this.state.description,
    //             quota: this.state.quata,
    //             createdAt: moment().format(),
    //             eventUserId: user.username
    //         }
    //         if(this.state.photo){
    //             let uploadParams = await this.onUploadImage(this.state.photo);
    //             variable.image = uploadParams.uri;
    //         }
    //         if(this.state.address && this.state.latlng) {
    //             variable.location = {
    //                 placeName: this.state.address,
    //                 placeLatLng: `${this.state.latlng.lat},${this.state.latlng.lng}`
    //             }
    //         } 
    //         let newVariable = Object.keys(variable).reduce((object, key) => {
    //             if (variable[key]) {
    //               object[key] = variable[key];
    //             }
    //             return object
    //         }, {});
            
    //         let result = await API.graphql(graphqlOperation(createEvent,{input:newVariable}));
    //         await this.setState({loading: false});
    //         this.onList();
    //         this.closeModal();
    //     }catch(error) {
    //         console.log(error);
    //         await this.setState({loading: false});
    //         alert(error.message);
    //     }
    // }

    // onShowQuata = () => {
        
    // }

    onView = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getReport, {id: id}));

            this.setState({
                createdAt: result.data.getReport.createdAt,
                type: result.data.getReport.type ,
                description: result.data.getReport.description,
                from : result.data.getReport.reporter,
                id: result.data.getReport.id,
                status: result.data.getReport.status,
                modalMode:'view',
                modalIsOpen: true
            })
        }catch(error) { 
            console.log(error);
        }
    }

    // onShowEdit = async(id) => {
    //     try {
            
    //         let result = await API.graphql(graphqlOperation(getEvent, {id: id}));
    //         let address = (result.data.getEvent.location && result.data.getEvent.location !== null) 
    //                         ? result.data.getEvent.location.placeName
    //                         : '';
    //         let latlng = (result.data.getEvent.location && result.data.getEvent.location !== null) 
    //                         ?result.data.getEvent.location.placeLatLng
    //                         : ''
    //         this.setState({
    //             address: address,
    //             latlng: latlng,
    //             title: result.data.getEvent.title,
    //             description: result.data.getEvent.description,
    //             photoUrl: result.data.getEvent.image,
    //             photo: null ,
    //             quata: result.data.getEvent.radeemQuota,
    //             modalIsOpen: true,
    //             modalMode: 'edit',
    //             startTime: result.data.getEvent.startTime,
    //             endTime: result.data.getEvent.endTime,
    //             id: id
    //         })
    //     }catch(error) { 
    //         console.log(error);
    //     }
    // }

    // onEdit = async() => {
    //     try {
    //         await this.setState({loading: true , loadingContent: 'Creating Event...'});
    //         let requiredFields = this.getRequiredFields(this.state.postType);
    //         for(let key of requiredFields) {
    //             if(!this.state[key]) {
    //                 console.log(key,this.state[key]);
    //                 alert('Please input all required fields');
    //                 await this.setState({loading: false});
    //                 return false;
    //             }
    //         }
    //         // console.log(user);
    //         let variable = {
    //             title: this.state.title,
    //             startTime: `${this.state.startTime}`,
    //             endTime: `${this.state.endTime}`,
    //             startTimeUnix: moment(`${this.state.startTime}`).format('x'),
    //             endTimeUnix: moment(`${this.state.endTime}`).format('x'),
    //             description: this.state.description,
    //             quota: this.state.quata,
    //             createdAt: moment().format(),
    //             id: this.state.id
    //         }
    //         if(this.state.photo){
    //             let uploadParams = await this.onUploadImage(this.state.photo);
    //             variable.image = uploadParams.uri;
    //         }
    //         if(this.state.address && this.state.latlng) {
    //             variable.location = {
    //                 placeName: this.state.address,
    //                 placeLatLng: `${this.state.latlng.lat},${this.state.latlng.lng}`
    //             }
    //         } 
    //         let newVariable = Object.keys(variable).reduce((object, key) => {
    //             if (variable[key]) {
    //               object[key] = variable[key];
    //             }
    //             return object
    //         }, {});
            
    //         let result = await API.graphql(graphqlOperation(updateEvent,{input:newVariable}));
    //         await this.setState({loading: false});
    //         this.onList();
    //         this.closeModal();
    //     }catch(error) {
    //         console.log(error);
    //         await this.setState({loading: false});
    //         alert(error.message);
    //     }
    // }

    onDelete = async(id) => {
        try {
            if(confirm('Are you sure to remove this report?')) {
                await this.setState({loading: true , loadingContent: 'Deleting report...'});
                let variable = {
                    id
                }
                let result = await API.graphql(graphqlOperation(deleteReport,{input: variable}));
                this.onList();
                await this.setState({loading: false});
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

    onChangeStatus = async(id , status) => {
        try {
            await this.setState({loading: true , loadingContent: 'Updating Status...'});
            let variable = {
                id,
                status
            }
            let result = await API.graphql(graphqlOperation(updateReport,{input: variable}));
            this.onList();
            await this.setState({loading: false});
        }catch(error) {

        }
    }

    render() {
        return <ReportScreen
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