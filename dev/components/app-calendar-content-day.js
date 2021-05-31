import {LitElement, html, nothing} from 'lit';

import './app-calendar-day-body';
import './app-calendar-content-day-header';


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
export class AppCalendarContentDay extends LitElement {

  /**
   * Static getter properties
   * 
   * @returns Object
   */
  static get properties() {
    return {
      /**
       * holds the current date to represent the month to pass down to its children components
       * @type {{currentMonth:Object}}
       */
      currentMonth: {type: Object},
      currentDate: {type: Object},

      /**
       * holds the current date to pass down to its children components
       * @type {{selectedDate:Object}}
       */
      selectedDate: {type:Object},

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
       * handler function when event changes on drag
       * @type {{onEventChange:Function}}
       */
      onEventChange: {type: Function},

      /**
       * handler function when user adds event
       * @type {{onAddEvent:Function}}
       */
      onAddEvent: {type: Function},
      view: {type: String}
    };
  }

  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    // return this.view=="day"? html`<div>day</div>`:nothing;
    return this.view=="day" ? html`
      <div>
        <app-calendar-content-day-header
        .currentDate="${this.currentDate}"
        .selectedDate="${this.selectedDate}"
        ></app-calendar-content-day-header>
      </div>
      <app-calendar-day-body
        .events="${this.events}"
        .selectedDate="${this.selectedDate}"
        .currentMonth="${this.currentMonth}"
        .onMoreMenuClick="${this.onMoreMenuClick}"
        .onEventChange="${this.onEventChange}"
        .onAddEvent="${this.onAddEvent}"
        ></app-calendar-day-body>
      
    `:nothing;
  }

}

window.customElements.define('app-calendar-content-day', AppCalendarContentDay);
 