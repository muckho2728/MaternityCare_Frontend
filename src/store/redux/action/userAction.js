
import { activeUserAPI, getAllUserAPI, getUserByIdAPI,updateUserAPI ,changePasswordByUserIdAPI} from '../../../apis/userAPI';
import { setListUser, setUser,setCurrentUser } from '../reducers/userReducer';

export const fetchUsersAction = () => {
  return async (dispatch) => {
    try {
      const res = await getAllUserAPI();
      dispatch(setListUser(res.data));
    } catch (error) {
      console.error("Failed to fetch users:", error.response ? error.response.data : error.message);
    }
  };
};

export const fetchUserByIdAction = (id) => {
  return async (dispatch) => {
    try {
      const res = await getUserByIdAPI(id);
      dispatch(setUser(res.data));
    } catch (error) {
      console.error(`Failed to fetch user with id ${id}:`, error.response ? error.response.data : error.message);
    }
  };
};
export const updateUserByIdAction = (id, data) => {
  return async (dispatch) => {
    try {
      const res = await updateUserAPI(id, data);
      dispatch(setCurrentUser(res.data));
    } catch (error) {
      console.error(`Failed to update user with id ${id}:`, error.response ? error.response.data : error.message);
    }
  };
};
export const activateUserAction = (id) => {
    return async (dispatch) => {
        try {
            await activeUserAPI(id);
            dispatch(fetchUsersAction());
        } catch (error) {
            console.error(`Failed to activate user with id ${id}:`, error.response ? error.response.data : error.message);
        }
    };
};

export const changePassworbyUserIdAction = (id, data) => {
  return async (dispatch) => {
      try {
          const res = await changePasswordByUserIdAPI(id, data);
          dispatch(setCurrentUser(res.data));
          return res; // Trả về response khi thành công
      } catch (error) {
          console.error(`Failed to change password user with id ${id}:`, error.response ? error.response.data : error.message);
          throw error; // Quan trọng: throw error để Promise reject
      }
  };
}