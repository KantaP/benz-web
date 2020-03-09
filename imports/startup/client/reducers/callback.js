
const initialState = {
    registerCallback: false
}

export default function callback(state = initialState , action = {}) {
    switch (action.type) {
      case 'REGISTER_CALLBACK':
        return Object.assign({} , state , {
            registerCallback: action.payload
        });
      default:
        return state;
    }
  }