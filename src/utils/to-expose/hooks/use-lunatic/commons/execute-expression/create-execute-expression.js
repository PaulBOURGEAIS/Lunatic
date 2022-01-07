import executeExpression from './execute-expression';

function getVtlCompatibleValue(value) {
	if (value === undefined) {
		return null;
	}
	if (Array.isArray(value)) {
		return {
			dataStructure: { result: {} },
			dataPoints: {
				result: value,
			},
		};
	}

	return value;
}

function createBindings(variables) {
	return Object.entries(variables).reduce(function (
		bindings,
		[name, { value }]
	) {
		return { ...bindings, [name]: value };
	},
	{});
}

/**
 *
 * @param {*} variables
 * @param {*} features
 * @returns
 */
function createExecuteExpression(variables, features) {
	// on aimerait map d'expression, avec les bindings
	const bindings = createBindings(variables);
	const expressionsMap = new Map();
	const toRefreshVariables = new Map(); // variables calculées dépendantes d'une variable modifiée.
	// à l'init, on y colle toutes les variables de calcul
	Object.values(variables).forEach(function ({ variable }) {
		const { variableType, name } = variable;
		if (variableType === 'CALCULATED') {
			toRefreshVariables.set(name, variable);
		}
	});
	/**
	 *
	 * @param {*} name
	 * @param {*} value
	 */
	function updateBindings(name, value) {
		// update des bindings
		if (name in bindings) {
			bindings[name] = value;
		}
		// enrichissement des variables à rafraîchir
		const { CalculatedLinked = [] } = variables[name];

		CalculatedLinked.forEach(function (variable) {
			const { name } = variable;
			toRefreshVariables.set(name, variable);
		});
	}

	/**/

	function collecteVariables(dependencies, variables) {
		if (Array.isArray(dependencies)) {
			return dependencies.reduce(function (map, name) {
				if (name in variables) {
					const data = variables[name];
					const { variable, type } = data;
					if (!(name in map)) {
						if (type === 'CALCULATED') {
							const { bindingDependencies: subDependencies } = variable;
							return {
								...map,
								[name]: { ...variable },
								...collecteVariables(subDependencies, variables),
							};
						}

						return { ...map, [name]: { ...variable } };
					}
				} else {
					throw new Error(`Unknow variable ${name}`);
				}
				return map;
			}, {});
		}
		return {};
	}

	function resolveUseContext(name, { bindings, iteration }) {
		const value = bindings[name];
		if (iteration !== undefined && Array.isArray(value)) {
			return value[iteration] || null;
		}
		return getVtlCompatibleValue(value);
	}

	function refreshCalculated(map, { bindings, features, rootExpression }) {
		return Object.entries(map).reduce(function (sub, [name, current]) {
			const { variable, type } = variables[name];

			if (type === 'CALCULATED' && toRefreshVariables.has(name)) {
				const { expression } = variable;
				const value = executeExpression(
					map,
					expression,
					features,
					function (expression, bindings, e) {
						if (process.env.NODE_ENV === 'development') {
							console.warn(
								`VTL error when refresh calculated variable ${name} :  ${expression}`,
								{ bindings }
							);
							console.warn(`root expression : ${rootExpression}`);
							console.warn(e);
						}
					}
				);
				bindings[name] = value;
				toRefreshVariables.delete(name);

				return { ...sub, [name]: value };
			}
			return { ...sub, [name]: current };
		}, {});
	}

	function fillVariablesValues(map, { bindings, iteration }) {
		return Object.entries(map).reduce(function (sub, [name, _]) {
			return {
				...sub,
				[name]: resolveUseContext(name, { bindings, iteration }),
			};
		}, {});
	}

	/*	*/

	function directExecute(expression, args) {
		const { bindingDependencies, iteration, logging } = args;

		function loggingDefault(_, bindings, e) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(`VTL error :  ${expression}`, { ...args }, { bindings });
				console.warn(e);
			}
		}

		const map = refreshCalculated(
			fillVariablesValues(collecteVariables(bindingDependencies, variables), {
				bindings,
				iteration,
				variables,
			}),
			{ bindings, features, rootExpression: expression }
		);
		const result = executeExpression(
			map,
			expression,
			features,
			logging || loggingDefault
		);

		return result;
	}

	/**
	 *
	 * @param {*} expression
	 * @param {*} feature
	 * @param {*} param2
	 * @returns
	 */
	function execute(expression, args = {}) {
		const { bindingDependencies } = args;
		if (expressionsMap.has(expression)) {
			return expressionsMap.get(expression);
		}
		const value = directExecute(expression, args);
		if (!bindingDependencies) {
			expressionsMap.set(expression, value);
		}

		return value;
	}

	return [execute, updateBindings];
}

export default createExecuteExpression;
