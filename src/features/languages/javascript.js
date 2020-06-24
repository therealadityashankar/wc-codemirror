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
        const val = document.createElement('span')
        val.innerText = value
        webcomponent.featuresStuff.addToConsole(val)
      }

      window.console.log = alternateConsoleLog
      Function(webcomponent.value)()
      window.console.log = initConsoleLog
    }
  }
}
