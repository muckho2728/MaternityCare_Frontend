import api from '../../../config/api';

export const fetchTransactions = () => async (dispatch) => {
  dispatch({ type: 'FETCH_TRANSACTIONS_REQUEST' });
  try {
    const response = await api.get('transactions');
    dispatch({ type: 'FETCH_TRANSACTIONS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_TRANSACTIONS_FAILURE', payload: error.message });
  }
};

export const updateTransaction = (id, data) => async (dispatch) => {
  dispatch({ type: 'UPDATE_TRANSACTION_REQUEST' });
  try {
    const response = await api.put(`transactions/${id}`, data);
    dispatch({ type: 'UPDATE_TRANSACTION_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'UPDATE_TRANSACTION_FAILURE', payload: error.message });
  }
};

export const fetchTransactionById = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_TRANSACTION_BY_ID_REQUEST' });
  try {
    const response = await api.get(`transactions/${id}`);
    dispatch({ type: 'FETCH_TRANSACTION_BY_ID_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_TRANSACTION_BY_ID_FAILURE', payload: error.message });
  }
};