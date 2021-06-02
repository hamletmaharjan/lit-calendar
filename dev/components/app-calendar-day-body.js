import {LitElement, html, css} from 'lit';

import {format, addDays,startOfWeek, 
        endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore} from 'date-fns';

import { styleMap } from 'lit-html/directives/style-map';

import './app-calendar-day-cell';
import isSameDay from 'date-fns/isSameDay';
// import {addHours} from '../helpers/time';
// import {tConvert} from '../helpers/time';


/**
 * `<app-calendar-body>` Custom component to add a calendar body
 *
 * <app-calendar-content>
 *  <app-calendar-body></app-calendar-body>
 *
 * @polymer
 * @litElement
 * @customElement
 */
export class AppCalendarDayBody extends LitElement {

  /**
   * Static getter styles
   */
  static styles = [
    css`
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
          // position: relative;
      }
      
      /* GRID */
      .row {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
      }
      .body {
        // position:relative;
      }
      .body .row {
        border-bottom: 1px solid var(--border-color);
      }
      
      .body .row:last-child {
        border-bottom: none;
      }
      
    
      
      /* Calendar */
      .body .col:first-child {
        flex-grow: 0;
        flex-basis: calc(20%);
        width: calc(100%/7);
        border-right: 1px solid var(--border-color);

      }
      .body .col {
        flex-grow: 0;
        flex-basis: calc(80%);
        width: calc(100%/2);
        border-right: 1px solid var(--border-color);
        position:relative;
      }
      .hours {
        text-align:center;
        padding:2px;
      }
      .event {
        background:#039dfc;
        color:white;
        width:100%;
        height:100%;
        margin:0 auto;
        padding:0px 10px 0px 5px;
        border-radius:10px;
        // margin-top:2px;
        // transform: translate(0, 0);
        position:absolute;
        z-index: 10;
        top:10%;
        font-size:12px;
      }
      .event:hover{
        cursor:pointer;
      }
      .event-body{
        height: 95%;
        // background-color:red;
      }
      .resizer {
        height:5%;
        // background-color:green;
        cursor: s-resize;
      }
      .resizer:hover{
        cursor:s-resize;
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
      * The object that holds the current date
      * @type {{selectedDate:Object}}
      */
      selectedDate: {type: Object},

      /**
      * The object that holds the current date to represent current month
      * @type {{currentMonth:Object}}
      */
      currentMonth: {type: Object},

      /**
       * array to hold event passed from parent and pass it down
       * @type {{events:Array}}
       */
      events: {type:Array},

      /**
       * handler function that triggers when user click on more events option
       * @type {{onMoreMenuClick:Function}}
       */
      onMoreMenuClick: {type: Function},

      /**
       * handler function when event is changed on drag
       * @type {{onEventChange:Function}}
       */
      onEventChange: {type: Function},

      /**
       * handler function when user adds event
       * @type {{onAddEvent:Function}}
       */
      onAddEvent: {type: Function},

      eventStyle: {type: Object}
    };
  }

  constructor() {
    super();

    this.eventStyle = {height: '100%', top: '0%'};

    this.handleAddEvent = this.handleAddEvent.bind(this);
  }
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

  timeDifference(a, b) {
    // let arr1 = a.split(':');
    // let newHr1 = parseInt(arr1[0]);
    // let arr2 = b.split(':');
    // let newHr2 = parseInt(arr2[0]);
    // return newHr2-newHr1-1;
    let arr1 = a.split(':');
    let newHr1 = parseInt(arr1[0]);
    let newMin1 = parseInt(arr1[1]);
    let total1 = newMin1 + newHr1 * 60;
    let arr2 = b.split(':');
    let newHr2 = parseInt(arr2[0]);
    let newMin2 = parseInt(arr2[1]);
    let total2 = newMin2 + newHr2 * 60;
    let diff = total2- total1;
    let hour = Math.floor(diff/60);
    let min = diff%60;
    let hourString = hour<10? '0' + hour: hour;
    let minString = min<10? '0' + min: min;
    return hourString + ':' + minString;
  }

  addHours(time, addition) {
    // let x = parseInt(time.substring(0,2));
    let arr = time.split(':');
    let newHr = parseInt(arr[0]);
    newHr += addition;
    let newStr = newHr<10? '0'+ newHr: newHr;
    return newStr + ':' + arr[1];
  }

  calcPer(time) {
    let arr1 = time.split(':');
    let newHr1 = parseInt(arr1[0]);
    let newMin1 = parseInt(arr1[1]);
    let total1 = newMin1 + newHr1 * 60;
    let per = (total1/60) *100;
    return per;
  }

  handleAddEvent(event) {
    console.log('dblcl');
    this.onAddEvent(this.currentMonth);
  }

  renderEvents(filteredEvents, formattedHours) {
    let events = [];
    let myStyle = {};
    filteredEvents.forEach(item => {
      if(item.startTime >= formattedHours && item.startTime < this.addHours(formattedHours,1)){

        myStyle.height = this.calcPer(item.duration) + '%';
        myStyle.top = this.calcPer(this.timeDifference(formattedHours, item.startTime)) + '%'
        console.log(myStyle)
        events.push(html`
          <div class="event" style="${styleMap(myStyle)}" draggable="true">
            <div class="event-body">${item.title}</div>
            <div class="resizer"></div>
          </div>
        `)
      }
    });
    return events;
  }
 
  /**
   * calender body template to be rendered
   */
  contentBodyTemplate() {
    console.log(this.timeDifference('11:50', '12:40'));
    const startDate = startOfWeek(this.currentMonth);
    let filteredEvents = this.events.filter(({...eventItem}) => {
      return isSameDay(new Date(eventItem.start), this.currentMonth);
    });
    filteredEvents = filteredEvents.map(eventItem=> {
      return {...eventItem, duration: this.timeDifference(eventItem.startTime, eventItem.endTime)}
    });
    console.log(filteredEvents)
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    let formatHours = '';
    let hours = 0;
    while (hours < 24) {
      formatHours = hours<10? '0'+hours+':00':hours + ':00';
      days.push(html`
      <div class="col"><div class="hours">${this.tConvert(formatHours)}</div></div>
      <div class="col">
        ${this.renderEvents(filteredEvents, formatHours)}
      </div>
      `)
      
      rows.push(
        html`
        <div class="row" @dblclick="${this.handleAddEvent}">
          ${days}
        </div>
        `
      );
      days = [];
      hours++;
    }

    return html`
      <div class="body">${rows}</div>
    `;
  }
 
  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    return html`
      ${this.contentBodyTemplate()}
    `;
  }

}

window.customElements.define('app-calendar-day-body', AppCalendarDayBody);
 