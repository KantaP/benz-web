import React ,  { useState , useEffect } from 'react' ;
import { 
    Row
} from 'reactstrap';
import { getUser } from '../graphql/queries';
import { API , graphqlOperation } from 'aws-amplify';
function UserRow(props) {

    const [userData, setUserData] = useState({});

    const getUserData = async() => {
        try {
            if(props.userId) {
                let result = await API.graphql(graphqlOperation(getUser, {id: props.userId}));
                setUserData(result.data.getUser);
            }
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getUserData();
    }, [])

    return (
        <Row style={{padding: 10, margin: 10}}>
            <p>
                <i className="fa fa-user"></i> {userData.firstName} {userData.lastName}
            </p>
        </Row>
    )
}

export default UserRow;