import React from 'react';

function createCustomizableLunaticField(LunaticField) {
	const Memoized = React.memo(LunaticField);
	const { name } = LunaticField;
	return function OverlayField(props) {
		const { custom } = props;
		if (typeof custom === 'object' && name in custom) {
			const CustomComponent = custom[name];
			return <CustomComponent {...props} />;
		}

		return <Memoized {...props} />;
	};
}

export default createCustomizableLunaticField;
