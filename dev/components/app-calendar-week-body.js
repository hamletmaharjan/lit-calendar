import {LitElement, html, css} from 'lit';

import {format, addDays,startOfWeek, 
        endOfWeek, startOfMonth, endOfMonth} from 'date-fns';

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

      .body .row {
        border-bottom: 1px solid var(--border-color);
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
 
  /**
   * calender body template to be rendered
   */
  contentBodyTemplate() {
    const startDate = startOfWeek(this.currentMonth);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let formatHours = '';
    let hours = 0;
    while (hours < 24) {
      formatHours = hours<10? '0'+hours+':00':hours + ':00';
      days.push(html`<div class="col"><div class="hours">${this.tConvert(formatHours)}</div></div>`)
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
 