// we're running javascript in javascript
// nothing special is required

window.WCCodeMirrorExtras.languages.javascript = {
	// alternate consoles to be used inside the coding environment
	consoles: [],

	// alternate console for the environment
	createAlternateConsole(webcomponent){
		return {
			/**
			 * console.log alternative
			 */
			log(val){
				const logSpan = document.createElement("span")
				logSpan.innerText = val
				webcomponent.featuresStuff.addToConsole(logSpan);
			}
		}
	},

	//
  abilities: {
    /**
		 * @param webcomponent - the webcomponent
		 */
    async run (webcomponent) {
			const JSExtras = window.WCCodeMirrorExtras.languages.javascript
			const newConsolePos = JSExtras.consoles.length
			const newConsole = JSExtras.createAlternateConsole(webcomponent)
			JSExtras.consoles.push(newConsole)

			const code = `return (async function(){
			  const __WCJSExtras = window.WCCodeMirrorExtras.languages.javascript
			  const console = __WCJSExtras.consoles[${newConsolePos}]
				${webcomponent.value}
			})`

      await Function(code)()()
    }
  }
}
