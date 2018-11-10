import update from 'immutability-helper';
import { createReducer } from './CreateReducer';
import { BasicInfoActions } from '../actions/BasicInfoActions';

const initialBasicInfoState = {
  reportName: "",
  address: "",
  numUnits: "",
  bedBathCount: "",
  totalSqFt: "",
  crimeRating: "",
  schoolRating: "",
};

const basicInfo = createReducer(initialBasicInfoState, {
  [BasicInfoActions.UPDATE_BASIC_INFO_PARAM]: (state, action) => {
    return update(state, {
      [action.parameterName]: { amount: { $set: action.newValue } }
    });
  },
});

export default basicInfo;