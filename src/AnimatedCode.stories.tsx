import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AnimatedCode from './AnimatedCode';

export default {
  title: 'AnimatedCode',
  component: AnimatedCode,
} as ComponentMeta<typeof AnimatedCode>;

const Template: ComponentStory<typeof AnimatedCode> = (args) => <AnimatedCode {...args}>{args.children}</AnimatedCode>;

export const Simple = Template.bind({});
Simple.args = {
  children: <p>This is an example</p>
};

export const Double = Template.bind({});
Double.args = {
  children: <><p>Paragraph 1</p> <p>Paragraph 2</p></>
};
