/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {format, addDays,startOfWeek, 
        endOfWeek, startOfMonth, endOfMonth} from 'date-fns';

import './app-calendar-cell';

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
export class AppCalendarBody extends LitElement {

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
        flex-basis: calc(100%/7);
        width: calc(100%/7);
        border-right: 1px solid var(--border-color);

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
      * The object that holds the current date
      */
      selectedDate: {type: Object},

      /**
      * The object that holds the current date to represent current month
      */
      currentMonth: {type: Object},

      /**
       * array to hold event passed from parent and pass it down
       */
      events: {type:Array},

      /**
       * handler function that triggers when user click on more events option
       */
      onMoreMenuClick: {type: Function},

      /**
       * handler function when event is changed on drag
       */
      onEventChange: {type: Function},

      /**
       * handler function when user adds event
       */
      onAddEvent: {type: Function}
    };
  }
 
  /**
   * calender body template to be rendered
   */
  contentBodyTemplate() {
    const monthStart = startOfMonth(this.currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    // console.log(typeof(monthStart));
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(
          html`
            <div class="col">
              <app-calendar-cell 
              .events="${this.events}"
              .day="${day}"
              .monthStart="${monthStart}"
              .selectedDate="${this.selectedDate}"
              .formattedDate="${formattedDate}"
              .onMoreMenuClick="${this.onMoreMenuClick}"
              .onEventChange="${this.onEventChange}"
              .onAddEvent="${this.onAddEvent}"
              ></app-calendar-cell>
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

window.customElements.define('app-calendar-body', AppCalendarBody);
 