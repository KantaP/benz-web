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
import { GoogleMap, Marker } from '@react-google-maps/api'
import Files from 'react-files'
import DatePicker from 'reactstrap-date-picker';

import { DateTimePicker } from 'react-widgets'
import moment from 'moment-timezone';
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

const expire = {
    '1_day' : '1 Day',
    '3_day' : '3 Days',
    '5_day' : '5 Days',
    '7_day' : '7 Days',
    '30000_day' : 'Unlimited'
}

export const BroadCastScreen = (
    {
        columns , 
        data , 
        onCloseModal ,
        onOpenModal ,
        onHandleChange,
        onFileChange,
        state,
        onCreatePost,
        onEditPost,
        refCsvLink,
        refReactTable ,
        onExportCSV ,
        onSearchPost ,
        onCloseQuataModal,
        onShowQUata ,
        onFilesChange,
        onRemoveFile ,
        refFiles
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
                <i className="fas fa-podcast" style={{color:'#b21e23'}}></i>
                <div style={{color:'#fff' , marginLeft: 10}}>Broadcast Post & Privilege</div>
            </Row>
            {/* Search */}
            <Row className="mr-0 ml-0 p-1" 
            style={{alignItems:'center',backgroundColor:'#fff'}}>
                <Input 
                style={{flex: 0.65, borderRadius: 0 ,  border: 0 , borderRight: '1px solid #ccc'}} 
                onChange={(e) => onHandleChange('search' , e.target.value)} 
                className="form-control-custom" placeholder="Search" />
                <Input 
                onChange={(e) => onHandleChange('searchIn' , e.target.value)} 
                type="select" 
                style={{flex: 0.35, border: 0 , borderRadius: 0}}>
                    <option value="type">Type</option>
                    <option value="content">Description</option>
                </Input>
            </Row>
        </Row>
        {/* End Top Bar */}
        {/* Content */}
        <Row className="mr-0 ml-0 p-3" style={{justifyContent:'space-between'}}>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                <div>Total Post: {state.count}</div>
            </Row>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                <div className="export-btn" style={{marginRight: 10}} onClick={onOpenModal}>
                    Add Post
                </div>
                <div className="export-btn" onClick={onExportCSV}>
                    Export to Excel
                </div>
            </Row>
        </Row>
        {/* End Content */}
        {/* Table */}
        <Table
            ref={refReactTable}
            data={
                (state.search && state.searchIn)
                ? _(data).filter((item)=>{
                    if(
                        item[state.searchIn].toLowerCase().includes(state.search.toLowerCase())
                      )
                    {
                        return item;
                    }
                })
                .value()
                : data
            }
            columns={columns}
        />
        {/* End Table */}
        {/* Download CSVLink */}
        <CSVLink
            data={state.dataToDownload}
            filename="posts.csv"
            className="hidden"
            ref={refCsvLink}
            target="_blank"
        />
        {/* End CSV Link */}
        {/* Modal  */}
        <Modal
        style={customStyles}
        isOpen={state.modalIsOpen}
        onRequestClose={onCloseModal}
        ariaHideApp={false}
        >
            {
                (state.modalMode === 'create' || state.modalMode === 'edit') &&
                (
                    <div>
                        <Row style={{
                        borderBottomWidth: 1, 
                        borderBottomColor:'#ccc',
                        borderBottomStyle:'solid',
                        paddingBottom: 10,
                        }}>
                            <div>{(state.modalMode === 'create') ? 'Create' : 'Edit'} Broadcast Post</div>
                           
                        </Row>
                        <Form style={customStylesForm}>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Post Type *</Label>
                                <Col sm={9}>
                                    <Input 
                                    value={state.postType}
                                    onChange={(e) => onHandleChange('postType' , e.target.value)} 
                                    className="customInput" type="select" name="postType" id="postType">
                                        <option value="">Please Select Type</option>
                                        <option value="broadcast">Broadcast</option>
                                        <option value="privilege">Privlige</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            {
                                (state.postType === 'privilege') &&
                                [
                                    <FormGroup key={0} row>
                                        <Label className="customLabel" sm={3}>Privilege Quota *</Label>
                                        <Col sm={9}>
                                            <Input value={state.quata} onChange={(e) => onHandleChange('quata' , e.target.value)} 
                                            className="customInput" type="number" name="quata" id="quata" />
                                        </Col>
                                    </FormGroup> ,
                                    <FormGroup key={1} row>
                                        <Label className="customLabel" sm={3}>Privilege Photo *</Label>
                                        <Col sm={9}>
                                            <Input key={0} onChange={(e)=>onFileChange(e , 'redeemImage')} className="customInput" type="file" name="redeemImage" id="redeemImage" accept="image/*" />
                                            <FormText key={1} color="muted">
                                                accept only image file (.jpg .jpeg .png) and maximum file size is 2MB
                                            </FormText>
                                            {
                                                state.modalMode === 'edit' &&
                                                (
                                                    <img src={state.redeemImageUrl || '/images/no-image.png'} style={{width: 320, height: 240 , backgroundColor:'#ccc'}} />
                                                )
                                            }
                                        </Col>
                                    </FormGroup>,
                                    <FormGroup key={2} row>
                                        <Label className="customLabel" sm={3}>Privilege Description *</Label>
                                        <Col sm={9}>
                                            <Input value={state.redeemDescription} onChange={(e) => onHandleChange('redeemDescription' , e.target.value)} 
                                            className="customInput" type="textarea" name="redeemDescription" id="redeemDescription" />
                                        </Col>
                                    </FormGroup>,
                                    <FormGroup key={3} row>
                                        <Label className="customLabel" sm={3}>Privilege Expire *</Label>
                                        <Col sm={9}>
                                            {/* <DateTimePicker 
                                                defaultValue={new Date()}
                                                time={false}
                                                format={'DD MMM YYYY'}
                                                onChange={(v) => {
                                                    onHandleChange('expireRedeemAt' , moment.tz(v, 'Asia/Bangkok').format('YYYY-MM-DD'))
                                                }}
                                                containerClassName="customInput"
                                            /> */}
                                            <DatePicker 
                                                value={state.expireRedeemAt} 
                                                onChange={(v,f) => {
                                                    console.log( moment.tz(v, 'Asia/Bangkok').format('YYYY-MM-DD'))
                                                    onHandleChange('expireRedeemAt' , moment.tz(v, 'Asia/Bangkok').format('YYYY-MM-DD'))
                                                }} 
                                                className="customInput" 
                                                name="expireRedeemAt" 
                                                id="expireRedeemAt" 
                                                showClearButton={false}
                                            />
                                            {/* <Input value={state.expireRedeemAt} 
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                onHandleChange('expireRedeemAt' , e.target.value)
                                            }} 
                                            className="customInput" type="date" name="expireRedeemAt" id="expireRedeemAt" /> */}
                                        </Col>
                                    </FormGroup>
                                ]
                            }
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Add Photo</Label>
                                <Col sm={9}>
                                    
                                    {/* <Input key={0} onChange={(e)=>onFileChange(e , 'photo')} className="customInput" type="file" name="file" id="file" accept="image/*" />
                                    <FormText key={1} color="muted">
                                        accept only image file (.jpg .jpeg .png) and maximum file size is 2MB
                                    </FormText>
                                    {
                                        state.modalMode === 'edit' &&
                                        (
                                            <img src={state.photoUrl || '/images/no-image.png'} style={{width: 320, height: 240 , backgroundColor:'#ccc'}} />
                                        )
                                    } */}
                                    <Files
                                    ref={refFiles}
                                    className='files-dropzone-list'
                                    onChange={onFilesChange}
                                    // onError={this.onFilesError}
                                    accepts={['image/*']}
                                    multiple
                                    maxFiles={5 - state.photosView.length}
                                    maxFileSize={10000000}
                                    minFileSize={0}
                                    clickable
                                    >
                                        Drop files here or click to upload
                                    </Files>
                                    <div  className="files-list">
                                        <ul>
                                            {
                                                state.photos.length > 0 &&
                                                state.photos.map((photo)=>(
                                                    <li className='files-list-item' key={photo.id}>
                                                        <div className='files-list-item-preview'>
                                                        {photo.preview.type === 'image'
                                                        ? <img className='files-list-item-preview-image' src={photo.preview.url} />
                                                        : <div className='files-list-item-preview-extension'>{photo.extension}</div>}
                                                        </div>
                                                        <div className='files-list-item-content'>
                                                        <div className='files-list-item-content-item files-list-item-content-item-1'>{photo.name}</div>
                                                        <div className='files-list-item-content-item files-list-item-content-item-2'>{photo.sizeReadable}</div>
                                                        </div>
                                                        <div
                                                        id={photo.id}
                                                        className='files-list-item-remove'
                                                        onClick={()=>onRemoveFile(photo)} // eslint-disable-line
                                                        />
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    
                                </Col>
                            </FormGroup>
                            {
                                (state.photosView.length > 0) &&
                                state.photosView.map((photo)=>(
                                    <FormGroup row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}></Label>
                                        <Col sm={9}>
                                            <img 
                                                src={photo.uri}
                                                style={{width: 320 , height:240}}
                                            />
                                        </Col>
                                    </FormGroup>
                                ))
                            }
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Description *</Label>
                                <Col sm={9}>
                                    <Input value={state.description}  onChange={(e) => onHandleChange('description' , e.target.value)} 
                                    className="customInput" type="textarea" name="description" id="description" />
                                </Col>
                            </FormGroup>
                            {/* <FormGroup row>
                                <Label className="customLabel" sm={3}>Location</Label>
                                <Col sm={9}>
                                    <LocationSearchInput
                                        initialValue={state.address}
                                        onHandleChange={onHandleChange}
                                    />
                                </Col>
                            </FormGroup> */}
                            {/* <FormGroup row>
                                <Label className="customLabel" sm={3}></Label>
                                <Col sm={9}>
                                   
                                    <GoogleMap
                                        zoom={7}
                                        id='mapview'
                                        center={state.latlng}
                                    >
                                        <Marker 
                                            position={state.latlng}
                                        />
                                    </GoogleMap>
                                </Col>
                            </FormGroup> */}
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Pin Post</Label>
                                <Col sm={9}>
                                    <Input
                                    value={state.pin}
                                    onChange={(e) => onHandleChange('pin' , e.target.value)}  
                                    className="customInput" type="select" name="pin" id="pin">
                                        <option value="off">UnPin</option>
                                        <option value="on">Pin</option>
                                    </Input>
                                    {
                                        (state.pin === 'on') &&
                                        (
                                            <FormGroup row style={{marginTop: 5}}>
                                                <Label className="customLabel" sm={3}>Duration</Label>
                                                <Col sm={9}>
                                                    <Input 
                                                    value={state.expire}
                                                    onChange={(e) => onHandleChange('expire' , e.target.value)}
                                                    className="customInput" type="select" name="expire" id="expire">
                                                        <option value="">Select Time</option>
                                                        <option value="1_day">1 day</option>
                                                        <option value="3_day">3 day</option>
                                                        <option value="5_day">5 day</option>
                                                        <option value="7_day">7 day</option>
                                                        <option value="30000_day">Unlimited</option>
                                                        {/* <option>Unpin</option> */}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                </Col>
                            </FormGroup>
                            {
                                (state.modalMode === 'create') &&
                                (
                                    <FormGroup row>
                                        <Label className="customLabel" sm={3}>Push Notification</Label>
                                        <Col sm={9} style={{paddingLeft: '30px'}}>
                                            <Row className="customRow">
                                                <div style={{marginLeft: 20}}>
                                                    <Label className="customLabel" check>
                                                        <Input onChange={(e) => onHandleChange('pushNotification' , e.target.value)}
                                                        type="radio" name="radio1" value="yes" />
                                                        Yes
                                                    </Label>
                                                </div>
                                                <div style={{marginLeft: 30}}>
                                                    <Label className="customLabel" check>
                                                        <Input 
                                                        onChange={(e) => onHandleChange('pushNotification' , e.target.value)}
                                                        type="radio" name="radio1" value="no" />
                                                        No
                                                    </Label>
                                                </div>
                                            </Row>
                                        </Col>
                                    </FormGroup>
                                )
                            }
                        </Form>
                        <Row style={{
                            paddingBottom: 10,
                            justifyContent:'flex-end',
                            alignItems:'center'
                        }}>
                            {
                                (state.modalMode === 'create') 
                                ? (
                                    <Button onClick={onCreatePost} className="submit-btn">
                                        Create Post
                                    </Button>
                                )
                                : (
                                    <Button onClick={onEditPost} className="submit-btn">
                                        Edit Post
                                    </Button>
                                )
                            }
                            
                            <Button onClick={onCloseModal} className="cancel-btn" style={{marginLeft: 5}}>
                                Cancel
                            </Button>
                        </Row>
                    </div>

                )
            }
            {
                (state.modalMode === 'view') &&
                (
                    <div>
                        <Row style={{
                            borderBottomWidth: 1, 
                            borderBottomColor:'#ccc',
                            borderBottomStyle:'solid',
                            paddingBottom: 10,
                            justifyContent:'space-between',
                            paddingRight: 10
                        }}>
                            <div>View Broadcast Post</div>
                            <Button 
                                size="small"
                                style={{
                                    border: 0,
                                    backgroundColor:'#fff'
                                }}
                                onClick={onCloseModal}>
                                    <i style={{color:'#000'}} className="fas fa-times"></i>
                            </Button>
                        </Row>
                        <Form style={customStylesForm}>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Post Type</Label>
                                <Col sm={9}>
                                    {state.postType}
                                </Col>
                            </FormGroup>
                            {
                                (state.postType === 'privilege') &&
                                [
                                    <FormGroup key={0} row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Quota</Label>
                                        <Col sm={9}>
                                            {state.quata}
                                        </Col>
                                    </FormGroup> ,
                                    <FormGroup key={1} row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Privilege Photo</Label>
                                        <Col sm={9}>
                                            <img src={state.redeemImageUrl} style={{width: 320 , height: 240}} />
                                        </Col>
                                    </FormGroup>,
                                    <FormGroup key={2} row>
                                        <Label className="customLabel" sm={3}>Privilege Description*</Label>
                                        <Col sm={9}>
                                            {
                                                state.redeemDescription
                                            }
                                        </Col>
                                    </FormGroup>,
                                    <FormGroup key={3} row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Privilege Expire</Label>
                                        <Col sm={9}>
                                            {
                                                state.expireRedeemAt
                                            }
                                        </Col>
                                    </FormGroup>
                                ]
                            }
                            {/* {
                                (state.photoUrl && state.photoUrl !== 'null') &&
                                (
                                    <FormGroup row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Photo</Label>
                                        <Col sm={9}>
                                            <img 
                                                src={state.photoUrl}
                                                style={{width: 320 , height:240}}
                                            />
                                        </Col>
                                    </FormGroup>
                                )
                            } */}
                            {
                                (state.photosView.length > 0) &&
                                state.photosView.map((photo)=>(
                                    <FormGroup row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}></Label>
                                        <Col sm={9}>
                                            <img 
                                                src={photo.uri}
                                                style={{width: 320 , height:240}}
                                            />
                                        </Col>
                                    </FormGroup>
                                ))
                            }
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Description</Label>
                                <Col sm={9}>
                                    {state.description}
                                </Col>
                            </FormGroup>
                            {/* <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Location</Label>
                                <Col sm={9}>
                                    {state.address}
                                </Col>
                            </FormGroup> */}
                            {/* <FormGroup row>
                                <Label className="customLabel" sm={3}></Label>
                                <Col sm={9}>
                                    
                                    <GoogleMap
                                        zoom={7}
                                        id='mapview'
                                        center={state.latlng}
                                    >
                                        <Marker 
                                            position={state.latlng}
                                        />
                                    </GoogleMap>
                                </Col>
                            </FormGroup> */}
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Pin Post</Label>
                                <Col sm={9}>
                                    {state.pin}
                                </Col>
                            </FormGroup>
                            {
                                (state.pin === 'on') &&
                                (
                                    <FormGroup row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Duration</Label>
                                        <Col sm={9}>
                                            {expire[state.expire]}
                                        </Col>
                                    </FormGroup>
                                )
                            }
                        </Form>
                    </div>
                )
            }
        </Modal>
        {/* End Modal */}
        {/* Quata Modal */}
        <Modal
        style={customStyles}
        isOpen={state.showQuata}
        // onRequestClose={onCloseModal}
        ariaHideApp={false}
        >
            <Row style={{
            borderBottomWidth: 1, 
            borderBottomColor:'#ccc',
            borderBottomStyle:'solid',
            paddingBottom: 10,
            justifyContent:'space-between',
            paddingRight: 10
            }}>
                <div>Quota List</div>
                <Button 
                    size="small"
                    style={{
                        border: 0,
                        backgroundColor:'#fff'
                    }}
                    onClick={onCloseQuataModal}>
                        <i style={{color:'#000'}} className="fas fa-times"></i>
                </Button>
            </Row>
            <Row style={{marginTop: 10}}>
                <ul>
                    {
                        (state.userQuata.length > 0) &&
                        (
                            state.userQuata.map((item)=>(
                                <p>
                                    <i className="fa fa-user"></i> {item.userRadeem.firstName} {item.userRadeem.lastName}
                                </p>
                            ))
                        )
                    }
                </ul>
            </Row>
            <Row style={{marginTop: 5}}>
                {
                    (state.quataPrevToken) &&
                    (
                        <div className="export-btn" style={{marginRight: 10}} onClick={()=>{
                            onShowQUata(state.quataPostId, state.quataPrevToken);
                        }}>
                            Prev
                        </div>
                    )
                }
                {
                    (state.quataNextToken) &&
                    (
                        <div className="export-btn" onClick={()=>{
                            onShowQUata(state.quataPostId, state.quataNextToken);
                        }}>
                            Next
                        </div>
                    )
                }
            </Row>
        </Modal>
        {/* End */}
    </LoadingOverlay>
)