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
       * @type {{currentMonth:Object}}
       */
      currentMonth: {type: Object},

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
 