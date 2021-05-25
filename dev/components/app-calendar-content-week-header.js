import {LitElement, html, css} from 'lit';

import {format, addDays, startOfWeek, isSameDay} from 'date-fns';


/**
 * `<app-calendar-content-header>` Custom component to add a calendar content header eg. sun, mon, tue
 *
 * <app-calendar-content>
 *  <app-calendar-content-header></app-calendar-content-header>
 *
 * @polymer
 * @litElement
 * @customElement
 */
export class AppCalendarContentWeekHeader extends LitElement {

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
      
      .row-middle {
        align-items: center;
      }
      
      
      .col {
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
      }
      
      .col-start {
        justify-content: flex-start;
        text-align: left;
      }
      
      .col-center {
        justify-content: center;
        text-align: center;
      }
      
      .col-end {
        justify-content: flex-end;
        text-align: right;
      }
      
      .days {
        text-transform: uppercase;
        font-weight: 600;
        // color: var(--text-color-light);
        font-size: 70%;
        padding: .75em 0;
        border-bottom: 1px solid var(--border-color);
      }
      .selected {
        color: #039dfc;
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
       * holds the current date to represent month
       * @type {{currentMonth:Object}}
       */
      currentDate: {type: Object},
      selectedDate: {type: Object}
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.dateFormat = "EEE MM/dd"; 
  }

  /**
   * header template to be rendered
   */
  contentHeaderTemplate() {
    const days = [];
    let startDate = startOfWeek(this.currentDate)
    days.push(html`<div class="col col-center"></div>`)
    for (let i = 0; i < 7; i++) {
      days.push(
        html`<div class="col col-center ${isSameDay(addDays(startDate, i), this.selectedDate)?'selected':''}" key="${i}">
          ${format(addDays(startDate, i), this.dateFormat)}
        </div>`
      );
    }
    return html`<div class="days row">${days}</div>`;
  }

  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    return html`
      ${this.contentHeaderTemplate()}
    `;
  }

}

window.customElements.define('app-calendar-content-week-header', AppCalendarContentWeekHeader);
