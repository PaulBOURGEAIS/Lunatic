import React from 'react';
import Orchestrator from '../utils/orchestrator';
import source from './source';
import defaultArgTypes from '../utils/default-arg-types';

const stories = {
	title: 'Components/RosterForLoop',
	component: Orchestrator,
	argTypes: defaultArgTypes,
};

export default stories;

const Template = (args) => <Orchestrator {...args} />;
export const Default = Template.bind({});

Default.args = { id: 'roster-for-loop', source };