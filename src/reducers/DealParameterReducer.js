import update from 'immutability-helper';
import { createReducer } from './CreateReducer';
import { DealParameterActions } from '../actions/DealParameterActions';
import { AmountTypes } from '../model/Types';

const initialDealParametersState = {
  rent: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  arv: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  estimatedRepairs: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  cashOutlay: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  hoaFees: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  equityAfterRepairs: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  propertyManagement: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  repairsMaintenance: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  capitalExpenditures: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  vacancy: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined },
  taxes: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  insurance: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  purchasePrice: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  dollarPerSquareFoot: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  operatingExpenses: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  totalExpenses: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined, amountTypeToggleable: true },
  profitPerMonth: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  capRate: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined },
  noi: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  otherIncome: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  otherExpenses: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  cashOnCashRoi: { amount: undefined, amountType: AmountTypes.Percent, shouldDerive: false, min: undefined, max: undefined },
  debtService: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined },
  closingCosts: { amount: undefined, amountType: AmountTypes.Dollars, shouldDerive: false, min: undefined, max: undefined } // Maybe could be percent also, but currently wouldn't fit neatly
  // Maybe want IRR later?
};

const dealParameters = createReducer(initialDealParametersState, {
  [DealParameterActions.UPDATE_PARAMETER_AMOUNT]: (state, action) => {
    let newValue = action.newValue === undefined ? undefined : Number(action.newValue);
    return update(state, {
      [action.parameterName]: { amount: { $set: newValue } }
    });
  },
  [DealParameterActions.SET_PARAMETER_DERIVED]: (state, action) => {
    return update(state, {
      [action.parameterName]: { shouldDerive: { $set: action.checked } }
    });
  },
  [DealParameterActions.SET_PARAMETER_TYPE]: (state, action) => {
    return update(state, {
      [action.parameterName]: { amountType: { $set: action.newType } }
    });
  },
  [DealParameterActions.SET_MIN_MAX]: (state, action) => {
    let min = action.min === undefined ? undefined : Number(action.min);
    let max = action.max === undefined ? undefined : Number(action.max);
    return update(state, {
      [action.parameterName]: { min: { $set: min }, max: { $set: max } }
    });
  }
});

export default dealParameters;