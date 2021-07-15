import React, { useContext } from 'react';
import { SuggesterContext, actions } from '../../state-management';
import classnames from 'classnames';
import Label from './label';

function Selection({ labelRenderer, placeholder, labelledBy }, inputEl) {
	const [state, dispatch] = useContext(SuggesterContext);
	const { search, expended, id, disabled, focused } = state;

	function onChange(e) {
		dispatch(actions.onChangeSearch(e.target.value));
	}

	return (
		<div
			className={classnames('lunatic-suggester-selection', {
				focused,
				disabled,
			})}
			role="combobox"
			aria-hasPopUp="listbox"
			aria-labelledBy={labelledBy}
			aria-expanded={expended}
			aria-autocomplete="list"
			aria-owns={`${id}-list`}
		>
			<input
				ref={inputEl}
				id={`${id}-input`}
				tabIndex="0"
				className="lunatic-suggester-input"
				type="text"
				onChange={onChange}
				value={search}
				aria-label="lunatic-suggester"
				title="suggester"
				autoComplete="off"
				autoCapitalize="off"
				autoCorrect="off"
				spellCheck="false"
				placeholder={placeholder}
				disabled={disabled}
			/>
			<Label labelRenderer={labelRenderer} placeholder={placeholder} />
		</div>
	);
}

export default React.forwardRef(Selection);
