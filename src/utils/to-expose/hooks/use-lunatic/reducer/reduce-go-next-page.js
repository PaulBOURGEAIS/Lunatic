function getNextPage(state) {
	const { pager } = state;
	const { page, maxPage } = pager;
	const p = Number.parseInt(page);
	const mp = maxPage;
	if (p < mp) {
		return `${p + 1}`;
	}
	return maxPage;
}

function reduceNextSubPage(state) {
	const { pager } = state;
	const { subPage } = pager;
	return {
		...state,
		pager: { ...pager, subPage: subPage + 1 },
	};
}

function reduceNextIteration(state) {
	const { pager } = state;
	const { iteration } = pager;
	return {
		...state,
		pager: { ...pager, subPage: 0, iteration: iteration + 1 },
	};
}

function reduceNextPage(state, next) {
	const { pager } = state;
	return {
		...state,
		isInLoop: false,
		pager: {
			...pager,
			page: next,
			iteration: undefined,
			nbIterations: undefined,
			subPage: undefined,
			nbSubPages: undefined,
		},
	};
}

function reduceStartLoop(state, next) {
	const { pages, pager } = state;
	const { subPages } = pages[next];
	if (Array.isArray(subPages)) {
		return {
			...state,
			isInLoop: true,
			pager: {
				...pager,
				page: next,
				subPage: 0,
				nbSubPages: subPages.length,
				iteration: 0,
				nbIterations: 2, // TODO interpreter iterations
			},
		};
	}
	return state;
}

function reduceGoNext(state) {
	const { pages, isInLoop, pager } = state;
	const { iteration, nbIterations, subPage, nbSubPages, page } = pager;

	if (isInLoop && subPage < nbSubPages - 1) {
		return reduceNextSubPage(state);
	}
	if (isInLoop && subPage === nbSubPages - 1 && iteration < nbIterations - 1) {
		return reduceNextIteration(state);
	}

	const next = getNextPage(state);
	const { isLoop } = pages[next];
	if (next === page) {
		// TODO on devrait jamais en arriver là !
	}

	if (isLoop) {
		return reduceStartLoop(state, next);
	}
	return reduceNextPage(state, next);
}

export default reduceGoNext;
