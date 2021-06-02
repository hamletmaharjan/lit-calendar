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
          // line-height: 20px;
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
        height:25px;
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
    this.handleDrop = this.handleDrop.bind(this);
  }

  firstUpdated() {
    let droppableItems = this.shadowRoot.querySelectorAll('.row');
    if(droppableItems.length!=0){
      droppableItems.forEach(droppableItem => {
        droppableItem.addEventListener('drop', this.handleDrop);
        droppableItem.addEventListener('dragover', this.handleDragOver)
      });
    }
  }

  updated() {
    // console.log('here')
    let draggableItems = this.shadowRoot.querySelectorAll('.event');
    console.log('items',draggableItems)
    if(draggableItems.length!=0){
      draggableItems.forEach(draggableItem => {
        draggableItem.addEventListener('dragstart', (e)=>{ this.handleDragStart(e, draggableItem.getAttribute('key'))})
      });
    }
  }

  handleDragOver(e) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  /**
   * handler function for handling drop
   * @param {Object} e 
   */
  handleDrop(e) {
    // console.log(e.target.getAttribute('key'));
    // console.log(this)
    e.dataTransfer.effectAllowed = "move";
    let id = e.dataTransfer.getData('text/plain');
    let startTime = e.target.getAttribute('key');
    let selectedItem = this.events.find(eventItem => eventItem.id == id);
    console.log(selectedItem)
    let dur = this.timeDifference(selectedItem.startTime, selectedItem.endTime);
    let endTime = this.addTime(startTime, dur);

    console.log('heeee',startTime, endTime)
    let time = {startTime: startTime, endTime: endTime };
    this.onEventChange(id, this.currentMonth, time);
  }

  /**
   * 
   * @param {Object} e 
   * @param {Integer} key - key that represents id of event
   */
  handleDragStart(e, key) {
    console.log('drag')
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/plain", key);
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
    // let per = (total1/60) *100;
    let per = (total1/60) * 25;
    return per;
  }

  addTime(a, b) {
    let arr1 = a.split(':');
    let newHr1 = parseInt(arr1[0]);
    let newMin1 = parseInt(arr1[1]);
    let total1 = newMin1 + newHr1 * 60;
    let arr2 = b.split(':');
    let newHr2 = parseInt(arr2[0]);
    let newMin2 = parseInt(arr2[1]);
    let total2 = newMin2 + newHr2 * 60;
    let diff = total2 + total1;
    let hour = Math.floor(diff/60);
    let min = diff%60;
    let hourString = hour<10? '0' + hour: hour;
    let minString = min<10? '0' + min: min;
    return hourString + ':' + minString;
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

        myStyle.height = this.calcPer(item.duration) + 'px';
        myStyle.top = this.calcPer(this.timeDifference(formattedHours, item.startTime)) + 'px'
        console.log(myStyle)
        events.push(html`
          <div class="event" style="${styleMap(myStyle)}" draggable="true" key="${item.id}" duration="${item.duration}">
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
      <div class="col" key="${formatHours}">
        ${this.renderEvents(filteredEvents, formatHours)}
      </div>
      `)
      
      rows.push(
        html`
        <div class="row" @dblclick="${this.handleAddEvent}" key="${formatHours}">
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
 