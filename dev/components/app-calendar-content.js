/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html} from 'lit';

import './app-calendar-body';
import './app-calendar-content-header';

/**
 * `<app-calendar-content>` Custom component to add a calendar content
 *
 * <app-calendar>
 *  <app-calendar-content></app-calendar-content>
 *
 * @polymer
 * @litElement
 * @customElement
 */
export class AppCalendarContent extends LitElement {

  /**
   * Static getter properties
   * 
   * @returns Object
   */
  static get properties() {
    return {
      /**
       * holds the current date to represent the month to pass down to its children components
       */
      currentMonth: {type: Object},

      /**
       * holds the current date to pass down to its children components
       */
      selectedDate: {type:Object},

      events: {type:Array},

      onMoreMenuClick: {type: Function},
      onEventChange: {type: Function},
      onAddEvent: {type: Function}
    };
  }

  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    return html`
      <div>
        <app-calendar-content-header
        .currentMonth="${this.currentMonth}"
        ></app-calendar-content-header>

        <app-calendar-body
          .events="${this.events}"
          .selectedDate="${this.selectedDate}"
          .currentMonth="${this.currentMonth}"
          .onMoreMenuClick="${this.onMoreMenuClick}"
          .onEventChange="${this.onEventChange}"
          .onAddEvent="${this.onAddEvent}"
          ></app-calendar-body>
      </div>
    `;
  }

}

window.customElements.define('app-calendar-content', AppCalendarContent);
 