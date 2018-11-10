import update from 'immutability-helper';
import { createReducer } from './CreateReducer';
import { AmountTypes } from '../model/Types';
import { FundingMatrixActions, Direction } from '../actions/FundingMatrixActions';

const initialFundingMatricesState = [{ 
  name: "All Cash", 
  fundingOptions: [{ name: "Cash on hand", amortizationPeriod: undefined, interest: 0, amount: 100, amountType: AmountTypes.Percent, isCash: true }],
}];

const fundingMatrices = createReducer(initialFundingMatricesState, {
  [FundingMatrixActions.ADD_FUNDING_MATRIX]: (state, action) => {
    return update(state, {
      $push: [{ 
        name: "All Cash", 
        fundingOptions: [{ name: "Cash on hand", amortizationPeriod: undefined, interest: 0, amount: 100, amountType: AmountTypes.Percent, isCash: true }] 
      }]
    });
  },

  [FundingMatrixActions.DUPLICATE_FUNDING_MATRIX]: (state, action) => {
    return update(state, {
      $push: [update(state[action.fundingMatrixIndex], {})]
    });
  },
  
  [FundingMatrixActions.CHANGE_FUNDING_MATRIX_NAME]: (state, action) => {
    return update(state, {
      [action.fundingMatrixIndex]: { name: { $set: action.name } }
    });
  },

  // Need to update active index
  [FundingMatrixActions.DELETE_FUNDING_MATRIX]: (state, action) => {
    return update(state, {
      $splice: [[action.fundingMatrixIndex, 1]]
    });
  },

  [FundingMatrixActions.ADD_FUNDING_OPTION]: (state, action) => {
    return update(state, {
      [action.fundingMatrixIndex]: { fundingOptions: { $push: [{ 
        name: "Cash on hand", amortizationPeriod: undefined, interest: 0, amount: 100, amountType: AmountTypes.Percent, isCash: true 
      }] } }
    });
  },

  [FundingMatrixActions.DELETE_FUNDING_OPTION]: (state, action) => {
    return update(state, {
      [action.fundingMatrixIndex]: { fundingOptions: { $splice: [[action.fundingOptionIndex, 1]] } }
    });
  },

  [FundingMatrixActions.MOVE_FUNDING_OPTION]: (state, action) => {
    let offset = action.direction === Direction.UP ? -1 : 1;
    let newIndex = action.fundingOptionIndex + offset;
    if (newIndex >= state[action.fundingMatrixIndex].length || newIndex < 0) {
      return state;
    }

    let tempOption = state[action.fundingMatrixIndex].fundingOptions[action.fundingOptionIndex];
    let intermediateState = update(state, {
      [action.fundingMatrixIndex]: { fundingOptions: { $splice: [[action.fundingOptionIndex, 1]] } }
    });

    intermediateState[action.fundingMatrixIndex].fundingOptions.splice(newIndex, 0, tempOption);

    return intermediateState;
  },

  [FundingMatrixActions.UPDATE_FUNDING_OPTION_PARAM]: (state, action) => {
    return update(state, {
      [action.fundingMatrixIndex]: { fundingOptions: { [action.fundingOptionIndex]: { [action.paramName]: { $set: action.value } } } }
    });
  },
});

export const activeFundingMatrixIndex = createReducer(0, {
  [FundingMatrixActions.SET_ACTIVE_INDEX]: (state, action) => {
    return action.newIndex;
  },
});

export default fundingMatrices;