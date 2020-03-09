
export default function registerCallback(resultStatus) {
    return {
      type: 'REGISTER_CALLBACK',
      payload: resultStatus,
    }
  };