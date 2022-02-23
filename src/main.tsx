import React from 'react'
import ReactDOM from 'react-dom'
import AnimatedCode from './AnimatedCode'

const codeString = `  const b = (num) => num + 1;
  const a = 5;`;

ReactDOM.render(
  <React.StrictMode>
    <AnimatedCode animationConfig={{mix: true}}>
      {codeString}
      <p>Hola</p>
    </AnimatedCode>
  </React.StrictMode>,
  document.getElementById('root')
)
