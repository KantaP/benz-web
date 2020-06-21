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
import moment from 'moment-timezone';
import UserRow from '../../UserRow';
import { GoogleMap, Marker } from '@react-google-maps/api'
import { DateTimePicker } from 'react-widgets'
import DatePicker from 'reactstrap-date-picker';
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      minWidth              : '520px',
      maxWidth              : '520px'
    }
  };

const customStylesForm = {
    maxHeight: '300px',
    overflow: 'scroll',
    marginTop : 10
}

export const EventScreen = (
    {
        columns , 
        data , 
        onCloseModal ,
        onOpenModal ,
        onHandleChange,
        onFileChange,
        state,
        onCreate,
        onEdit,
        refCsvLink,
        refReactTable ,
        onExportCSV ,
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
                <i className="far fa-calendar" style={{color:'#b21e23'}}></i>
                <div style={{color:'#fff' , marginLeft: 10}}>Event Management</div>
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
                    <option value="title">Event Name</option>
                    {/* <option value="content">Description</option> */}
                </Input>
            </Row>
        </Row>
        {/* End Top Bar */}
        {/* Content */}
        <Row className="mr-0 ml-0 p-3" style={{justifyContent:'space-between'}}>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                <div>Total Event: {state.count}</div>
            </Row>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                <div className="export-btn" style={{marginRight: 10}} onClick={onOpenModal}>
                    Add Event
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
            filename="events.csv"
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
                            <div>{(state.modalMode === 'create') ? 'Create' : 'Edit'} Event</div>
                           
                        </Row>
                        <Form style={customStylesForm}>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Event Name *</Label>
                                <Col sm={9}>
                                    <Input 
                                    value={state.title}
                                    onChange={(e) => onHandleChange('title' , e.target.value)} 
                                    className="customInput" type="text" name="title" id="title" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Add Photo Banner</Label>
                                <Col sm={9}>
                                    <Input onChange={onFileChange} className="customInput" type="file" name="file" id="file" accept="image/*" />
                                    <FormText color="muted">
                                        accept only image file (.jpg .jpeg .png) and maximum file size is 2MB
                                    </FormText>
                                    {
                                        state.modalMode === 'edit' &&
                                        (
                                            <img src={state.photoUrl || '/images/no-image.png'} style={{width: 320, height: 240 , backgroundColor:'#ccc'}} />
                                        )
                                    }
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Description *</Label>
                                <Col sm={9}>
                                    <Input value={state.description}  onChange={(e) => onHandleChange('description' , e.target.value)} 
                                    className="customInput" type="textarea" name="description" id="description" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Location *</Label>
                                <Col sm={9}>
                                    {/* <Input className="customInput" type="FormText" name="location" id="location" /> */}
                                    <LocationSearchInput
                                        initialValue={state.address}
                                        onHandleChange={onHandleChange}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}></Label>
                                <Col sm={9}>
                                    {/* <Input className="customInput" type="FormText" name="location" id="location" /> */}
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
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Start *</Label>
                                <Col sm={9}>
                                    <Row className="customRow">
                                        <Input 
                                        value={state.start_date}
                                        onChange={(e)=>onHandleChange('start_date',e.target.value)} 
                                        className="customInput" type="date" name="startTime" id="startTime" />
                                        <Input
                                        style={{marginLeft: 5}}
                                        value={state.start_time}
                                        onChange={(e)=>onHandleChange('start_time',e.target.value)} 
                                        className="customInput" type="time"/>
                                    </Row>
                                    
                                    
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>End *</Label>
                                <Col sm={9}>
                                    <Row className="customRow">
                                        <Input 
                                        value={state.end_date}
                                        onChange={(e)=>onHandleChange('end_date',e.target.value)} 
                                        className="customInput" type="date" name="startTime" id="startTime" />
                                        <Input
                                        style={{marginLeft: 5}}
                                        value={state.end_time}
                                        onChange={(e)=>onHandleChange('end_time',e.target.value)} 
                                        className="customInput" type="time"/>
                                    </Row>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Quota Limit?</Label>
                                <Col sm={9}>
                                    <Row className="customRow">
                                        <div style={{marginLeft: 20}}>
                                            <Label className="customLabel" check>
                                                <Input checked={state.quotaLimit === 'yes'} onChange={(e) => onHandleChange('quotaLimit' , e.target.value)}
                                                type="radio" name="radio1" value="yes" />
                                                Yes
                                            </Label>
                                        </div>
                                        <div style={{marginLeft: 30}}>
                                            <Label className="customLabel" check>
                                                <Input checked={state.quotaLimit === 'no'} onChange={(e) => onHandleChange('quotaLimit' , e.target.value)}
                                                type="radio" name="radio1" value="no" />
                                                No
                                            </Label>
                                        </div>
                                        
                                    </Row>

                                </Col>
                            </FormGroup>
                            {
                                (state.quotaLimit === 'yes') &&
                                (
                                    <FormGroup row>
                                        <Label className="customLabel" sm={3}>Quota</Label>
                                        <Col sm={9}>
                                            <Input 
                                            value={state.quota}
                                            onChange={(e)=>onHandleChange('quota',e.target.value)} 
                                            className="customInput" type="number" name="quota" id="quota" />
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
                                    <Button onClick={onCreate} className="submit-btn">
                                        Create Event
                                    </Button>
                                )
                                : (
                                    <Button onClick={onEdit} className="submit-btn">
                                        Edit Event
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
                            <div>View Event</div>
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
                                <Label className="customLabel" sm={3}>Title</Label>
                                <Col sm={9}>
                                    {state.title}
                                </Col>
                            </FormGroup>
                            {
                                (state.photoUrl && state.photoUrl !== 'null') &&
                                (
                                    <FormGroup row style={{alignItems:'center'}}>
                                        <Label className="customLabel" sm={3}>Photo</Label>
                                        <Col sm={9}>
                                            <img 
                                                src={state.photoUrl}
                                                style={{width: 320, height: 240}}
                                            />
                                        </Col>
                                    </FormGroup>
                                )
                            }
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Description</Label>
                                <Col sm={9}>
                                    {state.description}
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Location</Label>
                                <Col sm={9}>
                                    {state.address}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}></Label>
                                <Col sm={9}>
                                    {/* <Input className="customInput" type="FormText" name="location" id="location" /> */}
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
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Start Time</Label>
                                <Col sm={9}>
                                    {moment(`${state.start_date} ${state.start_time}`).format('DD/MM/YYYY HH:mm')}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>End Time</Label>
                                <Col sm={9}>
                                    {moment(`${state.end_date} ${state.end_time}`).format('DD/MM/YYYY HH:mm')}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label className="customLabel" sm={3}>Quota</Label>
                                <Col sm={9}>
                                    {
                                        (!state.quota)
                                        ? 'Unlimited'
                                        : state.quota
                                    }
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                )
            }
            {
                (state.modalMode === 'quota') &&
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
                            <div>Event Quota</div>
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
                        {
                            (state.eventJoineds.length > 0) &&
                            state.eventJoineds.map((item)=>(
                                <UserRow userId={item.userId} />
                            ))
                        }
                    </div>
                )
            }
        </Modal>
        {/* End Modal */}
    </LoadingOverlay>
)