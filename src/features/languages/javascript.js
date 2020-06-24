// we're running javascript in javascript
// nothing special is required

window.WCCodeMirrorExtras.languages.javascript = {
	// alternate console for the environment
	createAlternateConsole(webcomponent){
		return {
			/**
			 * console.log alternative
			 */
			log(val){
				webcomponent.console.addText(val);
			}
		}
	},

	//
  abilities: {
    /**
		 * @param webcomponent - the webcomponent
		 */
    async run (webcomponent) {
			const code = `return (async function(){
			  const __webcomponent = WCCodeMirrorStuff.getWCCodeMirror(${webcomponent.WCCodeMirrorID})
			  var console = WCCodeMirrorExtras
				                .languages
												.javascript
												.createAlternateConsole(__webcomponent)
				${webcomponent.value}
			})`

      await Function(code)()()
    }
  }
}
