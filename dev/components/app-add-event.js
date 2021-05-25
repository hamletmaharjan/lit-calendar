import {customElement, property} from 'lit/decorators.js';
import {LitElement, html, css, render, nothing} from 'lit';

import {format, formatISO, addHours} from 'date-fns';

import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';


/**
* `<app-add-event>` Custom component to add a new event to the calendar
*
* <app-calendar>
*  <app-add-event></app-add-event>
*
* @polymer
* @litElement
* @customElement
*/
export class AppAddEvent extends LitElement {

  /**
  * Static styles
  */
  static styles = [
    css`
      .icon {
        font-family: 'Material Icons', serif;
        font-style: normal;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
      
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      } 

      /* GENERAL */
      
      * {
        box-sizing: border-box;
      }
      
      :host {
          font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
          font-size: 1em;
          font-weight: 300;
          line-height: 1.5;
          color: var(--text-color);
          background: var(--bg-color);
          position: relative;
      }
      
      .header {
        margin: 0;
        padding: 5px;
        overflow:hidden;
      }
      .title{
          float:left;
          
      }
      .close {
          float:right;
          border:none;
      }
      .fullwidth {
        width:90%;
      }
      input {
        width:70px;
      }
      .modal-footer{
        margin-top:10px;
      }
      
    `
  ];

  /**
  * Static getter properties
  * 
  * @returns Object
  */
  static get properties() {
    return {
      /**
      * holds the format of the date
      * @type {{dateFormat:String}}
      */
      dateFormat: {type: String},

      /**
       * holds title of the event to be added
       * @type {{title:String}}
       */
      title: {type: String},

      /**
       * handler function on submit event add
       * @type {{onSubmitData: Function}}
       */
      onSubmitData: {type: Function},

      /**
       * day on which event to be added
       * @type {{day:Object}}
       */
      day: {type: Object},

      /**
       * handler functin to hide this component
       * @type {{onHideAddEvent:Function}}
       */
      onHideAddEvent: {type: Function}

    };
  }

  /**
  * constructor
  */
  constructor() {
    super();

    this.title = '';
    this.endTime = '';
    this.startTime = '';
    this.dateFormat = "MMMM yyyy";

    this.handleAdd = this.handleAdd.bind(this);
    this.dialogRenderer = this.dialogRenderer.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /**
   * handler function when input changes
   * @param {Object} event 
   */
  handleInputChange(event) {
    if(event.target.name && event.target.value){
      let name = event.target.name;
      let val = event.target.value;
      this[name] = val;
    }
  }

  /**
   * handler function when add button is clicked
   */
  handleAdd() {
    if(this.startTime.length == 0) {
      this.startTime = '12:00';
    }
    if(this.endTime.length == 0) {
      this.endTime = '13:00';
    }
    this.onSubmitData({title:this.title?this.title:'untitled', start: formatISO(this.day), startTime:this.startTime,
      endTime:this.endTime
    });
    [this.title, this.startTime, this.endTime] = ['','',''];
  }  

  /**
   * custom template to be rendered
   * @returns {html}
   */
  renderTemplate() {
    return html`
    <label>Time</label><br>
    <input type="time" @input="${this.handleInputChange}" name="startDate"> - <input type="time" @input="${this.handleInputChange}"> <br>
    `
  }

  /**
  * render method
  * 
  * @returns {customElements}
  */
  render() {
    return html`<vaadin-dialog
      no-close-on-esc no-close-on-outside-click
      opened
      .renderer="${this.dialogRenderer}"
      >
    </vaadin-dialog>`;
     
  }

  /**
   * renderer function that returns html to be displayed on dialog
   * @param {Object} root 
   * @param {Object} dialog 
   */
  dialogRenderer(root, dialog) {
    const innerHTML = html`
      <div class="header">
        <h3 class="title" style="margin:0">Add an Event</h3>
        <p>${format(this.day, 'MMM d')}</p>
      </div>
      <div>
        <label>Event Title</label><br>
        <input type="text" .value="${this.title}" @input="${this.handleInputChange}" name="title" style="width:95%;"><br>
        <input type="time" name="startTime" @input="${this.handleInputChange}"> - <input type="time" name="endTime" @input="${this.handleInputChange}">
        <div class="modal-footer" style="margin-top:15px">
          <vaadin-button theme="primary small" @click="${this.handleAdd}">ADD</vaadin-button>
          <vaadin-button theme="small" @click="${this.onHideAddEvent}">CANCEL</vaadin-button>
        </div>
      </div>
    `;
    render(innerHTML, root);
  }  


}

window.customElements.define('app-add-event', AppAddEvent);
