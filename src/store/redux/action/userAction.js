import { activeUserAPI, getAllUserAPI, getUserByIdAPI, updateUserAPI, changePasswordByUserIdAPI, getCurrentUserAPI, getAllUserPaginationAPI } from '../../../config/userAPI';
import { setListUser, setUser, setCurrentUser, setTotalElements } from '../reducers/userReducer';

export const fetchUsersAction = (pageNumber,pageSize) => {
  return async (dispatch) => {
    try {
      console.log(pageNumber)
      console.log(pageSize)
      const res = await getAllUserPaginationAPI(pageNumber , pageSize);
      console.log(res)
      dispatch(setListUser(res.data));
      console.log(res.pagination.totalElements)
      dispatch(setTotalElements(res.pagination.totalElements))
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
export const activateUserAction = ({ id, isActive }) => {
  return async (dispatch) => {
    try {
      await activeUserAPI(id, { isActive });
      dispatch(fetchUsersAction()); 
    } catch (error) {
      console.error(`Failed to ${isActive ? 'activate' : 'deactivate'} user with id ${id}:`, error.response ? error.response.data : error.message);
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