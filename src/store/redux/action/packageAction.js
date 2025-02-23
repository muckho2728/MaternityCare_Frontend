import { notification } from 'antd';
import axios from 'axios';

export const fetchPackagesAction = () => async (dispatch) => {
  dispatch({ type: 'FETCH_PACKAGES_REQUEST' });
  try {
    const response = await axios.get('/api/packages'); 
    dispatch({ type: 'FETCH_PACKAGES_SUCCESS', payload: response.data });
  } catch (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to fetch packages',
    });
    dispatch({ type: 'FETCH_PACKAGES_FAILURE', payload: error });
  }
};