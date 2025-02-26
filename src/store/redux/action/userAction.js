import { activeUserAPI, getAllUserAPI, getUserByIdAPI, updateUserAPI, changePasswordByUserIdAPI, getCurrentUserAPI, getPackagesAPI } from '../../../apis/userAPI';
import { setListUser, setUser, setCurrentUser } from '../reducers/userReducer';

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

export const fetchCurrentUserAction = () => {
  return async () => {
    try {
      const res = await getCurrentUserAPI();
      console.log("Current user:", res.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error.response ? error.response.data : error.message);
    }
  }
}

export const fetchUserByIdAction = (id) => {
  return async (dispatch) => {
    try {
      console.log("Fetching user by ID:", id);

      // Gọi API và lấy kết quả
      const response = await getUserByIdAPI(id);
      console.log("API Response:", response);

      // Kiểm tra response và response.data
      if (response ) {
        console.log("User data:", response);

        // Dispatch action với dữ liệu từ API
        dispatch(setUser(response));
      } else {
        console.error('Invalid response data:', response);
      }
    } catch (error) {
      // Xử lý lỗi chi tiết
      console.error(`Failed to fetch user by ID ${id}:`, error.response ? error.response.data : error.message, error);
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

export const fetchPackages = ()=>{
  return async (dispatch) => {
    try {
      const res = await getPackagesAPI();
      dispatch(setListUser(res.data));
    } catch (error) {
      console.error("Failed to fetch users:", error.response ? error.response.data : error.message);
    }
  };
}

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