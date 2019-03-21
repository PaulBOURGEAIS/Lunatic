import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { InputNumber } from 'components';
import readme from './README.md';
import titleDecorator from 'utils/decorator/title-decorator';
import {
	text,
	boolean,
	number,
	color,
	object,
	select,
} from '@storybook/addon-knobs/react';

const labelPositionOptions = {
	DEFAULT: 'Default',
	TOP: 'Top',
	RIGHT: 'Right',
	BOTTOM: 'Bottom',
	LEFT: 'Left',
};

const stories = storiesOf('InputNumber', module)
	.addDecorator(withReadme(readme))
	.addDecorator(Component => {
		const WrappedComponent = titleDecorator(Component);
		return <WrappedComponent title="<InputNumber />" />;
	});

stories.addWithJSX('Default', () => (
	<InputNumber id="default" label="Label" handleChange={console.log} />
));

stories.addWithJSX('Props', () => (
	<InputNumber
		id="props"
		label={text('Label', "I'm the label of the number input")}
		unit={text('Unit', 'euros')}
		min={number('Min', 0)}
		max={number('Max', 10)}
		decimals={number('Decimals', 1)}
		placeholder={text('Placeholder', 'Placeholder')}
		readOnly={boolean('Read only', false)}
		required={boolean('Required', false)}
		handleChange={console.log}
		labelPosition={select('Label position', labelPositionOptions)}
	/>
));

stories.addWithJSX('Styled', () => (
	<InputNumber
		id="styled"
		label={text('Label', "I'm the label of the number input")}
		min={number('Min', 0)}
		max={number('Max', 0)}
		decimals={number('Decimals', 0)}
		placeholder={text('Placeholder', 'Placeholder')}
		readOnly={boolean('Read only', false)}
		handleChange={console.log}
		style={object('Generated style', {
			'border-color': color('Border color', '#e80a4d'),
			'border-width': number('Border-width', 2, {
				range: true,
				min: 2,
				max: 20,
				step: 1,
			}),
			'border-radius': number('Border-radius', 10, {
				range: true,
				min: 0,
				max: 20,
				step: 1,
			}),
		})}
	/>
));