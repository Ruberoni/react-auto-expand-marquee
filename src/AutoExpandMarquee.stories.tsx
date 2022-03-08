import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AutoExpandMarquee from './AutoExpandMarquee';

export default {
  title: 'AnimatedCode',
  component: AutoExpandMarquee,
} as ComponentMeta<typeof AutoExpandMarquee>;

const Template: ComponentStory<typeof AutoExpandMarquee> = (args) => <AutoExpandMarquee {...args} />;

export const Default = Template.bind({})
Default.args = {
  children: <p>Paragraph</p>
}

export const Twochildren = Template.bind({})
Twochildren.args = {
  children: [<p key="AEM-STORY-Twochildren-1">Paragraph 1</p>, <p key="AEM-STORY-Twochildren-2">Paragraph 2</p>]
}
Twochildren.storyName = "Two children"

export const MixProp = Template.bind({})
MixProp.args = {
  children: [<p key="AEM-STORY-MixProp-1">Paragraph 1</p>, <p key="AEM-STORY-MixProp-2">Paragraph 2</p>],
  animationConfig: {
    mix: true
  }
}
MixProp.storyName = "With `mix` prop."

export const CustomStyle = Template.bind({})
CustomStyle.args = {
  children: <p>Paragraph&nbsp;</p>,
  style: {
    fontSize: '2em',
    color: 'green',
    width: '50%',
    fontFamily: 'Arial',
  }
}
CustomStyle.storyName = "Custom style"

export const ConfigureAnimation = Template.bind({})
ConfigureAnimation.args = {
  children: <p>Paragraph&nbsp;</p>,
  animationConfig: {
    speed: 0.002,
    timingFunction: 'ease-in-out',
  }
}
ConfigureAnimation.storyName = "Configure Animation"
