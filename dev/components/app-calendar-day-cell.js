import {LitElement, html, css, nothing} from 'lit';

import {isSameDay, isSameMonth, formatISO, format} from 'date-fns';

import './app-menu';
import { styleMap } from 'lit-html/directives/style-map';


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
export class AppCalendarDayCell extends LitElement {

  /**
   * Staticstyles
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
      
      
      /* Calendar */
    
      .cell {
        position: relative;
        height: 2em;
        // border-right: 1px solid var(--border-color);
        // border-top: 1px solid var(--border-color);
        overflow: hidden;
        cursor: pointer;
        background: var(--neutral-color);
        transition: 0.25s ease-out;
      }
      
      .cell:hover {
        background: var(--bg-color);
        transition: 0.5s ease-out;
      }
      
      .selected {
        background: var(--bg-color);
      }
      
      .cell:last-child {
        border-right: none;
      }
      
      .cell .number {
        position: absolute;
        font-size: 82.5%;
        line-height: 1;
        top: .75em;
        right: .75em;
        font-weight: 700;
      }
      
      .disabled {
        color: var(--text-color-light);
        pointer-events: none;
      }
      
      .cell .bg {
        font-weight: 700;
        line-height: 1;
        color: var(--main-color);
        opacity: 0;
        font-size: 8em;
        position: absolute;
        top: -.2em;
        right: -.05em;
        transition: .25s ease-out;
        letter-spacing: -.07em;
      }
      
      .cell:hover .bg, .selected .bg  {
        opacity: 0.05;
        transition: .5s ease-in;
      }
      .top {
        height:35%;
        // background:red;
      }
      .bottom {
        font-size:12px;
        position:relative;
      }
      .event {
        background:#039dfc;
        color:white;
        width:100%;
        height:100%;
        margin:0 auto;
        padding:0px 10px 0px 5px;
        // border-radius:5px;
        // margin-top:2px;
        transform: translate(0, 0);
        position:absolute;
        z-index: 10;
        // top:15px;
        font-size:12px;
      }
      .more {
        text-align:center;
      }
      app-menu {
        position: absolute;
        top:5px;
        z-index:4;
      }
      .time {
        color: #64fa9d;
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
       * @type {{formattedDate:String}}
       */
      formattedDate: {type: String},

      /**
       * holds the current date
       * @type {{selectedDate:Object}}
       */
      selectedDate: {type: Object},

      /**
       * holds the date for the current cell
       * @type {{day:Object}}
       */
      day: {type: Object},

      /**
       * holds the start of the current month
       * @type {{monthStart:Object}}
       */
      monthStart: {type:Object},

      /**
       * holds all the events
       * @type {{events:Array}}
       */
      events: {type:Array},

      /**
       * handler function to show app menu
       * @type {{showAppMenu:Boolean}}
       */
      showAppMenu: {type: Boolean},

      /**
       * handler function when more is clicked
       * @type {{onMoreMenuClick:Function}}
       */
      onMoreMenuClick: {type: Function},

      /**
       * boolean to check if there are more than two event on a day
       * @type {{hasMore:Boolean}}
       */
      hasMore: {type: Boolean},

      /**
       * handler function when event is changed on drag n drop
       * @type {{onEventChange:Function}}
       */
      onEventChange: {type: Function},

      /**
       * handler function when user adds an event
       * @type {{onAddEvent:Function}}
       */
      onAddEvent: {type: Function},
      formattedHours: {type: String},
      cellStyles: {type: Object}
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.hasMore = false;
    this.showAppMenu = false;
    this.cellStyles = {}
    this.cellStyles.borderTop = '1px solid var(--border-color);'
  }

  /**
   * to add doubleclick listener for adding event dialog
   */
  connectedCallback() {
    super.connectedCallback();

    // this.shadowRoot.addEventListener('dblclick', (event)=> {
    //   this.onAddEvent(this.day);
    // });
  }

  /**
   * handler function when more list option is clicked
   * @param {Object} event 
   */
  handleMoreClick(event) {
    this.showAppMenu = true;
    let rect = this.shadowRoot.querySelector('#test').getBoundingClientRect();
    let filteredEvents = this.events.filter(eventItem => {
      return isSameDay(new Date(eventItem.start), this.day);
    });
    this.onMoreMenuClick(event, filteredEvents, this.day, {left: rect.x-5 + 'px', top: rect.y-5 + 'px'});
  }

  /**
   * function to get all the events to add drag and drop events listeners
   */
  updated() {
    if(this.cellStyles.borderTop=="none"){
      console.log(this.cellStyles)
    }
    
    // this.cellStyles.borderTop = '1px solid var(--border-color);'
    // this.cellStyles = {...this.cellStyles}
    // let draggableItems = this.shadowRoot.querySelectorAll('.event');
    // if(draggableItems.length!=0){
    //   draggableItems.forEach(draggableItem => {
    //     draggableItem.addEventListener('dragstart', (e)=>{ this.handleDragStart(e, draggableItem.getAttribute('key'))})
    //   });
    // }
    // this.addEventListener('dragover', this.handleDragOver);
    // this.addEventListener('drop', this.handleDrop);
  }

  willUpdate() {
    // console.log('her')
    this.cellStyles.borderTop = '1px solid var(--border-color);'
    // this.cellStyles = {...this.cellStyles }
  }

  /**
   * handler function for drag over event
   * @param {Object} e 
   */
  handleDragOver(e) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  /**
   * handler function for handling drop
   * @param {Object} e 
   */
  handleDrop(e) {
    e.dataTransfer.effectAllowed = "move";
    let id = e.dataTransfer.getData('text/plain');
    this.onEventChange(id, format(this.day,'yyyy-MM-dd'))
  }

  /**
   * 
   * @param {Object} e 
   * @param {Integer} key - key that represents id of event
   */
  handleDragStart(e, key) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/plain", key);
  }

  timeDifference(a, b) {
    let arr1 = a.split(':');
    let newHr1 = parseInt(arr1[0]);
    let arr2 = b.split(':');
    let newHr2 = parseInt(arr2[0]);
    return newHr2-newHr1;
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
  addHours(time, addition) {
    // let x = parseInt(time.substring(0,2));
    let arr = time.split(':');
    let newHr = parseInt(arr[0]);
    newHr += addition;
    let newStr = newHr<10? '0'+ newHr: newHr;
    return newStr + ':' + arr[1];
  }

  timeDiff(a, b) {
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

  calcPer(time) {
    let arr1 = time.split(':');
    let newHr1 = parseInt(arr1[0]);
    let newMin1 = parseInt(arr1[1]);
    let total1 = newMin1 + newHr1 * 60;
    let per = (total1/60) *100;
    return per;
  }

  /**
   * template to be rendered
   * @returns html
   */
  renderEventsTemplate() {
    let allEvents = [];
    let count = 0;
    this.sortedEvents = [...this.events];
    // this.sortedEvents.sort(function (a, b) {
    //   return a.startTime.localeCompare(b.startTime);
    // });
    this.sortedEvents.forEach(({...item}) => {
      if(isSameDay(new Date(item.start), this.day)){
        // console.log(this.formattedHours.localeCompare(item.startTime))
        // if(this.formattedHours.localeCompare(item.startTime) >= 0 && this.formattedHours.localeCompare(item.endTime) < 0){
        if(item.startTime>= this.formattedHours && item.startTime< this.addHours(this.formattedHours,1)){
          let styles = {}
          this.cellStyles.borderTop = '1px solid var(--border-color);'
          // console.log('main')
          if(item.duration == '01:00'){
            styles.borderRadius = '10px';
          }
          else {
            styles.borderRadius = '10px 10px 0px 0px';
          }
          allEvents.push(html `<div class="empty" style="${styleMap({
            height: this.calcPer(this.timeDiff(this.formattedHours, item.startTime)) + '%'
          })}"></div>`)
          allEvents.push(html`<div class="event" style="${styleMap(styles)}" draggable="true"><span>${item.title}</span></div>`)
        }
        
        else if(item.startTime<= this.formattedHours && this.addTime(item.startTime, item.duration)> this.formattedHours) {
          let styles= {};
          // console.log('follow')
          // console.log(this.addTime(item.startTime, item.duration));
          // console.log('bordoe non')
          this.cellStyles.borderTop = 'none'
          if(this.timeDiff(this.formattedHours,this.addTime(item.startTime, item.duration)) <= '01:00') {
            styles.borderRadius = '0px 0px 10px 10px';
            styles.height = this.calcPer(this.timeDiff(this.formattedHours,this.addTime(item.startTime, item.duration))) + '%';
            // console.log(item.title, this.timeDiff(this.addTime(item.startTime, item.duration), this.formattedHours))
          }
          allEvents.push(html`<div class="event" style="${styleMap(styles)}" draggable="true"><span></span></div>`)
        }
        // if(count<2){
        //   allEvents.push(
        //     html`
        //       <div class="event" draggable="true" key="${item.id}">
        //         <span class="time">${this.tConvert(item.startTime)}</span><span>${item.title.substring(0,9)}</span>
        //       </div>
        //     `
        //   )
        // }
        count++;
      }
    });

    // if(count>2){
    //   this.hasMore = true;
    //   allEvents.push(
    //     html`
    //       <div class="more">
    //         <span @click="${this.handleMoreClick}">+ ${count-2} more</span>
    //       </div>
    //     `
    //   )
    // }

    return allEvents;
  }

  /**
   * function to convert time in 24 hr format to 12 hr format
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
    // console.log('cell')
    return html`<div>hello</div>`;
    return html`
        <div class="cell" style="${styleMap(this.cellStyles)}">
          ${this.renderEventsTemplate()}
        </div>
    `;
    return html`
      <div id="test"
        class="cell ${
        !isSameMonth(this.day, this.monthStart)
          ? "disabled"
          : isSameDay(this.day, this.selectedDate) ? "selected" : ""
        }"
        key=${this.day}>
        <div class="top">
          <span class="number">${this.formattedDate}</span>
        </div>
        <div class="bottom">
          ${this.renderEventsTemplate()}
        </div>
      </div> 
    `;
  }

}

window.customElements.define('app-calendar-day-cell', AppCalendarDayCell);
