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

export const CompanyScreen = (
    {
        columns , 
        data , 
        onCloseModal ,
        state,
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
                <i className="far fa-building" style={{color:'#b21e23'}}></i>
                <div style={{color:'#fff' , marginLeft: 10}}>Company</div>
            </Row>
            {/* Search */}
            {/* <Row className="mr-0 ml-0 p-1" 
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
                    
                </Input>
            </Row> */}
        </Row>
        {/* End Top Bar */}
        {/* Content */}
        <Row className="mr-0 ml-0 p-3" style={{justifyContent:'space-between'}}>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                <div>Total Comapny: {state.count}</div>
            </Row>
            <Row className="mr-0 ml-0 p-1" style={{alignItems:'center' }}>
                {/* <div className="export-btn" style={{marginRight: 10}} onClick={onOpenModal}>
                    Add Event
                </div> */}
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
            filename="data.csv"
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
                            <div>View Feedback</div>
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
                                <Label className="customLabel" sm={3}>Logo</Label>
                                <Col sm={9}>
                                    <img 
                                    src={state.logo}
                                    style={{width: 320 , height:240}}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Name</Label>
                                <Col sm={9}>
                                    {state.name}
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Detail</Label>
                                <Col sm={9}>
                                    {state.description}
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Phone</Label>
                                <Col sm={9}>
                                    {state.phone}
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Email</Label>
                                <Col sm={9}>
                                    {state.email}
                                </Col>
                            </FormGroup>
                            <FormGroup row style={{alignItems:'center'}}>
                                <Label className="customLabel" sm={3}>Website</Label>
                                <Col sm={9}>
                                    {state.webSite}
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                )
            }
        </Modal>
        {/* End Modal */}
    </LoadingOverlay>
)