import { isOnEmptyPage } from './commons';

function getPreviousPage(pager) {
	const { page } = pager;
	const p = Number.parseInt(page);
	if (p > 1) {
		return `${page - 1}`;
	}
	return page;
}

function goStartLoop(state, previous) {
	const { pages, pager } = state;
	const { subPages } = pages[previous];
	if (Array.isArray(subPages)) {
		const nbIterations = 2; // TODO interpreter iterations
		return {
			...state,
			isInLoop: true,
			pager: {
				...pager,
				page: previous,
				subPage: subPages.length - 1,
				nbSubPages: subPages.length,
				iteration: nbIterations - 1,
				nbIterations,
			},
		};
	}
	return state;
}

function goPreviousSubPage(state) {
	const { pager } = state;
	const { subPage } = pager;
	return {
		...state,
		pager: { ...pager, subPage: subPage - 1 },
	};
}

function goPreviousIteration(state) {
	const { pager } = state;
	const { iteration, subPages } = pager;
	return {
		...state,
		pager: { ...pager, subPage: subPages.length - 1, iteration: iteration - 1 },
	};
}

function goPreviousPage(state, previous) {
	const { pager } = state;
	const { page } = pager;
	if (previous !== page) {
		return {
			...state,
			isInLoop: false,
			pager: {
				...pager,
				page: previous,
				iteration: undefined,
				nbIterations: undefined,
				subPage: undefined,
				nbSubPages: undefined,
			},
		};
	}

	return state;
}

function validateChange(state) {
	if (isOnEmptyPage(state)) {
		return reduceGoPreviousPage(state);
	}

	return state;
}

function reduceGoPreviousPage(state) {
	const { pages, pager, isInLoop } = state;
	const { iteration, subPage, nbSubPages } = pager;

	// dans une boucle et l'itération courante n'est pas finie
	if (isInLoop && subPage > 0) {
		return validateChange(goPreviousSubPage(state));
	}
	// dans une boucle, l'itération courante est finie mais il reste encore au moins une autre
	if (isInLoop && subPage === nbSubPages - 1 && iteration > 0) {
		return validateChange(goPreviousIteration(state));
	}

	const previous = getPreviousPage(pager);
	const { isLoop, iterations } = pages[previous];
	// on rentre dans une boucle
	if (isLoop) {
		return validateChange(goStartLoop(state, previous));
	}
	// on change de page
	return validateChange(goPreviousPage(state, previous));
}

export default reduceGoPreviousPage;
