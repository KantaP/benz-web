import React from 'react';
import { Row , Col , Button } from 'reactstrap'
import PropTypes from 'prop-types';

const styles = {
    button : {
        backgroundColor:'#fff',
        border:'1px solid #000',
        width:'30px',
        height: '30px',
        display:'flex' ,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft: '0.55rem',
        marginLeft: '3px'
    },
    font: {
        color: '#000',
        fontSize: 10
    }
    
}

export const ActionCell = ({onEdit , onView , onDelete  , onActiveMail , onSetToAdmin , id , onToggleActive}) => (
    <Row className="ml-0 mr-0" style={{alignItems:'center',justifyContent:'center'}}>
        {
            (onView) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onView) {
                            onView(id);
                        }
                    }}
                >
                    <i className="fas fa-search" style={styles.font}></i>
                </Button>
            )
        }
        {
            (onEdit) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onEdit) {
                            onEdit(id);
                        }
                    }}
                >
                    <i className="far fa-edit" style={styles.font}></i>
                </Button>
            )
        }
        {
            (onDelete) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onDelete) {
                            onDelete(id);
                        }
                    }}
                >
                    <i className="fas fa-trash" style={styles.font}></i>
                </Button>
            )
        }
        {
            (onActiveMail) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onActiveMail) {
                            onActiveMail(id);
                        }
                    }}
                >
                    <i className="far fa-envelope" style={styles.font}></i>
                </Button>
            )
        }
        {
            (onSetToAdmin) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onSetToAdmin) {
                            onSetToAdmin(id);
                        }
                    }}
                >
                    <i className="fas fa-user-tie" style={styles.font}></i>
                </Button>
            )
        }
        {
            (onToggleActive) &&
            (
                <Button
                    style={styles.button}
                    onClick={()=>{
                        if(onToggleActive) {
                            onToggleActive(id);
                        }
                    }}
                >
                    <i className="fas fa-lock" style={styles.font}></i>
                </Button>
            )
        }
    </Row>
)


ActionCell.propTypes = {
    onView: PropTypes.func ,
    onEdit: PropTypes.func ,
    onDelete: PropTypes.func ,
    id: PropTypes.string
}