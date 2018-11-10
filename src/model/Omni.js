import { combineReducers } from 'redux';
import basicInfo from '../reducers/BasicInfoReducer';
import timelines from '../reducers/TimelineReducer';
import fundingMatrices, { activeFundingMatrixIndex } from '../reducers/FundingMatrixReducer';
import dealParameters from '../reducers/DealParameterReducer';

const omni = combineReducers({
  basicInfo,
  timelines,
  fundingMatrices,
  dealParameters,
  activeFundingMatrixIndex
});

export default omni;