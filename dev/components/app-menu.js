/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {format, isSameDay} from 'date-fns';
import {LitElement, html, css, nothing} from 'lit';
import { styleMap } from 'lit/directives/style-map';

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
  * Static getter styles
  * 
  * @returns {styles}
  */
  static get styles() {
    return css`
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
    `;
  }

  /**
  * Static getter properties
  * 
  * @returns Object
  */
  static get properties() {
    return {
      /**
      * holds formatted date in number format
      */
      items: {type: Array},

      /**
       * Object that defines where to position the component with css with left and top value
       *
       * @type {{positions : Object}}
       */
      positions: {type: Object},

      /**
       * Boolean to decide whether to show menu component or not
       *
       * @type {{hidden : Boolean}}
       */
       hidden: {type: Boolean},
       onCancel: {type: Function},

       day: {type: Object},
       showAppMenu: {type: Boolean}
      
    };
  }

  constructor() {
    super();

    this.hidden = false;
    this.positions = {top:'10px', left: '10px'};
  }

  updated() {
    let draggableItems = this.shadowRoot.querySelectorAll('.list-item');
    if(draggableItems.length!=0){
      draggableItems.forEach(draggableItem => {
        draggableItem.addEventListener('dragstart', (e)=>{ this.handleDragStart(e, draggableItem.getAttribute('key'))})
      });
    }
    this.addEventListener('dragend', this.handleDragLeave);
  }

  handleDragLeave(e) {
    console.log('end');
    // this.requestUpdate();
  }

  handleDragStart(e, key) {
    console.log('dragging list');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/plain", key);
    // console.log('dragging ', key);
  }

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
  * render method
  * 
  * @returns {customElements}
  */
  render() {
    // console.log(this.day);
    let filteredEvents = this.items.filter(eventItem => {
      return isSameDay(new Date(eventItem.start), this.day);
    });
    console.log('render menu');
    return this.showAppMenu? html`
      <div class="listbox" style=${styleMap(this.positions)}>
        <div class="list-heading">
          <h3>${format(this.day, 'MMM d')}</h3>
          <span @click="${this.onCancel}">X</span>
        </div>
        <div class="list-body">
          ${filteredEvents.map(item => {
            return html`<div class="list-item" draggable="true" key="${item.id}">${item.title}</div>`;
          })}
        </div>
      </div>
    `:nothing;
  }

}

window.customElements.define('app-menu', AppMenu);
 