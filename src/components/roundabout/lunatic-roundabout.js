import React, { useCallback } from 'react';
import Roundabout from './roundabout';

/**
 *  Logique fonctionnelle et immuable du composant
 */
function LunaticRoundabout({
	iterations,
	expressions,
	goToPage,
	page,
	label,
	locked,
	custom,
}) {
	const goToIteration = useCallback(
		function (iteration) {
			goToPage({
				page,
				iteration,
				nbIterations: iterations,
				roundabout: { page },
			});
		},
		[goToPage, page, iterations]
	);

	return (
		<Roundabout
			label={label}
			expressions={expressions}
			iterations={iterations}
			goToIteration={goToIteration}
			locked={locked}
			custom={custom}
		/>
	);
}

export default LunaticRoundabout;