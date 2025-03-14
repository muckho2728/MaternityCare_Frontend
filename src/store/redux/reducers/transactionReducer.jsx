const initialState = {
    listTransaction: [],
    transaction: null,
    loading: false,
    error: null,
  };
  
  const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_TRANSACTIONS_REQUEST':
      case 'UPDATE_TRANSACTION_REQUEST':
      case 'FETCH_TRANSACTION_BY_ID_REQUEST':
        return { ...state, loading: true };
  
      case 'FETCH_TRANSACTIONS_SUCCESS':
        return { ...state, loading: false, listTransaction: action.payload };
  
      case 'UPDATE_TRANSACTION_SUCCESS':
      case 'FETCH_TRANSACTION_BY_ID_SUCCESS':
        return { ...state, loading: false, transaction: action.payload };
  
      case 'FETCH_TRANSACTIONS_FAILURE':
      case 'UPDATE_TRANSACTION_FAILURE':
      case 'FETCH_TRANSACTION_BY_ID_FAILURE':
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default transactionReducer;