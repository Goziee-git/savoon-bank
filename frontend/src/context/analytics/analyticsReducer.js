import {
  GET_ANALYTICS_DATA,
  ANALYTICS_ERROR,
  SET_ANALYTICS_LOADING,
  SET_DATE_RANGE,
  CLEAR_ANALYTICS
} from '../types';

const analyticsReducer = (state, action) => {
  switch (action.type) {
    case GET_ANALYTICS_DATA:
      return {
        ...state,
        analyticsData: action.payload,
        loading: false,
        error: null
      };
    case ANALYTICS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_ANALYTICS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload
      };
    case CLEAR_ANALYTICS:
      return {
        ...state,
        analyticsData: null,
        error: null,
        loading: false
      };
    default:
      return state;
  }
};

export default analyticsReducer;
