import { createReducer } from './CreateReducer';
// commented out until we use the actions, just to supress the warning.
//import { TimelineActions } from '../actions/TimelineActions';

const initialTimelinesState = {
};

const timelines = createReducer(initialTimelinesState, {
});

export default timelines;