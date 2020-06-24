/* eslint no-undef: 0 */
import CodeMirror from '../node_modules/codemirror/src/codemirror.js'
import './styling.js'

self.CodeMirror = CodeMirror

// all extra features, load feature-related stuff in
// this Object
window.WCCodeMirrorExtras = {languages : {}}

/**
 * WCCodeMirror
 *
 * html attributes of the class
 *
 * src
 * style
 * viewport-margin
 * readonly
 * featured - adds special features
 */
export class WCCodeMirror extends HTMLElement {
  static get observedAttributes () {
    return ['src']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.__initialized) { return }
    if (oldValue !== newValue) {
      this[name] = newValue
    }
  }

  get src () { return this.getAttribute('src') }
  set src (value) {
    this.setAttribute('src', value)
    this.setSrc()
  }

  get value () { return this.editor.getValue() }
  set value (value) {
    this.setValue(value)
  }

	get mode() {
		return this.getAttribute('mode')
	}

	set mode(value){
		return this.setAttribute('mode', value);
	}

  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = WCCodeMirror.template()
    this.appendChild(template.content.cloneNode(true))
    this.__initialized = false
    this.__element = null
    this.editor = null
  }

  async connectedCallback () {
    this.style.display = 'block'
    this.__element = this.querySelector('textarea')

    const mode = this.hasAttribute('mode') ? this.getAttribute('mode') : 'null'
    const theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'default'
    let readOnly = this.getAttribute('readonly')

    if (readOnly === '') readOnly = true
    else if (readOnly !== 'nocursor') readOnly = false

    let content = ''
    const innerScriptTag = this.querySelector('script')
    if (innerScriptTag) {
      if (innerScriptTag.getAttribute('type') === 'wc-content') {
        content = WCCodeMirror.dedentText(innerScriptTag.innerHTML)
        content = content.replace(/&lt;(\/?script)(.*?)&gt;/g, '<$1$2>')
      }
    }

    let viewportMargin = CodeMirror.defaults.viewportMargin
    if (this.hasAttribute('viewport-margin')) {
      const viewportMarginAttr = this.getAttribute('viewport-margin').toLowerCase()
      viewportMargin = viewportMarginAttr === 'infinity' ? Infinity : parseInt(viewportMarginAttr)
    }

    this.editor = CodeMirror.fromTextArea(this.__element, {
      lineNumbers: true,
      readOnly,
      mode,
      theme,
      viewportMargin
    })

    if (this.hasAttribute('src')) {
      this.setSrc(this.getAttribute('src'))
    } else {
      // delay until editor initializes
      await new Promise(resolve => setTimeout(resolve, 50))
      this.value = content
    }

    // add special features
    if (this.hasAttribute('featured')){
      this.addSpecialFeatures()
    }

    this.__initialized = true;
  }

  async setSrc () {
    const src = this.getAttribute('src')
    const contents = await this.fetchSrc(src)
    this.value = contents
  }

  async setValue (value) {
    this.editor.swapDoc(CodeMirror.Doc(value, this.getAttribute('mode')))
    this.editor.refresh()
  }

  async fetchSrc (src) {
<<<<<<< HEAD
    const response = await fetch(src);
	  return response.text();
=======
    const response = await fetch(src)
    return response.text()
>>>>>>> master
  }

  static template () {
    return `
      <textarea style="display:inherit; width:inherit; height:inherit;"></textarea>
    `
  }

  /**
   * De-dents the code by getting the padding from the first line,
   * then removes the same indent amount padding from the rest of the lines
   *
   * @param {string} text - the text to dedent
   * @returns {string} the dedented text
   */
  static dedentText (text) {
    const lines = text.split('\n')

    // remove the first line if it is an empty line
    if (lines[0] === '') lines.splice(0, 1)

<<<<<<< HEAD
    const initline = lines[0];
    let fwdPad = 0;
    const usingTabs = initline[0] === '\t';
    const checkChar = usingTabs ? '\t' : ' ';
=======
    const initline = lines[0]
    let fwdPad = 0
    const usingTabs = initline[0] === '\t'
    const checkChar = usingTabs ? '\t' : ' '
>>>>>>> master

    while (true) {
      if (initline[fwdPad] === checkChar) {
        fwdPad += 1
      } else {
        break
      }
    }

    const fixedLines = []

    for (const line of lines) {
      let fixedLine = line
      for (let i = 0; i < fwdPad; i++) {
        if (fixedLine[0] === checkChar) {
          fixedLine = fixedLine.substring(1)
        } else {
          break
        }
      }
      fixedLines.push(fixedLine)
    }

    if (fixedLines[fixedLines.length - 1] === '') fixedLines.splice(fixedLines.length - 1, 1)

    return fixedLines.join('\n')
  }

  /**
   * adds special features to the code mirror
   */ 
  async addSpecialFeatures(){
		if(!this.mode){
			return console.error("wc-codemirror : the features attribute cannot be put without a mode attribute, please specify a mode attribute !")
		}

		if(!WCCodeMirrorExtras.languages[this.mode]){
			return console.error('wc-codemirror : specified mode does not have an associated script file, please add the "special-features" script file for this language');
		}

		this.insertAdjacentHTML('beforeend', `
		   <div class="wc-codemirror-featured">
			     <input type="button" class="wc-codemirror-featured-run-btn" value="▶">
			     <input type="button" 
					        class="wc-codemirror-featured-copy-btn" 
									value="copy to clipboard">
					 <div class="wc-codemirror-console"></div>
			 </div>
		`)


		/**
		 * TODO: sometimes you might have to compile before running, show an indicator for that
		 */
		this.featuresStuff = {
			// all of the elements in the div with features
			elements : {
				div: this.querySelector('.wc-codemirror-featured'),
				copy: this.querySelector('.wc-codemirror-featured .wc-codemirror-featured-copy-btn'),
				run: this.querySelector('.wc-codemirror-featured .wc-codemirror-featured-run-btn'),
				console: this.querySelector('.wc-codemirror-featured .wc-codemirror-console')
			},
			abilities : WCCodeMirrorExtras.languages[this.mode].abilities,
			addToConsole(content){
				const console = this.elements.console;
				console.appendChild(content);
			}
		}

		const abilities = this.featuresStuff.abilities;
		const elements = this.featuresStuff.elements;

		this.addEventListener('click', async () => {
			await navigator.clipboard.writeText(this.value);
		});

		elements.run.addEventListener('click', () => this.run());
	}

	/** to run the code **/
	run(){
		this.featuresStuff.elements.console.innerHTML = "";
		this.featuresStuff.abilities.run(this)
	}
}

customElements.define('wc-codemirror', WCCodeMirror)
