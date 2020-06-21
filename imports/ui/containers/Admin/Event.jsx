import React from 'react';
import { EventScreen } from '../../components/Admin/Event';
import { listEvents , getEvent , getUserJoinedEvent  } from '../../graphql/queries';
import { createEvent , updateEvent , deleteEvent } from '../../graphql/mutations';
import { API , graphqlOperation , Auth , Storage } from 'aws-amplify';
import moment from 'moment-timezone';
import { ActionCell } from '../../components/ActionCell';
import { isNull , getProperty } from '../../utils';
import config from '../../../api/aws/config';

export class EventContainer extends React.Component {

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
        address: '',
        latlng: {lat: 13.75398,  lng: 100.50144},
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        startTimeUnix: '',
        endTimeUnix: '',
        photoUrl: '',
        photo: null ,
        quota: 0,
        id: '',
        // download data
        dataToDownload: [],
        // search
        search: '',
        searchIn: 'title' ,
        eventJoineds: []
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
            label:'Description',
            accessor: 'content',
        },
        {
            label:'Start Time',
            accessor: 'startTime',


        },
        {
            label:'End Time',
            accessor: 'endTime',
        },
        {
            label:'Location',
            accessor: 'location.placeName',
        },
        {
            label:'Quota',
            accessor: 'quota',
        },
        {
            label:'Joined',
            accessor: 'eventJoinedsLegth',
        }

    ]
    
    
    componentDidMount() {        
        this.onList();
        this.setState({
            columns: [
                {
                    Header: 'Title',
                    accessor: 'title',
                },
                {
                    Header: 'Start Time',
                    accessor: 'startTime',
                    Cell: row => {
                        return moment(row.value).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm')
                    }
                },
                {
                    Header: 'End Time',
                    accessor: 'endTime',
                    Cell: row => {
                        return moment(row.value).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm')
                    }
                },
                {
                    Header: 'Quota',
                    accessor: 'quota',
                    Cell: row => {
                        let value = (!row.value) ? 'Unlimited' : row.value;
                        return (
                            <a href="#" onClick={()=>this.onShowQuota(row)}>
                                {value}
                            </a>
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
                                onEdit={this.onShowEdit}
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
            address: '',
            latlng: {lat: 13.75398,  lng: 100.50144},
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            startTimeUnix: '',
            endTimeUnix: '',
            photoUrl: '',
            photo: null ,
            quota: 0,
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

    getRequiredFields = () => {
        let requiredFields = [
            'title' ,
            'start_date',
            'start_time',
            'end_date',
            'end_time',
            'address',
        ]

        return requiredFields; 
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
            let fetchData = await API.graphql(graphqlOperation(listEvents,variable))
            results = [...recurrResults , ...fetchData.data.listEvents.items];
            if(fetchData.data.listEvents.nextToken) {
                this.state.nextToken = fetchData.data.listEvents.nextToken;
                return this._recurOnList(limit , results);
            } else {
                return results;
            } 
        }catch(error) {
            throw new Error(error);
        }
        
    }

    onUploadImage(file) {
        return new Promise((resolve ,reject) => {
            const options = {
                ACL: 'public-read',
                level: "public",
                contentType: file.type
            };
            Storage.put(file.name , file , options)
            .then (result => {
                // console.log(result)
                console.log('add image');
                // add Image
                let params = {
                    uri: `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
                }
                resolve(params);
            })
            .catch(err => reject(err));
        })  
        
    }

    onCreate = async() => {
        try {
            await this.setState({loading: true , loadingContent: 'Creating Event...'});
            let requiredFields = this.getRequiredFields(this.state.postType);
            for(let key of requiredFields) {
                if(!this.state[key]) {
                    console.log(key,this.state[key]);
                    alert('Please input all required fields');
                    await this.setState({loading: false});
                    return false;
                }
            }
            let user = await Auth.currentAuthenticatedUser();
            // console.log(user);
            let variable = {
                title: this.state.title,
                startTime: moment(`${this.state.start_date} ${this.state.start_time}`).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                endTime: moment(`${this.state.end_date} ${this.state.end_time}`).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                // startTimeUnix: moment(`${this.state.start_date} ${this.state.start_time}`).valueOf(),
                // endTimeUnix: moment(`${this.state.end_date} ${this.state.end_time}`).valueOf(),
                description: this.state.description,
                quota: this.state.quota,
                createdAt: moment().format(),
                eventUserId: user.username,
                upcoming: true ,
                hashStatus: 'ok'
            }
            if(this.state.photo){
                let uploadParams = await this.onUploadImage(this.state.photo);
                variable.image = uploadParams.uri;
            }
            if(this.state.address && this.state.latlng) {
                variable.location = {
                    placeName: this.state.address,
                    placeLatLng: `${this.state.latlng.lat},${this.state.latlng.lng}`
                }
            } 
            let newVariable = Object.keys(variable).reduce((object, key) => {
                if (variable[key]) {
                  object[key] = variable[key];
                }
                return object
            }, {});
            
            let result = await API.graphql(graphqlOperation(createEvent,{input:newVariable}));
            await this.setState({loading: false});
            this.onList();
            this.closeModal();
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onShowQuota = async(rowData) => {
        // console.log(rowData);
        try {
            let result = await API.graphql(graphqlOperation(getEvent, {id: rowData.original.id}));
            let address = (result.data.getEvent.location && result.data.getEvent.location !== null) 
                            ? result.data.getEvent.location.placeName
                            : '';
            let latlng = (result.data.getEvent.location && result.data.getEvent.location !== null) 
            ? {
                lat: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[0]), 
                lng: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[1])
            }
            : {lat: 13.75398,  lng: 100.50144}

            let startDateTime = moment(result.data.getEvent.startTime);
            let endDateTime = moment(result.data.getEvent.endTime);
            await this.setState({
                address: address,
                latlng: latlng,
                title: result.data.getEvent.title,
                description: result.data.getEvent.description,
                photoUrl: result.data.getEvent.image,
                photo: null ,
                quota: result.data.getEvent.quota,
                modalIsOpen: true,
                modalMode: 'quota',
                start_date: startDateTime.format('YYYY-MM-DD'),
                start_time: startDateTime.format('HH:mm'),
                end_date: endDateTime.format('YYYY-MM-DD'),
                end_time: endDateTime.format('HH:mm'),
                id: rowData.original.id ,
                eventJoineds: result.data.getEvent.eventJoineds.items
            }, () => {
                console.log(this.state)
            })
        }catch(error) {
            console.log(error);
        }
    }

    onView = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getEvent, {id: id}));
            let address = (result.data.getEvent.location && result.data.getEvent.location !== null) 
                            ? result.data.getEvent.location.placeName
                            : '';
            let latlng = (result.data.getEvent.location && result.data.getEvent.location !== null) 
            ? {
                lat: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[0]), 
                lng: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[1])
            }
            : {lat: 13.75398,  lng: 100.50144}

            let startDateTime = moment(result.data.getEvent.startTime);
            let endDateTime = moment(result.data.getEvent.endTime);
            this.setState({
                address: address,
                latlng: latlng,
                title: result.data.getEvent.title,
                description: result.data.getEvent.description,
                photoUrl: result.data.getEvent.image,
                photo: null ,
                quota: result.data.getEvent.quota,
                modalIsOpen: true,
                modalMode: 'view',
                start_date: startDateTime.format('YYYY-MM-DD'),
                start_time: startDateTime.format('HH:mm'),
                end_date: endDateTime.format('YYYY-MM-DD'),
                end_time: endDateTime.format('HH:mm'),
                id: id
            })
        }catch(error) { 
            console.log(error);
        }
    }

    onShowEdit = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getEvent, {id: id}));
            let address = (result.data.getEvent.location && result.data.getEvent.location !== null) 
                            ? result.data.getEvent.location.placeName
                            : '';
            let latlng = (result.data.getEvent.location && result.data.getEvent.location !== null) 
            ? {
                lat: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[0]), 
                lng: parseFloat(result.data.getEvent.location.placeLatLng.split(',')[1])
            }
            : {lat: 13.75398,  lng: 100.50144}
            let startDateTime = moment(result.data.getEvent.startTime);
            let endDateTime = moment(result.data.getEvent.endTime);
            this.setState({
                address: address,
                latlng: latlng,
                title: result.data.getEvent.title,
                description: result.data.getEvent.description,
                photoUrl: result.data.getEvent.image,
                photo: null ,
                quota: result.data.getEvent.quota,
                modalIsOpen: true,
                modalMode: 'edit',
                start_date: startDateTime.format('YYYY-MM-DD'),
                start_time: startDateTime.format('HH:mm'),
                end_date: endDateTime.format('YYYY-MM-DD'),
                end_time: endDateTime.format('HH:mm'),
                id: id
            })
        }catch(error) { 
            console.log(error);
        }
    }

    onEdit = async() => {
        try {
            await this.setState({loading: true , loadingContent: 'Editing Event...'});
            let requiredFields = this.getRequiredFields(this.state.postType);
            for(let key of requiredFields) {
                if(!this.state[key]) {
                    console.log(key,this.state[key]);
                    alert('Please input all required fields');
                    await this.setState({loading: false});
                    return false;
                }
            }
            // console.log(user);
            let variable = {
                title: this.state.title,
                startTime: moment(`${this.state.start_date} ${this.state.start_time}`).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                endTime: moment(`${this.state.end_date} ${this.state.end_time}`).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                // startTimeUnix: moment(`${this.state.start_date} ${this.state.start_time}`,).valueOf(),
                // endTimeUnix: moment(`${this.state.end_date} ${this.state.end_time}`).valueOf(),
                description: this.state.description,
                quota: this.state.quota,
                createdAt: moment().format(),
                id: this.state.id,
                hashStatus: 'ok'
            }
            if(this.state.photo){
                let uploadParams = await this.onUploadImage(this.state.photo);
                variable.image = uploadParams.uri;
            }
            if(this.state.address && this.state.latlng) {
                variable.location = {
                    placeName: this.state.address,
                    placeLatLng: `${this.state.latlng.lat},${this.state.latlng.lng}`
                }
            } 
            let newVariable = Object.keys(variable).reduce((object, key) => {
                if (variable[key]) {
                  object[key] = variable[key];
                }
                return object
            }, {});
            
            let result = await API.graphql(graphqlOperation(updateEvent,{input:newVariable}));
            await this.setState({loading: false});
            this.onList();
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
                await this.setState({loading: true , loadingContent: 'Deleting Event...'});
                let variable = {
                    id
                }
                let result = await API.graphql(graphqlOperation(deleteEvent,{input: variable}));
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

    render() {
        return <EventScreen
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