import React from 'react'
import ReactDOM from 'react-dom'

// import './index.css'
// import './font/font.css'
import RendererConfig from './config/Renderer.json'
import ImageCollection from './config/ImageCollection.json'

import Marked from 'marked'
import Main from './component/Main'
import Header from './component/Header'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { green700, grey600 } from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const textObject = {
  text: ''
}

const muiTheme = getMuiTheme({
  palette: {primary1Color: green700, primary2Color: green700, primary3Color: grey600},
  appBar: {height: 64}
})

const renderer = new Marked.Renderer()

const renderConfig = {}

function setRenderer (preset) {
  preset = preset || 'default'
  let prefixes = RendererConfig.prefix
  let suffixes = RendererConfig['suffix_' + preset]
  // try {
  //   if (localStorage.renderConfigOverride !== 'true') {
  //     localStorage.renderConfigOverride = 'false'
  //     throw new Error()
  //   }
  //   Object.assign(suffixes, JSON.parse(localStorage.renderConfig))
  // } catch (e) {
  //   localStorage.renderConfig = JSON.stringify(suffixes)
  // }
  for (let key in prefixes) {
    let prefix = prefixes[key]
    let suffix = suffixes[key]
    let func = eval(prefix + '`' + suffix + '`')
    renderConfig[key] = {prefix: prefix, suffix: suffix}
    if (key === 'tablecell') {
      renderer[key] = (content, flags) => func(content, flags.header, flags.align)
    } else {
      renderer[key] = func
    }
  }
}

function collectConfig (preset) {
  return {renderer: renderConfig, text: textObject.text}
}

setRenderer()

function onTransform (markdownText) {
  return textObject.text = renderer.markdown(Marked(markdownText, {
    renderer: renderer, breaks: false, gfm: true, tables: true, xhtml: false,
    pedantic: false, sanitize: false, smartLists: true, smartypants: false
  }))
}

function header () {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <Header configCollector={collectConfig} images={ImageCollection} />
    </MuiThemeProvider>
  )
}

function main () {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <Main transformer={onTransform} />
    </MuiThemeProvider>
  )
}

// ReactDOM.render(header(), document.getElementsByTagName('header')[0])
// ReactDOM.render(main(), document.getElementsByTagName('main')[0])

export default onTransform;