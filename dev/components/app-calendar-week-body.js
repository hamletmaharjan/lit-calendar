import {LitElement, html, css} from 'lit';

import {format, addDays,startOfWeek, 
        endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore} from 'date-fns';

import './app-calendar-week-cell';
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
export class AppCalendarWeekBody extends LitElement {

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
          position: relative;
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
        position:relative;
      }
      .body .row {
        // border-bottom: 1px solid var(--border-color);
      }
      
      .body .row:last-child {
        border-bottom: none;
      }
      
      .col {
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
      }
      
      /* Calendar */
      .body .col {
        flex-grow: 0;
        flex-basis: calc(100%/8);
        width: calc(100%/8);
        border-right: 1px solid var(--border-color);

      }
      .hours {
        text-align:center;
        padding:2px;
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
      onAddEvent: {type: Function}
    };
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
 
  /**
   * calender body template to be rendered
   */
  contentBodyTemplate() {
    console.log(this.timeDifference('11:50', '12:40'));
    const startDate = startOfWeek(this.currentMonth);
    let filteredEvents = this.events.filter(({...eventItem}) => {
      return {...isAfter(new Date(eventItem.start), startDate) && isBefore(new Date(eventItem.start), addDays(startDate,7))};
    });
    filteredEvents = filteredEvents.map(eventItem=> {
      return {...eventItem, duration: this.timeDifference(eventItem.startTime, eventItem.endTime)}
    });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    let formatHours = '';
    let hours = 0;
    while (hours < 24) {
      formatHours = hours<10? '0'+hours+':00':hours + ':00';
      days.push(html`<div class="col"><div class="hours">${this.tConvert(formatHours)} ${hours}</div></div>`)
      for (let i = 0; i < 7; i++) {
        day = addDays(startDate, i);
        formattedDate = format(day, dateFormat);
        days.push(
          html`
            <div class="col">
              <app-calendar-week-cell 
              .day="${day}"
              .selectedDate="${this.selectedDate}"
              .formattedDate="${formattedDate}"
              .formattedHours="${formatHours}"
              .currentMonth="${this.currentMonth}"
              .events="${filteredEvents}"
              ></app-calendar-week-cell>
            </div>
          `
        );
        day = addDays(day, 1);
      }
      rows.push(
        html`
        <div class="row" key=${day}>
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

window.customElements.define('app-calendar-week-body', AppCalendarWeekBody);
 