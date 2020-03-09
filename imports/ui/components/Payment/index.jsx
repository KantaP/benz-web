import React from 'react';
import './style.css';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Col,
    Row,
    Alert
} from 'reactstrap';

import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
const styles = {}

export class PaymentPage extends React.Component {

    render() {
        // if(!this.state.ready) return null;
        let expired = moment(this.props.state.memberExpiredAt)
        return (
            
                <div style={{
                    backgroundImage: `url(/images/paymentBg.jpg)`,
                    backgroundSize: 'cover',
                    paddingTop: '3rem',
                    paddingBottom: '3rem',
                    height: '100vh',
                    flex: 1
                }}>
                    <LoadingOverlay
                        active={this.props.state.loading}
                        spinner
                        FormText='Processing...'
                    >
                    <Row>
                        <Col xs="1" md="2" sm="2"></Col>
                        <Col xs="10" md="8" sm="8">
                            <div
                                className="custom-div"
                            >
                                <h2>Membership</h2>
                                <h6>{this.props.state.memberShipPrice.toLocaleString('en-us', { minimumFractionDigits: 0 })} per year</h6>
                            </div>
                            <div className="custom-div" style={{ paddingLeft: 20, marginTop: 20 }}>
                                <h5>Benefit</h5>
                                <ul>
                                    <li className="custom-li">PRIVATE LOUNGE ACCESS</li>
                                    <li className="custom-li">EXCLUDE VIEWING ACCESS TO PLAYERS</li>
                                    <li className="custom-li">VIP ENTRANCE INTO TO STADIUM</li>
                                    <li className="custom-li">VIP PARKING</li>
                                    <li className="custom-li">BES SIGHTLINES GUARANTEED</li>
                                    <li className="custom-li">ALL-INCLUSIVE FOOD & BEVERAGE</li>
                                </ul>
                            </div>
                            <div className="custom-div" style={{ marginTop: '20%' }}>
                                <form onSubmit={this.props.handleSubmit} ref={this.props.paymentForm}></form>
                                {
                                    this.props.state.memberExpiredAt &&
                                    this.props.state.memberExpiredAt !== null &&
                                    moment().isBefore( expired , 'day') &&
                                    (
                                        <h3>Your expired date is {moment(this.props.state.memberExpiredAt).format('DD/MM/YYYY')}</h3>
                                    )
                                }
                                {/* <Button
                                    disabled={this.state.disabledBtn}
                                    onClick={this.handleClick}
                                    type="button"
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #ffffff',
                                        width: '120px',
                                        height: '50px'
                                    }}>
                                    <i className="fas fa-money-bill" style={{ marginRight: 5 }}></i>
                                    PAYMENT
                                </Button> */}
                            </div>
                        </Col>
                        <Col xs="1" md="8" sm="2"></Col>
                    </Row>
                    </LoadingOverlay>
                </div>
            
        )
    }
}

