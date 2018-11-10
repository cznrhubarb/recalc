export const BasicInfoActions = {
  UPDATE_BASIC_INFO_PARAM: 'UPDATE_BASIC_INFO_PARAM',
}

export function updateBasicInfoParam(parameterName, newValue) {
  return {
    type: BasicInfoActions.UPDATE_BASIC_INFO_PARAM,
    parameterName,
    newValue
  };
}