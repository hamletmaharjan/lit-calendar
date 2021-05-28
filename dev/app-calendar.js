import {LitElement, html, css, nothing} from 'lit';

import {addMonths, subMonths, isAfter, isBefore, isSameDay, formatISO, subWeeks, addWeeks} from 'date-fns';

import './components/app-menu';
import './components/app-add-event';
import './components/app-calendar-header';
import {commonCss} from './css/globalCss';
import './components/app-calendar-cell.js';
import './components/app-calendar-content.js';
import './components/app-calendar-content-header.js';

import './components/app-calendar-content-week';


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
   */
  static styles = [
    commonCss,
    css`
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
        * The object that holds the current date to represent current month
        * @type {{currentMonth:Object}}
        */
      currentMonth: {type: Object},

      /**
        * The object that holds the current date
        * @type {{selectedDate:Object}}
        */
      selectedDate: {type: Object},

      /**
       * array to hold all the events
       * @type {{events:Array}}
       */
      events: {type:Array},

      /**
       * boolean that check whether to show popup event list
       * @type {{showAppMenu:Boolean}}
       */
      showAppMenu: {type: Boolean},

      /**
       * object that holds the date on which user creates an event
       * @type {{testDate:Object}}
       */
      testDate: {type: Object},

      /**
       * boolean to show or hide add event dialog
       * @type {{showAddEvent:Boolean}}
       */
      showAddEvent: {type:Boolean},

      /**
       * object to hold the date on which to display popup event list
       * @type {{day:Object}}
       */
      day: {type: Object},

      /**
       * holds top and left position of popu event list
       * @type {{appMenuPositions:Object}}
       */
      appMenuPositions: {type: Object},

      view: {type:String}
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.view = 'week';
    this.showAppMenu = false;
    this.showAddEvent = false;
    this.testDate = new Date();
    this.currentMonth = new Date();
    this.selectedDate = new Date();
    this.appMenuPositions = {top:'0px', left:'0px'}
    this.events = [
      {"id":1, "start":"2021-05-17","end":"2021-05-17","startTime":"12:00", "endTime":"13:00","title":"Business of Software Conference"},
      {"id":2, "start":"2021-05-17","end":"2021-05-17","startTime":"15:00", "endTime":"17:00","title":"test"},
      {"id":3, "start":"2021-05-22","end":"2021-05-21","startTime":"09:00", "endTime":"12:00","title":"All hands"},
      {"id":4, "start":"2021-05-18","end":"2021-05-18","startTime":"11:00", "endTime":"18:00","title":"Stand up"},
      {"id":5, "start":"2021-05-18","end":"2021-05-18","startTime":"09:00", "endTime":"12:00","title":"test"},
      {"id":6, "start":"2021-05-22","end":"2021-05-21","startTime":"03:00", "endTime":"05:00","title":"weekend program"},
      {"id":7, "start":"2021-05-29","end":"2021-05-39","startTime":"20:00", "endTime":"22:00","title":"Community binge marathon"},
      {"id":8, "start":"2021-05-18","end":"2021-05-18","startTime":"05:45", "endTime":"07:30","title":"Team Meeting"},
      {"id":9, "start":"2021-05-17","end":"2021-05-17","startTime":"09:00", "endTime":"11:00","title":"some Meeting"}
    ];

    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleChangeView = this.handleChangeView.bind(this);
    this.handleShowAppMenu = this.handleShowAppMenu.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleHideAddEvent = this.handleHideAddEvent.bind(this);
    this.handleSubmitEventData = this.handleSubmitEventData.bind(this);
  }

  /**
   * function to add click event listener when use click on anywhere
   */
  connectedCallback() {
    super.connectedCallback();

    this.counter = 0;
    this.shadowRoot.addEventListener('click', this.clickHandler);
  }

  /**
   * Handler function for click event
   * @param {Object} event 
   */
  clickHandler(event) {
    if(event.target!=this.menu && this.showAppMenu){
      this.counter++;
      if(this.counter>1){
        this.handleCancel();
      }
    }
  }

  handleChangeView(value) {
    this.view = value;
  }

  /**
   * function to grap app-menu when first updated
   */
  firstUpdated() {
    this.menu = this.shadowRoot.querySelector('app-menu');
  }

  /**
   * handler function when use click the next icon to add current day by a month
   */
  nextMonth() {
    if(this.view=='week') {
      this.currentMonth = addWeeks(this.currentMonth,1);
    }
    else{
      this.currentMonth = addMonths(this.currentMonth, 1);
    }
    
  }

  /**
   * handler function when use click the next icon to subtract current day by a month
   */
  prevMonth() {
    if(this.view=='week') {
      this.currentMonth = subWeeks(this.currentMonth,1);
    }
    else{
      this.currentMonth = subMonths(this.currentMonth, 1);
    }
   
  }

  /**
   * Handler function to show app menu
   * @param {Object} e - click event 
   * @param {Array} items - items to be shown in app menu
   * @param {Object} day - day on which to show app menu
   * @param {Object} pos - positon of the component
   */
  handleShowAppMenu(e, items, day, pos) {
    this.showAppMenu = true;
    this.testDate = day;
    this.appMenuPositions = pos;
    this.counter = 0;
  }

  /**
   * handler function to cancel app menu
   */
  handleCancel() {
    this.showAppMenu = false;
  }

  /**
   * handler function when drop event occurs on a cell
   * @param {Integer} id - id of the event
   * @param {String} start - new start date of the event
   */
  handleChangeEvent(id,start) {
    if(this.events.length!=0){
      this.events = this.events.map((item) => {
        if(item['id'] == id) {
          item.start = start;
        } 
        return {...item}
      });
    }
    else {
      console.log('empty events list');
    }
  }

  /**
   * 
   * @param {Object} day - day on which add event is clicked on
   */
  handleAddEvent(day) {
    this.showAddEvent = true;
    this.day = day;
  }

  /**
   * handler function to hide add app event dialog
   */
  handleHideAddEvent() {
    this.showAddEvent = false;
  }

  /**
   * 
   * @param {Object} data - data contains details for new event
   */
  handleSubmitEventData(data) {
    data.id = this.events.length+1;
    this.events = [...this.events, data];
    this.showAddEvent = false;
  }

  /**
   * remove click event listener
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    this.shadowRoot.removeEventListener('click', this.clickHandler);
  }

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
          .onChangeView="${this.handleChangeView}"
          .view="${this.view}"
          ></app-calendar-header>

        <app-calendar-content 
          .events="${this.events}" 
          .currentMonth="${this.currentMonth}" 
          .selectedDate="${this.selectedDate}"
          .onMoreMenuClick="${this.handleShowAppMenu}"
          .onEventChange="${this.handleChangeEvent}"
          .onAddEvent="${this.handleAddEvent}"
          .view="${this.view}"
          ></app-calendar-content>

        <app-calendar-content-week
          .currentDate="${this.currentMonth}"
          .currentMonth="${this.currentMonth}"
          .selectedDate="${this.selectedDate}"
          .events="${this.events}" 
          .onMoreMenuClick="${this.handleShowAppMenu}"
          .onEventChange="${this.handleChangeEvent}"
          .onAddEvent="${this.handleAddEvent}"
          .view="${this.view}"
        >
        </app-calendar-content-week>
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
