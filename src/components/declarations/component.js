import React from 'react';
import PropTypes from 'prop-types';
import * as U from '../../utils/lib';
import './declarations.scss';

const Declarations = ({ id, type, declarations }) => {
	const filtered = declarations.filter(({ position }) => position === type);
	return (
		<div id={`declarations-${id}-${type}`} className="declarations-lunatic">
			{filtered.map(({ id: idD, label, declarationType }) => (
				<div
					key={`${idD}`}
					className={`declaration-lunatic declaration-${declarationType.toLowerCase()}`}
				>
					{label}
				</div>
			))}
		</div>
	);
};

Declarations.defaultProps = {
	type: 'AFTER_QUESTION_TEXT',
	declarations: [],
};

Declarations.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string,
	declarations: U.declarationsPropTypes,
};

export default Declarations;
