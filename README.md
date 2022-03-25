# React Auto Expand Marquee
Marquee that expands to its container width size automatically

![npm](https://img.shields.io/npm/v/react-auto-expand-marquee)
![deps](https://img.shields.io/badge/Dependencies-0-green)
![npm type definitions](https://img.shields.io/npm/types/react-auto-expand-marquee.svg)
# Goals 🚩
This project has the initial goal to work as a component for my webpage, but while I was working on it I changed the design a lot and I did't used it, so now it was very good way to learn about CSS Animations, Storybook and creating my own React modules.

# Installation
```
npm install react-auto-expand-marquee
```

# Usage
## Import

```javascript
import AutoExpandMarquee from 'react-auto-expand-marquee'
```

## Simple example
```javascript
<AutoExpandMarquee>
  Marquee
</AutoExpandMarquee>
```

## Complete example
```javascript
import React from "react"
import AutoExpandMarquee from 'react-auto-expand-marquee'

const animationConfig = {
  mix: true,
  speed: 0.03,
  timingFunction: 'ease-in'
}

const Example = () => (
  <AutoExpandMarquee animationConfig={animationConfig}>
    <h1>Header</h1>
    <p>Paragraph</p>
  </AutoExpandMarquee>
)

export default Example
```


# Props
| **Property**      | **Type**                | **Default**                  | **Description**         |
|-------------------|-------------------------|------------------------------|-------------------------|
| `animationConfig` | IMarqueeAnimationConfig | `mix: false`<br>`play: true` | Customize the animation |
| `style`           | `React.CSSProperties`   |                              |                         |

## IMarqueeAnimationConfig
| **Property**     | **Type**                                         | **Default** | **Description**                                           |
|------------------|--------------------------------------------------|-------------|-----------------------------------------------------------|
| `mix`            | Boolean                                          | `false`     | When set to `true` each row will move to a different side |
| `play`           | Boolean                                          | `true`      | Controls if the animation is running or not               |
| `reverse`        | Boolean                                          | `false`     | Controls if the animation will go from right to left      |
| `speed`          | Number                                           | `~ 0.1823`  | Controls the animation speed                              |
| `delay`          | Number                                           | 0           |                                                           |
| `timingFunction` | `React.CSSProperties['animationTimingFunction']` | `linear`    |                                                           |
| `iterationCount` | `React.CSSProperties['animationIterationCount']` | `infinite`  |
| `direction`      | `React.CSSProperties['animationDirection']`      | `normal`    |                                                           |

# See also
- [React Fast Marquee](https://github.com/justin-chu/react-fast-marquee) by [Justin Chu](https://github.com/justin-chu)
# Contact me! 📞
Email me: [ruben.pardes25@gmail.com](mailto:ruben.pardes25@gmail.com)\
Discord: Ruberoni#8428