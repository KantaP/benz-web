
import _ from 'lodash';

export const stateChange = function(key , value) {
    this.setState((state)=>{
        state[key] = value;
        return state;
    })
}

export const isNull = function(value) {
    if(_.isNull(value) || value === 'null' || !value) return true;
    return false;
}

export const getProperty = ( propertyName, object ) => {
    var parts = propertyName.split( "." ),
      length = parts.length,
      i,
      property = object || this;
  
    for ( i = 0; i < length; i++ ) {
      if(!isNull(property[parts[i]])) property = property[parts[i]];
      else property = '';
    }
  
    return property;
  }


export const send = ({to , title = "" , body = "" , data = {}}) => {
    return fetch(`https://exp.host/--/api/v2/push/send` , {
        headers: {
            'host': 'exp.host',
            'accept' : 'application/json',
            'accept-encoding': 'gzip, deflate',
            'content-type': 'application/json'
        },
        mode:'no-cors',
        method: 'POST' ,
        body: JSON.stringify({to , title , body , data ,sound: "default", priority: "high"})
    })
}