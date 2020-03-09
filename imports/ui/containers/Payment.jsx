import React from 'react';
import { PaymentPage } from '../components/Payment';
import { getUser } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';
import { Auth , API , graphqlOperation } from 'aws-amplify';
import moment from 'moment';

export class PaymentContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberShipPrice : 0,
            loading: true ,
            userId: '',
            memberExpiredAt: null
        }

        // this.kBankApi = 'https://dev-kpaymentgateway-services.kasikornbank.com'; // sandbox
        // this.kBankApi = 'https://kpaymentgateway-services.kasikornbank.com'; // prod
    }


    dcc_number = "451635353376001";
    // dcc_number = "451005414864001";
    paymentForm = React.createRef();

    async componentDidMount(){
        
        let user = await Auth.currentAuthenticatedUser();
        await this._getUser(user.username);
        if(!this.props.queryParams.hasOwnProperty('key')) this.binding();
        else {
            let key = this.props.queryParams.key;
            let buff = new Buffer(key, 'base64');
            let text = buff.toString('ascii');
            let json = JSON.parse(text);
            console.log('query' , json);
            if(json.transaction_state === "Authorized" && json.status === 'success') {
                let update = await this.paid();
                console.log(update);
                window.location.href = '/download';
            }else {
                alert('Payment is not success. Please contact admin.');
                this.binding();   
            }
        }
    }

    binding(price) {
        // console.log(!document.getElementById('kpaymentScript') , this.state.price)
        if (
            !document.getElementById('kpaymentScript')
        ) {
            this.createKPayment(price);
        }
    }

    _getUser = async(username) => {
        try {
            let result = await API.graphql(graphqlOperation(getUser, {id: username}));
            const { data } = result;
            // console.log(data);
            return this.setState({memberShipPrice: data.getUser.memberShipPrice , userId: data.getUser.id, memberExpiredAt: data.getUser.memberExpiredAt});
        }catch(error) {
            await Auth.signOut();
        }
    }

    createKPayment(price) {
        const script = document.createElement("script");
        script.async = true;
        script.id = "kpaymentScript";

        // Config your merchant API Key.
        script.dataset.apikey = "pkey_test_202455gffxkYDhgC15nxnxpWdvWauxDHdQuvG";
        // script.dataset.apikey = "pkey_prod_323UuRZMq27fGJiC0Fm2sGxLIKQ86ReWP6b";

        // Config payemnt value.
        script.dataset.name = "AMG Club Thailand";
        script.dataset.paymentMethods = "card";
        script.dataset.amount = this.state.memberShipPrice
        script.dataset.currency = "THB";
        script.dataset.mid = this.dcc_number;
        // config Payment Environment
        // eg. sandbox, production 
        script.src = "https://dev-kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js";
        // script.src = "https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js";
        // console.log(script);

        let expire = moment(this.state.memberExpiredAt);
        if(
            moment().isAfter(expire) ||
            this.state.memberExpiredAt === null
        ) {
            this.paymentForm.current.appendChild(script);
        } else {
            this.setState({loading: false});
        }
        


        /**
         * Handle event on close payment popup.
         */
        var appHandleCloseCallBack = this.handleClose;

        script.onload = () => {
            console.log("Script loaded and ready");
            setTimeout(()=>this.setState({loading: false}), 1000);
            // console.log(window.KPayment)
            console.log(this.state);
            if(
                !this.state.memberExpiredAt ||
                moment().isAfter(this.state.memberExpiredAt , 'day') 
            ) {
                window.KPayment.create();
            }
            window.KPayment.onClose(function () {
                console.log("Script are close");
                appHandleCloseCallBack();
            });
        };
    }

    handleClick = () => {
        console.log('handleClick');
        /**
         * eg. disabled payment button
         */
        this.setState({disabledBtn: true})
        window.KPayment.show();
    }


    handleClose = () => {
        console.log('handleClose');
        /**
         * eg. enabled payment button
         */
        this.setState({disabledBtn: false})
    }

    paid = async() => {
        let update = await API.graphql(graphqlOperation(updateUser, {
            input: {
                id: this.state.userId,
                active: true,
                memberExpiredAt: moment().add(1,'years').format()
            }
        }))
        return update
    }


    handleSubmit = (event) => {
        console.log('handleSubmit');

        // Stop form redirect.
        event.preventDefault();
        console.log(event.target);
        // console.log('token :', event.target.token.value);
        // console.log('payment methods :', event.target.paymentMethods.value);
        
        // Call Your API
        let body = {
            amount: parseFloat(this.state.memberShipPrice),
            currency: 'THB',
            additional_data: {
                mid: this.dcc_number,
            },
            description: "Membership",
            source_type: "card",
            mode: "token",
            token: event.target.token.value,
            reference_order: moment().format('YYYYMMDDHHmmss'),
            ref_1: this.state.userId
        }

        if(event.target.dcc_currency) {
            body['dcc_data'] = {
                dcc_currency:event.target.dcc_currency.value
            }
        }


        API.post('kbank' , '/kPayment/charge' , {
            body: body
        })
        .then(async(response)=>{
            // console.log(response);
            window.location.href= response.result.redirect_url;
            // if(response.result.status === 'success') {
            //     let update = await this.paid();
            //     console.log(update);
            //     // window.location.reload();
            //     window.location.href = '/download';
            // }
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    render() {
        return <PaymentPage {...this.props} handleSubmit={this.handleSubmit} paymentForm={this.paymentForm} state={this.state} />;
    }
}