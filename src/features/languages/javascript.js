// we're running javascript in javascript
// nothing special is required

window.WCCodeMirrorExtras.languages.javascript = {
  abilities: {
    /**
		 * @param webcomponent - the webcomponent
		 */
    run (webcomponent) {
      const initConsoleLog = window.console.log

      function alternateConsoleLog (value) {
        const abc = document.createElement('div')
        abc.innerText = value
        webcomponent.featuresStuff.addToConsole(abc)
      }

      window.console.log = alternateConsoleLog
      Function(webcomponent.value)()
      window.console.log = initConsoleLog
    }
  }
}
