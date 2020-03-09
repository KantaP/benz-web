import React from 'react';
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

const getStatus = (label) => {
    const statusColor = {
        'new' : {
            color: '#25a9e0',
            label: 'New',
            className: 'status_new full_width',
        },
        'submit' : {
            color: '#25a9e0',
            label: 'New',
            className: 'status_new full_width',
        },
        'on_progress' : {
            color: '#FAAF40',
            label: 'On Progress',
            className: 'status_on_progress full_width',
        },
        'finish' : {
            color: '#28B473',
            label: 'Finish',
            className: 'status_finish full_width',
        }
    }
    return statusColor[label];
}

export class StatusDropDown extends React.Component {
    state = {
        label: this.props.statusParams.status,
    }

    setLabel = (label) => {
        this.setState({label});
    }

    onChangeStatus = (label) => {
        if(this.props.onChange) {
            this.props.onChange(this.props.statusParams.id , label)
        }
        this.setLabel(label);
    }

    render () {
        // if(!getStatus(this.state.label).className) return null;
        return (
            <div style={{textAlign:'center'}}> 
                <UncontrolledButtonDropdown >
                <DropdownToggle caret className={getStatus(this.state.label).className}>
                    {getStatus(this.state.label).label}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={()=>{this.onChangeStatus('new')}}>New</DropdownItem>
                    <DropdownItem onClick={()=>{this.onChangeStatus('on_progress')}}>On Progress</DropdownItem>
                    <DropdownItem onClick={()=>{this.onChangeStatus('finish')}}>Finish</DropdownItem>
                </DropdownMenu>
                </UncontrolledButtonDropdown>
            </div> 
        )
    }
}