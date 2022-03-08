import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AutoExpandMarquee from './AutoExpandMarquee';

export default {
  title: 'AnimatedCode',
  component: AutoExpandMarquee,
} as ComponentMeta<typeof AutoExpandMarquee>;

const Template: ComponentStory<typeof AutoExpandMarquee> = (args) => <AutoExpandMarquee {...args}>{args.children}</AutoExpandMarquee>;

export const Simple = Template.bind({});
Simple.args = {
  children: <p>This is an example</p>
};

export const Double = Template.bind({});
Double.args = {
  children: <><p>Paragraph 1</p> <p>Paragraph 2</p></>
};
