import isEqual from 'lodash.isequal';

// If areEqual is call, bindings have necessarily changed
export const areEqual = (prevProps, props) => {
	if (props.bindingsDependency) return false;
	if (props.response) return isEqual(prevProps.response, props.response);
	if (props.responses) return isEqual(prevProps.responses, props.responses);
	if (props.cells) return isEqual(prevProps.cells, props.cells);
	return true;
};