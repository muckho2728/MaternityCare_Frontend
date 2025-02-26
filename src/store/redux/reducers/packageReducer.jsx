const initialState = {
    packages: [],
    loading: false,
    error: null,
  };
  
  const packageReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PACKAGES_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_PACKAGES_SUCCESS':
        return { ...state, loading: false, packages: action.payload };
      case 'FETCH_PACKAGES_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default packageReducer;