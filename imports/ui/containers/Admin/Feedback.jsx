import React from 'react';
import { FeedbackScreen } from '../../components/Admin/Feedback';
import { listFeedbacks , getFeedback  } from '../../graphql/queries';
import { API , graphqlOperation } from 'aws-amplify';
import moment from 'moment-timezone';
import { ActionCell } from '../../components/ActionCell';
import { StatusDropDown } from '../../components/StatusDropDrown';
import { isNull , getProperty } from '../../utils';

export class FeedbackContainer extends React.Component {

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
        topic: '' ,
        message: '',
        from : {},
        id: '',
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
            label:'Topic',
            accessor: 'topic',

        },
        {
            label:'Message',
            accessor: 'message',
        },
        {
            label:'From',
            accessor: 'user',
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
                    Header: 'Topic',
                    accessor: 'topic',
                },
                {
                    Header: 'Message',
                    accessor: 'message',
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
                    accessor: 'user.firstName',
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
                                // onDelete={this.onDelete}
                                id={row.value}
                            />
                        )
                    }
                    
                }
            ]
        })
        
    }

    onClearFormValue = () => {
        
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

    // handleChange = (key , value) =>{
    //     this.setState(state=>{
    //         state[key] = value;
    //         // console.log(state);
    //         return state;
    //     })
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
            let fetchData = await API.graphql(graphqlOperation(listFeedbacks,variable))
            let items = [...fetchData.data.listFeedbacks.items];
            results = [...recurrResults , ...items];
            if(fetchData.data.listFeedbacks.nextToken) {
                this.state.nextToken = fetchData.data.listFeedbacks.nextToken;
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
            
            let result = await API.graphql(graphqlOperation(getFeedback, {id: id}));

            this.setState({
                createdAt: result.data.getFeedback.createdAt,
                topic: result.data.getFeedback.topic ,
                message: result.data.getFeedback.message,
                from : result.data.getFeedback.user,
                id: result.data.getFeedback.id,
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

    // onDelete = async(id) => {
    //     try {
    //         if(confirm('Are you sure to remove this report?')) {
    //             await this.setState({loading: true , loadingContent: 'Deleting report...'});
    //             let variable = {
    //                 id
    //             }
    //             let result = await API.graphql(graphqlOperation(deleteReport,{input: variable}));
    //             this.onList();
    //             await this.setState({loading: false});
    //         }
    //     }catch(error){
    //         console.log(error);
    //         await this.setState({loading: false});
    //         alert(error.message);
    //     }
    // }

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

    // onChangeStatus = async(id , status) => {
    //     try {
    //         await this.setState({loading: true , loadingContent: 'Updating Status...'});
    //         let variable = {
    //             id,
    //             status
    //         }
    //         let result = await API.graphql(graphqlOperation(updateReport,{input: variable}));
    //         this.onList();
    //         await this.setState({loading: false});
    //     }catch(error) {

    //     }
    // }

    render() {
        return <FeedbackScreen
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