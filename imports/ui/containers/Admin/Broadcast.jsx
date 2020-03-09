import React from 'react';
import { BroadCastScreen } from '../../components/Admin/BroadCast';
import { listPosts , getPost , listUsers , redeemByPost } from '../../graphql/queries';
import { createPost , updatePost , deletePost , createPostImage } from '../../graphql/mutations';
import { API , graphqlOperation , Storage , Auth } from 'aws-amplify';
import moment from 'moment-timezone';
import { ActionCell } from '../../components/ActionCell';
import { isNull , getProperty , send } from '../../utils';
import config from '../../../api/aws/config';

export class BroadCastContainer extends React.Component {

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
        postType: '',
        pin: 'off',
        expire: '',
        expireAt: '',
        expireAtUnix: 0,
        description: '',
        pushNotification: 'no',
        photoUrl: '',
        photo: null ,
        quata: 0,
        id: '',
        redeemDescription: '',
        expireRedeemAt: '',
        redeemImage: null,
        // download data
        dataToDownload: [],
        // search
        search: '',
        searchIn: 'type' ,
        showQuata: false ,
        quataPostId: '',
        quataPrevToken: '',
        quataNextToken: '',
        userQuata:[] ,
        photos: [],
        photosView: []
    }

    requiredFields = [
        'postType' ,
        'description'
    ]

    files = React.createRef();
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
            label:'Tags',
            accessor: 'tags',
        },
        {
            label:'Location',
            accessor: 'location.placeName',
        },
        {
            label:'Post By',
            accessor: 'postOfUser.firstName',
        },
        {
            label:'Type',
            accessor: 'type',
        },
        {
            label:'Post At',
            accessor: 'createdAt',
        },
        {
            label:'Count Refer',
            accessor: 'countRefer',
        },
        {
            label:'Count Bookmark',
            accessor: 'countBookmark',
        },
        {
            label:'Pin',
            accessor: 'pin',
        },
        {
            label:'Expire At',
            accessor: 'expireAt',
        },
        {
            label:'Quota',
            accessor: 'radeemQuota',
        },

    ]
    
    
    componentDidMount() {        
        this.onListPosts();
        this.setState({
            columns: [
                {
                    Header: 'Type',
                    accessor: 'type',
                },
                {
                    Header: 'Created At',
                    accessor: 'createdAt',
                    Cell: row => {
                        let value = moment(row.value).format('DD/MM/YYYY HH:mm');
                        return value
                    }
                },
                {
                    Header: 'Pin Until',
                    accessor: 'expireAt',
                    Cell: row => {
                        if(row.value === 'null') {
                            return 'No Pin'
                        }
                        let today = moment();
                        let value = moment(row.value)
                        if(value.diff(today , 'days') > 7) {
                            return 'Unlimited'
                        }
                        return value.format('DD/MM/YYYY')
                    }
                },
                {
                    Header: 'Post By',
                    accessor: 'postOfUser.firstName'
                },
                {
                    Header: 'Quota',
                    accessor: 'radeemQuota',
                    Cell: row => {
                        let value = (!row.value) ? 'Unlimited' : `${row.original.countRadeem || 0} / ${row.value}`;
                        return (
                            <a href="#" onClick={()=>{this.onShowQuata(row.original.id , this.state.quataNextToken);}}>
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
                                onView={this.onViewPost}
                                onEdit={this.onShowEditPost}
                                onDelete={this.onDeletePost}
                                id={row.value}
                            />
                        )
                    }
                    
                }
            ]
        })
    }

    getRequiredFields = (postType) => {
        let requiredFields = [
            'type' ,
            'content'
        ]
        if(postType === 'privilege') {
            requiredFields.push('redeemDescription');
            requiredFields.push('redeemImage');
            requiredFields.push('expireRedeemAt');
        }

        return requiredFields;
    }

    onClearFormValue = () => {
        this.setState({
            address: '',
            latlng: {lat: 13.75398,  lng: 100.50144},
            postType: '',
            pin: 'off',
            expire: '',
            expireAt: '',
            expireAtUnix: 0,
            description: '',
            pushNotification: 'no',
            photoUrl: '',
            photo: null ,
            quata: 0,
            id: '',
            redeemDescription: '',
            expireRedeemAt: '',
            redeemImage: null,
            photos: [],
            photosView: []
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

    fileChange = (event , key) => {
        let file_size = event.target.files[0].size;
        if(file_size > 2097152) {
            alert('This file has size over 2MB');
            event.preventDefault();
            return;
        }
        this.handleChange(key , event.target.files[0]);
    }

    filesChange = (files) => {
        console.log(files);
        this.setState({photos: files});
    }

    filesRemoveOne = (file) => {
        // console.log(this.files);
        if(this.files) this.files.current.removeFile(file)
    }
    

    onListPosts = async() => {
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
                        filter:{
                            or:[
                                {
                                    type:{
                                        eq: 'broadcast'
                                    }
                                },
                                {
                                    type: {
                                        eq: 'privilege'
                                    }
                                }
                            ]
                        },
                        limit: limit
                    }
        try {
            let fetchData = await API.graphql(graphqlOperation(listPosts,variable))
            results = [...recurrResults , ...fetchData.data.listPosts.items];
            if(fetchData.data.listPosts.nextToken) {
                this.state.nextToken = fetchData.data.listPosts.nextToken;
                return this._recurOnList(limit , results);
            } else {
                return results.sort((a , b ) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            } 
        }catch(error) {
            throw new Error(error);
        }
        
    }

    onCreatePost = async() => {
        try {
            await this.setState({loading: true , loadingContent: 'Creating Post...'});
            let requiredFields = this.getRequiredFields(this.state.postType);
            let expireAt = "null";
            let expireAtUnix = 0;
            let user = await Auth.currentAuthenticatedUser();
            // console.log(user);
            // if(this.state.expire) {
            //     let day = this.state.expire.split('_');
            //     expireAt = moment.tz().add(day[0],day[1]).local().format();
            //     expireAtUnix = moment.tz().add(day[0],day[1]).local().format('x');
            // } else {
            //     expireAt = moment.tz().subtract(1 , 'days');
            // }
            if(this.state.pin) {
                if(this.state.expire) {
                    let day = this.state.expire.split('_');
                    expireAt = moment.tz().add(day[0],day[1]).local().format('YYYY-MM-DD');
                    expireAtUnix = moment.tz().add(day[0],day[1]).local().format('x');
                } else {
                    expireAt = moment.tz().subtract(1 , 'days');
                }
            }
            let variable = {
                active: 'on',
                content: this.state.description,
                enableComment: false,
                type: this.state.postType,
                createdAt: moment.tz().local().format(),
                createdAtUnix: moment.tz().local().format('x'),
                pin: this.state.pin,
                radeemQuota: this.state.quata,
                expire: this.state.expire,
                expireAt,
                expireAtUnix,
                postPostOfUserId: user.username ,
                redeemImage: this.state.redeemImage,
                redeemDescription: this.state.redeemDescription,
                expireRedeemAt: (this.state.expireRedeemAt && this.state.postType === 'privilege') ? moment(this.state.expireRedeemAt).add(23 , 'hours').add(59, 'minutes') : '',
                expireRedeemAtUnix: (this.state.expireRedeemAt && this.state.postType === 'privilege') 
                                    ? moment.tz(this.state.expireRedeemAt).add(23 , 'hours').add(59, 'minutes').local().valueOf()
                                    : ''
            }
            if(this.state.address && this.state.latlng) {
                variable.location = {
                    placeName: this.state.address,
                    placeLatLng: `${this.state.latlng.lat},${this.state.latlng.lng}`
                }
            } 
            let newVariable = Object.keys(variable).reduce((object, key) => {
                if (variable[key] && variable[key] !== null) {
                  object[key] = variable[key];
                }
                return object
            }, {});
            for(let key of requiredFields) {
                if(!newVariable[key]) {
                    console.log(key,newVariable[key]);
                    alert('Please input all required fields');
                    await this.setState({loading: false});
                    return false;
                }
            }
            let result = await API.graphql(graphqlOperation(createPost,{input:newVariable}));
            // console.log(result);
            // if(this.state.photo) {
            //     let uploadParams = await this.onUploadImage(result.data.createPost.id,this.state.photo);
            //     this.onCreateImagePost(uploadParams);
            // }
            if(this.state.photos.length > 0) {
                for(let photo of this.state.photos) {
                    let uploadParams = await this.onUploadImage(result.data.createPost.id,photo);
                    this.onCreateImagePost(uploadParams);
                }
            }
            if(this.state.redeemImage){
                let uploadParams = await this.onUploadImage(result.data.createPost.id,this.state.redeemImage);
                this.onUpdateRedeemImage(uploadParams);
            }
            if(this.state.pushNotification === 'yes') {
                this.onSendToAllUsers('admin announces' , `New ${this.state.postType}`);
            }
            await this.setState({loading: false});
            this.onListPosts();
            this.closeModal();
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onUploadImage(postId , file) {
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
                    postId,
                    uri: `https://${config.aws_user_files_s3_bucket}.s3-${config.aws_user_files_s3_bucket_region}.amazonaws.com/public/${result.key}`
                }
                resolve(params);
            })
            .catch(err => reject(err));
        })  
        
    }

    onUpdateRedeemImage = async({postId , uri}) => {
        try {
            let variables = {
                id: postId,
                redeemImage: uri
            }
            let result = await API.graphql(graphqlOperation(updatePost,{input:variables}));
            console.log(result.data.updatePost);
        }catch(error) {
            console.log(error);
        }
    }

    onCreateImagePost = async({postId , uri}) => {
        try {
            let variables = {
                postImagePostImageId: postId,
                uri: uri
            }
            let result = await API.graphql(graphqlOperation(createPostImage,{input:variables}));
            console.log(result.data.createPostImage);
        }catch(error) {
            console.log(error);
        }
    }

    onViewPost = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getPost, {id: id , sortImage: 'ASC',}));
            let address = (result.data.getPost.location && result.data.getPost.location !== null) 
                            ? result.data.getPost.location.placeName
                            : '';
            let latlng = (result.data.getPost.location && result.data.getPost.location !== null) 
                            ? {
                                lat: parseFloat(result.data.getPost.location.placeLatLng.split(',')[0]), 
                                lng: parseFloat(result.data.getPost.location.placeLatLng.split(',')[1])
                            }
                            : {lat: 13.75398,  lng: 100.50144}
            this.setState({
                address: address,
                latlng: latlng,
                postType: result.data.getPost.type,
                pin: result.data.getPost.pin,
                expire: result.data.getPost.expire,
                expireAt: result.data.getPost.expireAt,
                expireAtUnix: result.data.getPost.expireAtUnix,
                description: result.data.getPost.content,
                photoUrl: (result.data.getPost.postImages.items.length > 0)
                            ? result.data.getPost.postImages.items[0].uri
                            : '',
                redeemImageUrl: result.data.getPost.redeemImage,
                photo: null ,
                quata: result.data.getPost.radeemQuota,
                modalIsOpen: true,
                modalMode: 'view',
                redeemDescription: result.data.getPost.redeemDescription,
                redeemImage: null,
                expireRedeemAt: moment(result.data.getPost.expireRedeemAt).format('DD/MM/YYYY'),
                photos:[],
                photosView: result.data.getPost.postImages.items
            })
        }catch(error) { 
            console.log(error);
        }
    }

    onShowEditPost = async(id) => {
        try {
            
            let result = await API.graphql(graphqlOperation(getPost, {id: id , sortImage: 'ASC'}));
            let address = (result.data.getPost.location && 
                            result.data.getPost.location !== null &&
                            !isNull(result.data.getPost.location.placeName)) 
                            ? result.data.getPost.location.placeName
                            : '';
            
            let latlng = (result.data.getPost.location && result.data.getPost.location !== null) 
                            ? {
                                lat: parseFloat(result.data.getPost.location.placeLatLng.split(',')[0]), 
                                lng: parseFloat(result.data.getPost.location.placeLatLng.split(',')[1])
                            }
                            : {lat: 13.75398,  lng: 100.50144}
            // console.log(latlng)
            this.setState({
                address: address,
                latlng: latlng,
                postType: result.data.getPost.type,
                pin: result.data.getPost.pin,
                expire: result.data.getPost.expire,
                expireAt: result.data.getPost.expireAt,
                expireAtUnix: result.data.getPost.expireAtUnix,
                description: result.data.getPost.content,
                photoUrl: (result.data.getPost.postImages.items.length > 0)
                            ? result.data.getPost.postImages.items[0].uri
                            : '',
                redeemImageUrl: result.data.getPost.redeemImage,
                photo: null ,
                quata: result.data.getPost.radeemQuota,
                modalIsOpen: true,
                modalMode: 'edit',
                id: result.data.getPost.id,
                redeemDescription: result.data.getPost.redeemDescription,
                redeemImage: null,
                expireRedeemAt: moment(result.data.getPost.expireRedeemAt).format('YYYY-MM-DD'),
                photos: [],
                photosView: result.data.getPost.postImages.items
            })
        }catch(error) { 
            console.log(error);
        }
    }

    onEditPost = async() => {
        try {
            await this.setState({loading: true , loadingContent: 'Editing Post...'});
            let expireAt = "null";
            let expireAtUnix = 0;
            let uploadRedeemImage = {uri: ''};
            let user = await Auth.currentAuthenticatedUser();
            // console.log(user);
            // console.log('File' in window && this.state.redeemImage instanceof File)
            if(this.state.pin) {
                if(this.state.expire) {
                    let day = this.state.expire.split('_');
                    expireAt = moment.tz().add(day[0],day[1]).local().format('YYYY-MM-DD');
                    expireAtUnix = moment.tz().add(day[0],day[1]).local().format('x');
                } else {
                    expireAt = moment.tz().subtract(1 , 'days');
                }
            }
            // console.log(typeof this.state.redeemImage)
            if('File' in window && this.state.redeemImage instanceof File && this.state.postType === 'privilege'){
                uploadRedeemImage = await this.onUploadImage(this.state.id,this.state.redeemImage);
            }
            if(this.state.photos.length > 0) {
                for(let photo of this.state.photos) {
                    if('File' in window && photo instanceof File) {
                        let uploadParams = await this.onUploadImage(this.state.id,photo);
                        this.onCreateImagePost(uploadParams);
                    }
                }
            }
            let variable = {
                id: this.state.id ,
                content: this.state.description,
                type: this.state.postType,
                pin: this.state.pin,
                redeemImage: uploadRedeemImage.uri,
                radeemQuota: this.state.quata,
                redeemDescription: this.state.redeemDescription,
                expire: this.state.expire,
                expireAt,
                expireAtUnix,
                expireRedeemAt : moment(this.state.expireRedeemAt).add(23 ,'hours').add(59,'minutes')
            }
            console.log(variable);
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
            let result = await API.graphql(graphqlOperation(updatePost,{input:newVariable}));
            // console.log(result);
            
            await this.setState({loading: false});
            this.onListPosts();
            this.closeModal();
        }catch(error) {
            console.log(error);
            await this.setState({loading: false});
            alert(error.message);
        }
    }

    onDeletePost = async(id) => {
        try {
            if(confirm('Are you sure to remove this post?')) {
                await this.setState({loading: true , loadingContent: 'Deleting Post...'});
                let variable = {
                    id
                }
                let result = await API.graphql(graphqlOperation(deletePost,{input: variable}));
                this.onListPosts();
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

    onSearchPost = (event) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.setState({search: event.target.value});
        }, 1000)
    }


    onSendToAllUsers = async(title , body) => {
        try {
            let users = await this._recurOnListUsers();
            for(let user of users) {
                send({to: user.pushToken , title , body});
            }
        }catch(error) {
            console.log(error);
        }
    }
    
    
    _recurOnListUsers = async(limit = 100 , recurrResults = []) => {
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

    onShowQuata = async(id , nextToken = '') => {
        this.setState({showQuata:true , quataPostId: id});
        try {
            
            let variable = {
                postId: id,
                limit: 10
            }
            if(nextToken) {
                this.state.quataPrevToken = nextToken;
                variable.nextToken = nextToken;
            }
            let userQuata = await API.graphql(graphqlOperation(redeemByPost, variable))

            this.setState({
                userQuata: userQuata.data.redeemByPost.items , 
                quataNextToken : userQuata.data.redeemByPost.nextToken ,
            });
        }catch(error) {
            console.log(error);
        }
    }


    render() {
        return <BroadCastScreen
            {...this.props}
            columns={this.state.columns}
            data={this.state.data}
            onOpenModal={this.openModal}
            onCloseModal={this.closeModal}
            onHandleChange={this.handleChange}
            onFileChange={this.fileChange}
            state={this.state}
            onCreatePost={this.onCreatePost}
            onEditPost={this.onEditPost}
            refReactTable={this.reactTable}
            refCsvLink={this.csvLink}
            onExportCSV={this.onExportCSV}
            onSearchPost={this.onSearchPost}
            onShowQuata={this.showQuata}
            onCloseQuataModal={()=>{
                this.setState({showQuata: false , quataNextToken : '' , quataPrevToken: '' });
            }}
            onFilesChange={this.filesChange}
            onRemoveFile={this.filesRemoveOne}
            refFiles={this.files}
        />;
    }
}