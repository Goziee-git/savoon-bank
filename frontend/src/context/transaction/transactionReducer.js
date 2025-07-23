import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  TRANSACTION_ERROR,
  SET_LOADING,
  CLEAR_TRANSACTIONS
} from '../types';

const transactionReducer = (state, action) => {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        loading: false
      };
    case TRANSACTION_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_TRANSACTIONS:
      return {
        ...state,
        transactions: [],
        loading: false
      };
    default:
      return state;
  }
};

export default transactionReducer;
