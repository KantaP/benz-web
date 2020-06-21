
import React from 'react';
import { 
    Button, 
    Form, 
    FormGroup, 
    Input, 
    Col , 
    Row,
    Alert ,
    Label
} from 'reactstrap';
import DatePicker from "react-datepicker";
import { signup , signIn  , signout} from '../../../api/aws/cognito';
import { API , graphqlOperation } from 'aws-amplify'; 
import { createUser } from '../../graphql/mutations';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import changwats from '../../json/changwats';
import amphoes from '../../json/amphoes';

const styles = {
    option: {
        backgroundColor:'#fff',
        color:'#000'
    },
    customInput: (required) => {
        if(!required) {
            return {
                backgroundColor:'transparent',
                border:0,
                borderRadius: 0,
                borderBottom:'1px solid #cccccc',
                color:'#fff',
            }
        } 
        return {
            backgroundColor:'transparent',
            border:0,
            borderRadius: 0,
            borderBottom:'1px solid red',
            color:'#fff',
        }
    }
}





export class RegisterForm extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        mobilePhone: '',
        amgId: '',
        amgModel: '',
        amgModelOther: '',
        amgShowroom: '',
        birthDate: '',
        citizenId: '',
        address: '',
        district: '',
        province: '',
        memberShipPrice: 0,
        // password: '',
        // confirmPassword: '',
        dateInputType: 'text',
        submit: false ,
        error: '',
        loading: false ,
        changwats: changwats,
        amphoes: [],
        birthDatePicker: '',
        accept: false,
        selectMonth: '',
        selectDay: '',
        selectYear: '',
        showrooms: [
            'TTC Motor',
            'TTC Motor Ubon',
            'Star Flag',
            'BKK Kanchanaphisek',
            'Benz Rajchakru',
            'Thonburi Phanich (Lumpini)',
            'Primus Autohaus',
            'Benz Phuket',
            'Thonburi Phanich (NWW)',
            'Thonburi Phanich (RDN)',
            'Thonglor Group',
            'BKK Vipawadee',
            'Benz Talingchan',
            'TST Mercedes-Benz',
            'Benz Rajchakru Co.,Ltd.',
            'Metro Autohaus',
            'Benz BKK Group',
            'ATTA Autohaus',
            // 'Thonburi Phanich Co., Ltd. (Lumpini)',
            // 'Metro Autohaus Co.,Ltd. (Ngam Wong Wan)',
            // 'Star Flag Co.,Ltd.',
            // 'Thonglor Group Co., Ltd.',
            // 'TTC Motor Co., Ltd.',
            // 'Benz Talingchan Co., Ltd.',
            // 'Benz BKK Group Co. Ltd.',
            // 'Benz BKK Vipawadee Co. Ltd.',
            // 'BKK Autohaus Kanchanapisek Co.,Ltd.',
            // 'Benz Praram 3 Co., Ltd.',
            // 'Suanluang Autohaus Co., Ltd.',
            // "MB Ramintra Co. Ltd",
            // 'Mbs Auto Centre Co., Ltd. (Rama2)',
            // 'Bhanthavee Auto Master Ltd.',
            // 'Chitchai Chonburi Co., Ltd.',
            // 'MB Pattaya Autohaus Co., Ltd.',
            // 'MaxCrane Machinery Co., Ltd.',
            // 'Asia Truck Co.,Ltd.',
            // 'Benz Petcharat Co., Ltd.',
            // 'TST Mercedes-Benz Co., Ltd.',
            // 'Keng Hong Thong Co., Ltd.',
            // 'Chance Inter Group Co.,Ltd.',
            // 'Viriyah Cars Body Service Co., Ltd.'
        ],
        carModels: [
            {
                label: 'Mercedes-AMG C 43 4MATIC',
                value: 'Mercedes-AMG C 43 4MATIC',
                price: 20000
            },
            {
                label: 'Mercedes-AMG E 53 4MATIC+',
                value: 'Mercedes-AMG E 53 4MATIC+',
                price: 20000
            },
            {
                label: 'Mercedes-AMG E 63 S 4MATIC+',
                value: 'Mercedes-AMG E 63 S 4MATIC+',
                price: 30000
            },
            {
                label: 'Mercedes-AMG C 43 4MATIC Coupé',
                value: 'Mercedes-AMG C 43 4MATIC Coupé',
                price: 20000
            },
            {
                label: 'Mercedes-AMG C 63 S Coupé',
                value: 'Mercedes-AMG C 63 S Coupé',
                price: 30000
            },
            {
                label: 'Mercedes-AMG CLA 45 4MATIC',
                value: 'Mercedes-AMG CLA 45 4MATIC',
                price: 30000
            },
            {
                label: 'Mercedes-AMG CLS 53 4MATIC+',
                value: 'Mercedes-AMG CLS 53 4MATIC+',
                price: 20000
            },
            {
                label: 'Mercedes-AMG E 53 4MATIC+ Coupé',
                value: 'Mercedes-AMG E 53 4MATIC+ Coupé',
                price: 20000
            },
            {
                label: 'Mercedes-AMG GLE 43 4MATIC Coupé',
                value: 'Mercedes-AMG GLE 43 4MATIC Coupé',
                price: 20000
            },
            {
                label: 'Mercedes-AMG GT 53 4MATIC+ 4-Door Coupé',
                value: 'Mercedes-AMG GT 53 4MATIC+ 4-Door Coupé',
                price: 20000
            },
            // {
            //     label: 'Mercedes-AMG GT R Coupé',
            //     value: 'Mercedes-AMG GT R Coupé'
            // },
            {
                label: 'Mercedes-AMG G 63',
                value: 'Mercedes-AMG G 63',
                price: 30000
            },
            {
                label: 'Mercedes-AMG GT C Roadster',
                value: 'Mercedes-AMG GT C Roadster',
                price: 30000
            },
            {
                label: 'Mercedes-AMG SLC 43',
                value: 'Mercedes-AMG SLC 43',
                price: 20000
            },
            {
                label: 'Mercedes-AMG A 45 4MATIC',
                value: 'Mercedes-AMG A 45 4MATIC',
                price: 30000
            },
            {
                label: 'Mercedes-AMG GLA 45 4MATIC',
                value: 'Mercedes-AMG GLA 45 4MATIC',
                price: 30000
            },
            {
                label: 'Mercedes-AMG C 63 S Coupe',
                value: 'Mercedes-AMG C 63 S Coupe',
                price: 30000
            },
            {
                label: 'Mercedes-AMG GT 63 s 4MATIC+ 4-Door Coupe',
                value: 'Mercedes-AMG GT 63 s 4MATIC+ 4-Door Coupe',
                price: 30000
            },
            {
                label: 'Mercedes-AMG GT S',
                value: 'Mercedes-AMG GT S',
                price: 30000
            },
            {
                label: 'Mercedes-AMG  GT R',
                value: 'Mercedes-AMG  GT R',
                price: 30000
            }
        ]
    }

    requiredFields = [
        'firstName',
        'lastName',
        'email',
        'amgId',
        'amgModel',
        // 'amgModelOther',
        'amgShowroom',
        // 'accept',
        // 'selectDay',
        // 'selectMonth',
        // 'selectYear'
        // 'password',
        // 'confirmPassword'
    ]

    onSelectProvince = (pid) => {
        // console.log(pid);
        if(pid) {
            const filterAmphoes = amphoes.filter((item)=>item.changwat_pid === pid);
            // console.log(filterAmphoes);
            this.setState(state=>{
                state.province = this.state.changwats.filter((item)=>item.pid === pid)[0].name;
                state.amphoes =  filterAmphoes;
                state.district = ""
                return state;
            })
        } else {
            this.setState(state=>{
                state.province = "";
                state.amphoes =  [];
                state.district = ""
                return state;
            })
        }
        
    }

    onSelectDistrict = (districtId) => {
        if(districtId) {
            this.setState(state=>{
                state.district = this.state.amphoes.filter((item)=>item.pid === districtId)[0].name
                return state;
            })
        } else {
            this.setState(state=>{
                state.district = ""
                return state;
            })
        }
    }



    onSignUp = async() => {

        // if(!this.state.accept) return;
        await this.setState({submit: true , error: '' });

        for(let field of this.requiredFields) {
            if(!this.state[field]) {
                return;
            }
        }
        
        if(this.state.password.length < 8) {
            this.setState({error:'Password required minimun 8 characters.'});
            return;
        }

        if(this.state.password !== this.state.confirmPassword) {
            // console.log('Password and confirm password should be same.');
            this.setState({error:'Password and confirm password should be same.'});
            return;
        }

        if(!this.state.accept) {
            this.setState({error:'Please accept term of the AMG Club Thailand Agreement'});
            return;
        }

        if(!this.checkCitizenID()) {
            this.setState({error:'Citizen ID is incorrect'});
            return;
        }

        if(!this.ValidateEmail()) {
            this.setState({error:'Email is incorrect'});
            return;
        }

    
        await this.setState({loading: true})
        // try {
            let error = '';
            let { 
                dateInputType , 
                submit , 
                loading  , 
                password , 
                confirmPassword , 
                carModels,
                amgModelOther ,
                showrooms,
                changwats,
                amphoes,
                birthDatePicker, 
                selectDay,
                selectMonth,
                selectYear,
                accept,
                ...userItem 
            } = this.state;

            if(userItem.amgModel === 'other') {
                if(!amgModelOther) {
                    return;
                }
                userItem.amgModel = 'other_' + amgModelOther;
            }
            let birthDate = null; 
            if(this.state.selectYear && this.state.selectMonth && this.state.selectMonth) {
                birthDate = moment(`${this.state.selectYear}-${this.state.selectMonth}-${this.state.selectDay}`, 'YYYY-MMMM-DD').format('YYYY-MM-DD');
            }
            let cogParams = {
                email: userItem.email,
                name: userItem.firstName,
                family_name: userItem.lastName,
                password: password
            }
            let user = null
            try {
                user = await signup(cogParams);
            }catch(error) {
                error = error.message;
            }
            if(typeof user === 'string') {
                error = user;
                if(user === 'UsernameExistsException') {
                    error = "Your email has been already used. Please try another.";
                }
                // return;
            }
            // console.log('add cognito user' , user);
            if(user !== null && user && typeof user === 'object') {
                // login for add user profile
                try {
                    const userLoggin = await signIn({username: userItem.email, password: password});
                    // console.log('user logged' , userLoggin)
                    let addParams = {
                        id: user.userSub ,
                        level: 'user' 
                    }
                    if(birthDate !== null) {
                        addParams.birthDate = birthDate
                    }
                    let addUserItem = Object.assign({} , userItem, addParams)
                    let newAddUserItem = Object.keys(addUserItem).reduce((object, key) => {
                        if (addUserItem[key]) {
                            object[key] = addUserItem[key];
                        }
                        return object
                    }, {});

                    newAddUserItem.firstLogin = false;

                    // console.log(newAddUserItem);
                    const userProfile = await API.graphql(graphqlOperation(createUser,{input: newAddUserItem}));

                    // console.log('add to database' , userProfile)
                    await signout();
                    
                    
                    // window.location.href = '/signup/thankyou';
                    window.location.href = '/signup/thankyou';
                }catch(error) {
                    console.log(error)
                    error = error.message;
                }
                
            }
            await this.setState({error});
            setTimeout(()=>{
                this.setState({loading: false})
            },1000)
        // }catch(error) {
        //     console.log(error);
        //     this.setState({error:error.message});
        //     setTimeout(()=>{
        //         this.setState({loading: false})
        //     },1000)
        //     return;
        // }
    }

    sortByMonthName = (monthNames, isReverse = false) => {
        const referenceMonthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const directionFactor = isReverse ? -1 : 1;
        const comparator = (a, b) => {
          if (!a && !b) return 0;
          if (!a && b) return -1 * directionFactor;
          if (a && !b) return 1 * directionFactor;
      
          const comparableA = a.toLowerCase().substring(0, 3);
          const comparableB = b.toLowerCase().substring(0, 3);
          const comparisonResult = referenceMonthNames.indexOf(comparableA) - referenceMonthNames.indexOf(comparableB);
          return comparisonResult * directionFactor;
        };
        const safeCopyMonthNames = [...monthNames];
        safeCopyMonthNames.sort(comparator);
        return safeCopyMonthNames;
      }

    YEARS = () => {
        const years = []
        const dateStart = moment()
        const dateEnd = moment().subtract(90, 'y')
        while (dateStart.diff(dateEnd, 'years') >= 0) {
          years.push(dateStart.format('YYYY'))
          dateStart.subtract(1, 'year')
        }
        return years
    }
    // const MONTHS = () => {
    //     const months = []
    //     const dateStart = moment()
    //     const dateEnd = moment().add(12, 'month')
    //     while (dateEnd.diff(dateStart, 'months') >= 0) {
    //         months.push(dateStart.format('MMMM'))
    //         dateStart.add(1, 'month')
    //     }
    //     return sortByMonthName(months)
    // }
    MONTHS = () => ["January" , "Febuary" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"]; 
    DAYS = () => {
        const days = []
        const dateStart = (this.state.selectMonth) ? moment(this.state.selectMonth , 'MMMM').startOf('month') : moment("January", 'MMMM').startOf('month'); 
        const dateEnd =  (this.state.selectMonth) ? moment(this.state.selectMonth , 'MMMM').endOf('month') : moment("January", 'MMMM').endOf('month');  
        // console.log('date start' ,dateStart)
        // console.log('date dateEnd' ,dateEnd)
        // console.log('before' , dateStart.isBefore(dateEnd));
        for(let i = dateStart; i.isBefore(dateEnd); i.add(1 , 'day')) {
            // console.log(i);
            days.push(i.format('DD'))
        }
        return days
    }
    
    checkCitizenID() {
        if(this.state.citizenId.length > 0 && this.state.citizenId.length < 13) return false;
        else if(this.state.citizenId.length === 13){
            var x = new String(this.state.citizenId);
            var splitext = x.split("");
            var total = 0;
            var mul = 13;
            for(var i=0;i<splitext.length-1;i++) {
                total = total + splitext[i] * mul;
                mul = mul -1;
            }
            var mod = total % 11;
            var nsub = 11 - mod;
            var mod2 = nsub % 10;
            // console.log('mod2' , mod2);
            // console.log('last text' , splitext[12])
            if(mod2!=splitext[12])
                return false;
            else
                return true;
        } else if(this.state.citizenId.length === 0){
            return true;
        }
    }

    ValidateEmail() 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))
        {
            return (true)
        }
            
            return (false)
    }

    render() {
        let nameValidator = (this.state.submit && !this.state.firstName) ? true : false;
        let lastnameValidator = (this.state.submit && !this.state.lastName) ? true : false;
        let birthDateValidator = (this.state.submit && !this.state.birthDate) ? true : false;
        // let selectDayValidator = (this.state.submit && !this.state.selectDay) ? true : false;
        // let selectMonthValidator = (this.state.submit && !this.state.selectMonth) ? true : false;
        // let selectYearValidator = (this.state.submit && !this.state.selectYear) ? true : false;
        let emailValidator = (this.state.submit && !this.state.email) ? true : false;
        let passwordValidator = (this.state.submit && !this.state.password) ? true : false;
        let confirmPasswordValidator = (this.state.submit && !this.state.confirmPassword) ? true : false;
        let amgIdValidator = (this.state.submit && !this.state.amgId) ? true : false;
        let amgModelValidator = (this.state.submit && !this.state.amgModel) ? true : false;
        let amgShowroomValidator = (this.state.submit && !this.state.amgShowroom) ? true : false;
        let amgAccept = (this.state.submit && !this.state.accept) ? true : false;
        let amgModelOtherValidator = (
            this.state.submit && 
            !this.state.amgModelOther && 
            this.state.amgModel === 'other'
        ) ? true : false
        // let citizenValidator = (this.state.submit && !this.checkCitizenID()) ? true: false
       
           
        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner
                text='Signing up...'
            >
            <Form>
                {
                    (this.state.submit && this.state.error) &&
                    (
                        <Row style={{marginBottom: 10}}>
                            <Alert color="danger" style={{flex: 1}} >
                                {this.state.error}
                            </Alert>
                        </Row>
                    )
                }
                <Row form>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="name" 
                                id="userFirstname" 
                                placeholder="NAME *" 
                                style={styles.customInput(nameValidator)}
                                onChange={(e)=>{
                                    this.state.firstName = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="lastname" 
                                id="userLastname" 
                                placeholder="LAST NAME *" 
                                style={styles.customInput(lastnameValidator)}
                                onChange={(e)=>{
                                    this.state.lastName = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
        
                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="email" 
                                name="email" 
                                id="userEmail" 
                                placeholder="EMAIL *" 
                                style={styles.customInput(emailValidator)}
                                onChange={(e)=>{
                                    this.state.email = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="tel" 
                                id="userTelephone" 
                                placeholder="TEL" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.state.mobilePhone = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="password" 
                                name="password" 
                                id="userPassword" 
                                placeholder="PASSWORD *" 
                                style={styles.customInput(passwordValidator)}
                                onChange={(e)=>{
                                    this.state.password = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="password" 
                                name="confirmPassword" 
                                id="userComfirmPassword" 
                                placeholder="CONFIRM PASSWORD *" 
                                style={styles.customInput(confirmPasswordValidator)}
                                onChange={(e)=>{
                                    this.state.confirmPassword = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form style={{marginTop: 3}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <p style={{color:'#fff' , fontSize: 12}}>* Password minimum length 8</p>
                    </Col>
                </Row>
        
                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            
                            {/* <DatePicker
                                placeholderText="BIRTH DATE *"
                                selected={this.state.birthDatePicker}
                                showMonthDropdown
                                showYearDropdown
                                className={`form-control custom_input_2 ${birthDateValidator ? 'error' : ''}`}
                                onChange={(date)=>{
                                    console.log(date)
                                    this.setState({
                                        birthDate : moment(date).format('YYYY-MM-DD'),
                                        birthDatePicker: date
                                    });
                                }}
                            /> */}
                            <label>Birth Date</label>
                            <Row>
                                <Input type="select" 
                                style={{...{width: 100} , ...styles.customInput()}} 
                                name="selectDay" 
                                id="selectDay"
                                onChange={(e)=>{
                                    this.setState({selectDay: e.target.value});
                                }}
                                >
                                     <option value="">Day</option>
                                    {
                                       this.DAYS().map((item , index)=>(
                                        <option  key={index} value={item}>{item}</option>
                                       ))
                                    }
                                </Input>
                                <Input 
                                type="select" 
                                style={{...{width: 100} , ...styles.customInput()}} 
                                name="selectMonth" 
                                id="selectDay"
                                onChange={(e)=>{
                                    this.setState({selectMonth: e.target.value});
                                    
                                }}
                                >
                                    <option value="">Month</option>
                                    {
                                       this.MONTHS().map((item , index)=>(
                                        <option key={index} value={item}>{item}</option>
                                       ))
                                    }
                                </Input>
                                <Input 
                                type="select" 
                                style={{...{width: 100} , ...styles.customInput()}} 
                                name="selectYear" 
                                id="selectDay"
                                onChange={(e)=>{
                                    this.setState({selectYear: e.target.value});
                                }}
                                >
                                    <option value="">Year</option>
                                   {
                                       this.YEARS().map((item , index )=>(
                                        <option  key={index} value={item}>{item}</option>
                                       ))
                                   }
                                </Input>
                            </Row>
                            
                        </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="citizenId" 
                                id="userCitizenId" 
                                placeholder="CITIZEN ID" 
                                style={styles.customInput()}
                                onChange={(e)=>{
                                    this.state.citizenId = e.target.value;
                                }}
                                maxLength="13"
                            
                            />
                        </FormGroup>
                    </Col>
                </Row>
        
                <Row form style={{marginTop: 20}}>
                    <Col lg="12" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="address" 
                                id="userAddress" 
                                placeholder="ADDRESS" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.state.address = e.target.value;
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
        
                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            {/* <Input 
                                type="text" 
                                name="province" 
                                id="userProvince" 
                                placeholder="PROVINCE" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.state.province = e.target.value;
                                }}
                            /> */}
                            <Input 
                                type="select" 
                                name="province" 
                                placeholder="Province" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.onSelectProvince(e.target.value);
                                    
                                    // this.setState({amgModel: e.target.value})
                                    // this.state.amgModel = e.target.value;
                                }}
                            >
                                <option style={styles.option} value="">PROVINCE</option>
                                {
                                    this.state.changwats.sort((a,b)=>a.name > b.name).map((item , index)=>(
                                        <option style={styles.option} key={index} value={item.pid}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            {/* <Input 
                                type="text" 
                                name="district" 
                                id="userDistrict" 
                                placeholder="DISTRICT" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.state.district = e.target.value;
                                }}
                            /> */}
                            <Input 
                                type="select" 
                                name="district" 
                                placeholder="district" 
                                style={styles.customInput(false)}
                                onChange={(e)=>{
                                    this.onSelectDistrict(e.target.value);
                                    
                                    // this.setState({amgModel: e.target.value})
                                    // this.state.amgModel = e.target.value;
                                }}
                            >
                                <option style={styles.option} value="">DISTRICT</option>
                                {
                                    this.state.amphoes.sort((a,b)=>a.name > b.name).map((item , index)=>(
                                        <option style={styles.option} key={index} value={item.pid}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                
        
                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="select" 
                                name="model" 
                                id="userAmgModel" 
                                placeholder="Model" 
                                style={styles.customInput(amgModelValidator)}
                                onChange={(e)=>{
                                    let price = 0;
                                    if(e.target.value === 'other') {
                                        price = 30000;
                                    } else {
                                        price = this.state.carModels.filter((item)=>item.label === e.target.value)[0].price;
                                    }
                                    this.setState({amgModel: e.target.value , memberShipPrice : price})
                                    // this.state.amgModel = e.target.value;
                                }}
                            >
                                <option style={styles.option} value="">MODEL *</option>
                                {
                                    this.state.carModels.map((item , index)=>(
                                        <option style={styles.option} key={index} value={item.value}>{item.label}</option>
                                    ))
                                }
                                <option style={styles.option} value="other">Other</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    {
                        (this.state.amgModel.includes('other')) &&
                        (
                            <Col xs="12" md="6" lg="6" sm="12">
                                <FormGroup>
                                    <Input 
                                        type="text" 
                                        placeholder="YOUR AMG MODEL" 
                                        style={styles.customInput(amgModelOtherValidator)}
                                        onChange={(e)=>{ 
                                            this.setState({amgModelOther: e.target.value});
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        )
                    }
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="text" 
                                name="amgId" 
                                id="userAmgId" 
                                placeholder="AMG CHASIS NO. *" 
                                style={styles.customInput(amgIdValidator)}
                                onChange={(e)=>{
                                
                                    this.state.amgId = e.target.value;
                                }}
                                maxLength="17"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row form style={{marginTop: 20}}>
                    <Col xs="12" md="6" lg="6" sm="12">
                        <FormGroup>
                            <Input 
                                type="select" 
                                name="showroom" 
                                id="userAmgShowroom" 
                                style={styles.customInput(amgShowroomValidator)}
                                onChange={(e)=>{
                                    console.log(e.target.value)
                                    this.state.amgShowroom = e.target.value;
                                }}
                            >
                                <option style={styles.option} value="">AMG SHOWROOM *</option>
                                {
                                    this.state.showrooms.map((item , index)=>(
                                        <option style={styles.option} key={index} value={item}>{item}</option>
                                    ))
                                }
                                <option style={styles.option} value="other">Other</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row style={{marginTop: 20 , padding: 5 , justifyContent: 'center' , alignItems:'center'}}>
                    <FormGroup check>
                        <Label check>
                        <Input 
                        type="checkbox" 
                        onChange={(e)=>{
                            // console.log(e.target.checked);
                            this.setState({accept: e.target.checked});
                        }} />{' '}
                          I have read and agree to the terms of the AMG Club Thailand Agreement.
                          <a target="_blank" href="https://resources-static.s3-ap-southeast-1.amazonaws.com/pdf/AMG+T_C.pdf">Read the agreement here</a>
                        </Label>
                    </FormGroup>
                </Row>

                <Row style={{marginTop: 20 , padding: 5 , justifyContent: 'center' , alignItems:'center'}}>
                    <Button
                    onClick={this.onSignUp}
                    type="button"
                    style={{
                        backgroundColor:'transparent',
                        border:'1px solid #ffffff',
                        width: '120px',
                        height: '50px'
                    }}>
                        SUBMIT
                    </Button>
                </Row>
            </Form>
            </LoadingOverlay>
        )
    }
}