import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExpandableComponent from './ExpandableComponent';

export default {
  title: 'ExpandableComponent',
  component: ExpandableComponent,
} as ComponentMeta<typeof ExpandableComponent>;

const Template: ComponentStory<typeof ExpandableComponent> = (args) => <ExpandableComponent {...args}>{args.children}</ExpandableComponent>;

export const Default = Template.bind({});
Default.args = {
  children: <p>This is will expand itself to the component width.</p>
};
