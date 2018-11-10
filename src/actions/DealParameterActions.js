export const DealParameterActions = {
  UPDATE_PARAMETER_AMOUNT: 'UPDATE_PARAMETER_AMOUNT',
  SET_PARAMETER_DERIVED: 'SET_PARAMETER_DERIVED',
  SET_PARAMETER_TYPE: 'SET_PARAMETER_TYPE',
  SET_MIN_MAX: 'SET_MIN_MAX'
}

export const updateParameterAmount = (parameterName, newValue) => ({
  type: DealParameterActions.UPDATE_PARAMETER_AMOUNT,
  parameterName,
  newValue
});

export const setParameterDerived = (parameterName, checked) => ({
  type: DealParameterActions.SET_PARAMETER_DERIVED,
  parameterName,
  checked
});

export const setParameterType = (parameterName, newType) => ({
  type: DealParameterActions.SET_PARAMETER_TYPE,
  parameterName,
  newType
});

export const setMinMax = (parameterName, min, max) => ({
  type: DealParameterActions.SET_MIN_MAX,
  parameterName,
  min,
  max
});