export const FundingMatrixActions = {
  ADD_FUNDING_MATRIX: 'ADD_FUNDING_MATRIX',
  DUPLICATE_FUNDING_MATRIX: 'DUPLICATE_FUNDING_MATRIX',
  CHANGE_FUNDING_MATRIX_NAME: 'CHANGE_FUNDING_MATRIX_NAME',
  DELETE_FUNDING_MATRIX: 'DELETE_FUNDING_MATRIX',
  ADD_FUNDING_OPTION: 'ADD_FUNDING_OPTION',
  DELETE_FUNDING_OPTION: 'DELETE_FUNDING_OPTION',
  MOVE_FUNDING_OPTION: 'MOVE_FUNDING_OPTION',
  UPDATE_FUNDING_OPTION_PARAM: 'UPDATE_FUNDING_OPTION_PARAM',
  SET_ACTIVE_INDEX: 'SET_ACTIVE_INDEX',
}

export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN'
}

export function addFundingMatrix() {
  return {
    type: FundingMatrixActions.ADD_FUNDING_MATRIX,
  };
}

export function duplicateFundingMatrix(fundingMatrixIndex) {
  return {
    type: FundingMatrixActions.DUPLICATE_FUNDING_MATRIX,
    fundingMatrixIndex
  }
}

export function changeFundingMatrixName(fundingMatrixIndex, name) {
  return {
    type: FundingMatrixActions.CHANGE_FUNDING_MATRIX_NAME,
    fundingMatrixIndex,
    name
  };
}

export function deleteFundingMatrix(fundingMatrixIndex) {
  return {
    type: FundingMatrixActions.DELETE_FUNDING_MATRIX,
    fundingMatrixIndex
  };
}

export function addFundingOption(fundingMatrixIndex) {
  return {
    type: FundingMatrixActions.ADD_FUNDING_OPTION,
    fundingMatrixIndex
  };
}

export function deleteFundingOption(fundingMatrixIndex, fundingOptionIndex) {
  return {
    type: FundingMatrixActions.DELETE_FUNDING_OPTION,
    fundingMatrixIndex, 
    fundingOptionIndex
  };
}

export function moveFundingOption(fundingMatrixIndex, fundingOptionIndex, direction) {
  return {
    type: FundingMatrixActions.MOVE_FUNDING_OPTION,
    fundingMatrixIndex, 
    fundingOptionIndex,
    direction
  };
}

export function updateFundingOptionParam(fundingMatrixIndex, fundingOptionIndex, paramName, value) {
  return {
    type: FundingMatrixActions.UPDATE_FUNDING_OPTION_PARAM,
    fundingMatrixIndex, 
    fundingOptionIndex,
    paramName,
    value
  };
}

export function setActiveIndex(newIndex) {
  return {
    type: FundingMatrixActions.SET_ACTIVE_INDEX,
    newIndex
  }
}