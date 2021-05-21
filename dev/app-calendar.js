/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css, nothing} from 'lit';
import {addMonths, subMonths, isAfter, isBefore, isSameDay, formatISO} from 'date-fns';

import './components/app-menu';
import './components/app-add-event';
import './components/app-calendar-header';
import './components/app-calendar-cell.js';
import './components/app-calendar-content.js';
import './components/app-calendar-content-header.js';


/**
 * `<app-calendar>` Custom component to add a calendar
 *
 * <body>
 *  <app-calendar></app-calendar>
 *
 * @polymer
 * @litElement
 * @customElement
 */
export class AppCalendar extends LitElement {
  /**
   * Static getter styles
   * 
   * @returns {styles}
   */
  static get styles() {
    return css`
      /* GENERAL */
      * {
        box-sizing: border-box;
        font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
      }
      
      :host {
        background: var(--bg-color);
        position: relative;
      }
      
      /* Calendar */
      
      .calendar {
        display: block;
        position: relative;
        width: 100%;
        background: var(--neutral-color);
        border: 1px solid var(--border-color);
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
        * The name to say "Hello" to.
        */
      name: {type: String},

      /**
        * The object that holds the current date to represent current month
        */
      currentMonth: {type: Object},

      /**
        * The object that holds the current date
        */
      selectedDate: {type: Object},

      /**
       * array to hold all the events
       */
      events: {type:Array},

      /**
       * boolean that check whether to show popup event list
       */
      showAppMenu: {type: Boolean},

      /**
       * object that holds the date on which user creates an event
       */
      testDate: {type: Object},

      /**
       * boolean to show or hide add event dialog
       */
      showAddEvent: {type:Boolean},

      /**
       * object to hold the date on which to display popup event list
       */
      day: {type: Object},

      /**
       * holds top and left position of popu event list
       */
      appMenuPositions: {type: Object}
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.showAppMenu = false;
    this.showAddEvent = false;
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this.testDate = new Date();
    this.appMenuPositions = {top:'0px', left:'0px'}
    this.events = [
      {"id":1, "start":"2021-05-17T08:00:00.000Z","end":"2021-05-17T17:00:00.000Z","title":"Business of Software Conference"},
      {"id":2, "start":"2021-05-17T08:00:00.000Z","end":"2021-05-17T17:00:00.000Z","title":"test"},
      {"id":3, "start":"2021-05-22T12:00:00.000Z","end":"2021-05-21T20:00:00.000Z","title":"All hands"},
      {"id":4, "start":"2021-05-18T08:00:00.000Z","end":"2021-05-18T17:00:00.000Z","title":"Business of Software Conference"},
      {"id":5, "start":"2021-05-18T08:00:00.000Z","end":"2021-05-18T17:00:00.000Z","title":"test"},
      {"id":6, "start":"2021-05-22T12:00:00.000Z","end":"2021-05-21T20:00:00.000Z","title":"All hands"},
      {"id":7, "start":"2021-05-29T12:00:00.000Z","end":"2021-05-39T20:00:00.000Z","title":"Community binge marathon"},
      {"id":8, "start":"2021-05-18T06:00:00.000Z","end":"2021-05-18T07:00:00.000Z","title":"Team Meeting"},
      {"id":9, "start":"2021-05-17T06:00:00.000Z","end":"2021-05-17T07:00:00.000Z","title":"some Meeting"}
    ];

    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.handleShowAppMenu = this.handleShowAppMenu.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleSubmitEventData = this.handleSubmitEventData.bind(this);
    this.handleHideAddEvent = this.handleHideAddEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.counter = 0;
    this.shadowRoot.addEventListener('click', (e) => {
      // console.log(e.target);
      if(e.target!=this.menu && this.showAppMenu){
        this.counter++;
        if(this.counter>1){
          this.handleCancel();
        }
      }
    });
  }

  firstUpdated() {
    this.menu = this.shadowRoot.querySelector('app-menu');
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
  }

  prevMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
  }

  handleShowAppMenu(e, items, day, pos) {
    this.showAppMenu = true;
    this.testDate = day;
    this.appMenuPositions = pos;
    this.counter = 0;
  }

  handleCancel() {
    this.showAppMenu = false;
  }

  handleChangeEvent(id,start) {
    this.events = this.events.map((item) => {
      if(item['id'] == id) {
        item.start = start;
      } 
      return {...item}
    });
  }

  handleAddEvent(day) {
    this.showAddEvent = true;
    this.day = day;
  }

  handleHideAddEvent() {
    this.showAddEvent = false;
  }

  handleSubmitEventData(data) {
    data.id = this.events.length+1;
    this.events = [...this.events, data];
    this.showAddEvent = false;
  }

  // disconnectedCallback() {
  //   super.disconnectedCallback();

  // }

  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    console.log('render');
    return html`
      <div class="calendar">
        <app-calendar-header 
          .onPrevMonthClick="${this.prevMonth}"
          .onNextMonthClick="${this.nextMonth}"
          .currentMonth="${this.currentMonth}"
          ></app-calendar-header>
        <app-calendar-content 
          .events="${this.events}" 
          .currentMonth="${this.currentMonth}" 
          .selectedDate="${this.selectedDate}"
          .onMoreMenuClick="${this.handleShowAppMenu}"
          .onEventChange="${this.handleChangeEvent}"
          .onAddEvent="${this.handleAddEvent}"
          ></app-calendar-content>
        <app-menu 
        .onCancel="${this.handleCancel}" 
        .items="${this.events}" 
        .day="${this.testDate}"
        .positions="${this.appMenuPositions}"
        .showAppMenu="${this.showAppMenu}"
        ></app-menu>
      </div>
      ${this.showAddEvent? html`<app-add-event 
        .onSubmitData="${this.handleSubmitEventData}"
        .onHideAddEvent="${this.handleHideAddEvent}"
        .day="${this.day}"
        ></app-add-event>`: nothing}
    `;
  }

  

}
 
window.customElements.define('app-calendar', AppCalendar);
 