import { notification } from 'antd';
import api from '../../../config/api';


export const fetchPackagesAction = () => async (dispatch) => {
  dispatch({ type: 'FETCH_PACKAGES_REQUEST' });
  try {
    const response = await api.get("packages") 
    console.log(response)
    dispatch({ type: 'FETCH_PACKAGES_SUCCESS', payload: response.data });
  } catch (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to fetch packages',
    });
    dispatch({ type: 'FETCH_PACKAGES_FAILURE', payload: error });
  }
};