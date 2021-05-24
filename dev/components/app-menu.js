import {LitElement, html, css, nothing} from 'lit';
import { styleMap } from 'lit/directives/style-map';

import {format, isSameDay} from 'date-fns';

import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';


/**
* `<app-menu>` Custom component to list more of events
*
* <app-calendar-content>
*  <app-menu></app-menu>
*
* @polymer
* @litElement
* @customElement
*/
export class AppMenu extends LitElement {

  /**
  * Static styles
  */
  static styles = [
    css`
      :host {
        width:20%;
      }
      paper-item {
        --paper-font-subhead_-_font-size: 12px;
        --paper-item-min-height:30px;
        // --paper-font-subhead_-_line-height: 10px;
      }
      .list {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius:5px;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index:3;
        font-size:12px;
      }

      .listbox {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius:5px;
        background:white;
        width: 20%;
        position: absolute;
        top: 0px;
        left: 0px;
        font-size:12px;
        opacity: 1;
        z-index:3;
        padding:5px;
      }
      .list-heading{
        overflow:hidden;
        padding:0;
      }
      .list-heading h3,h4,h5{
        float:left;
        padding: 0;
        margin: 0;
      }
      .list-heading span {
        float: right;
        margin-right: 10px;
      }
      .list-heading span:hover {
        cursor: pointer;
      }
      .list-item:hover {
        background: #dcdee0;
        cursor: pointer;
      }
      .time {
        color: #07a643;
        padding-right: 5px;
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
      * holds formatted date in number format
      * @type {{items:Array}}
      */
      items: {type: Array},

      /**
       * Object that defines where to position the component with css with left and top value
       * @type {{positions : Object}}
       */
      positions: {type: Object},

      /**
       * handler function to hide this component
       * @type {{onCancel:Function}}
       */
      onCancel: {type: Function},

      /**
       * object to store date on which popup events list is shown
       * @type {{day:Object}}
       */
      day: {type: Object},

      /**
       * to check where to show this component or not
       * @type {{showAppMenu:Boolean}}
       */
      showAppMenu: {type: Boolean}
      
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.hidden = false;
    this.positions = {top:'10px', left: '10px'};
  }

  /**
   * function to add drag and drop events 
   */
  updated() {
    let draggableItems = this.shadowRoot.querySelectorAll('.list-item');
    if(draggableItems.length!=0){
      draggableItems.forEach(draggableItem => {
        draggableItem.addEventListener('dragstart', (e)=>{ this.handleDragStart(e, draggableItem.getAttribute('key'))})
      });
    }
    this.addEventListener('dragend', this.handleDragLeave);
  }

  /**
   * 
   * @param {Object} event
   */
  handleDragLeave(event) {
    console.log('end');
  }

  /**
   * handler for drag start
   * @param {Object} event 
   * @param {Integer} key 
   */
  handleDragStart(event, key) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/plain", key);
  }

  /**
   * template to be rendered
   * @returns html
   */
  renderTemplate() {
    return  html`
      <p>something</p>
        <paper-listbox class="list">
        ${this.items.map(({...item}) => {
          return html`<paper-item>${item.title}</paper-item>`;
        })}
      </paper-listbox>
    `;
  }

  /**
   * function to convert 24hr time to 12hr
   * @param {String} time 
   * @returns String
   */
  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'a' : 'p'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  /**
  * render method
  * 
  * @returns {customElements}
  */
  render() {
    // console.log(this.day);
    let filteredEvents = this.items.filter(eventItem => {
      return isSameDay(new Date(eventItem.start), this.day);
    });
    filteredEvents.sort(function (a, b) {
      return a.startTime.localeCompare(b.startTime);
    });
    return this.showAppMenu? html`
      <div class="listbox" style=${styleMap(this.positions)}>
        <div class="list-heading">
          <h3>${format(this.day, 'MMM d')}</h3>
          <span @click="${this.onCancel}">X</span>
        </div>
        <div class="list-body">
          ${filteredEvents.map(item => {
            return html`
              <div class="list-item" draggable="true" key="${item.id}">
                <span class="time">${this.tConvert(item.startTime)}</span><span>${item.title}</span>
              </div>`;
          })}
        </div>
      </div>
    `:nothing;
  }

}

window.customElements.define('app-menu', AppMenu);
