import React, { Children, CSSProperties } from 'react'
import ReactDOM from 'react-dom'
import AutoExpandMarquee from './AutoExpandMarquee'
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage('javascript', js);

const codeString = `const b = (num) => num + 1; const b = (num) => num + 1;`
const codeString1 = `<SyntaxHighlighter language="javascript" style={docco}>`
const codeString2 = `<`
const codeString3 = `document.getElementById('root')`

const customStyle: CSSProperties = {
  margin: 0,
  padding: 1,
  backgroundColor: 'transparent',
  fontSize: '1em',
}

ReactDOM.render(
  <React.StrictMode>
    <AutoExpandMarquee animationConfig={{mix: false}} style={{width: '50%', fontSize: '2em'}}>
      <SyntaxHighlighter /* PreTag={PreTag} */ customStyle={customStyle} language="javascript" style={docco}>
        {codeString}
      </SyntaxHighlighter>
      <SyntaxHighlighter /* PreTag={PreTag} */  customStyle={customStyle} language="javascript" style={docco}>
        {codeString1}
      </SyntaxHighlighter>
      <SyntaxHighlighter /* PreTag={PreTag} */  customStyle={customStyle} language="javascript" style={docco}>
        {codeString2}
      </SyntaxHighlighter>
      <SyntaxHighlighter /* PreTag={PreTag} */  customStyle={customStyle} language="javascript" style={docco}>
        {codeString3}
      </SyntaxHighlighter>
    </AutoExpandMarquee>
  </React.StrictMode>,
  document.getElementById('root')
)

