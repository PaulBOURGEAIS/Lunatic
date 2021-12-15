import { interpret } from '@inseefr/trevas';

function isDataSet(result) {
	return result && typeof result === 'object' && result.dataPoints;
}

function extractDataSetResult(dataSet) {
	const { dataPoints } = dataSet;
	if (dataPoints) {
		const { result } = dataPoints;
		return result;
	}
	return undefined;
}

function executeVtl(expression, vtlBindings) {
	const result = interpret(expression, vtlBindings);
	if (isDataSet(result)) {
		return extractDataSetResult(result);
	}

	return result;
}

function executeExpression(vtlBindings, expression, features /* VTL, MD */) {
	if (expression) {
		try {
			if (features.includes('VTL')) {
				return executeVtl(expression, vtlBindings);
			}
			return expression;
		} catch (e) {
			// expression en erreur ou simple chaîne dee caractère
			if (process.env.NODE_ENV === 'development') {
				console.warn(`VTL error :  ${expression}`);
				console.warn(e);
			}
			return expression;
		}
		// TODO MD only for labels, not for filtering
	}
	return '';
}

export default executeExpression;
