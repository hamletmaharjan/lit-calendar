import {LitElement, html, css} from 'lit';
 
import {format} from 'date-fns';


/**
 * `<app-calendar-header>` Custom component to add a calendar header
 *
 * <app-calendar>
 *  <app-calendar-header></app-calendar-header>
 *
 * @polymer
 * @litElement
 * @customElement
 */
export class AppCalendarHeader extends LitElement {

  /**
   * Static styles
   */
  static styles = [
    css`
      .icon {
        font-family: 'Material Icons', serif;
        font-style: normal;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
      
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      } 

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
      
      
      /* Calendar */
    
      .header {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 115%;
        padding: 1.5em 0;
        border-bottom: 1px solid var(--border-color);
      }
      
      .header .icon {
        cursor: pointer;
        transition: .15s ease-out;
      }
      
      .header .icon:hover {
        transform: scale(1.75);
        transition: .25s ease-out;
        color: var(--main-color);
      }
      
      .header .icon:first-of-type {
        margin-left: 1em;
      }
      
      .header .icon:last-of-type {
        margin-right: 1em;
      }
      .tab {
        float:left;
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
      }
      .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        // padding: 14px 16px;
        transition: 0.3s;
        font-size: 17px;
        color:var(--text-color);
        // font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
      }
      
      /* Change background color of buttons on hover */
      .tab button:hover {
        background-color: #ddd;
      }
      
      /* Create an active/current tablink class */
      .tab button.active {
        background-color: #ccc;
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
       * holds the current date to represent the month
       * @type {{currentMonth:Object}}
       */
      currentMonth: {type: Object},

      /**
       * handler function for next month
       * @type {{onNextMonthClick:Function}}
       */
      onNextMonthClick: {type: Function},

      /**
       * handler function for previous month
       * @type {{onPrevMonthClick:Function}}
       */
      onPrevMonthClick: {type:Function},

      onChangeView: {type: Function},
      view: {type: String}
      
    };
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.dateFormat = "MMMM yyyy";
  }

  /**
   * render method
   * 
   * @returns {customElements}
   */
  render() {
    return html`
      <div class="header row flex-middle">
        <div class="col col-start">
          <div class="icon" @click="${this.onPrevMonthClick}">
            chevron_left
          </div>
        </div>
        <div class="col col-center">
          <span>
            ${format(this.currentMonth, this.dateFormat)}
          </span>
        </div>
        <div class="col col-end">
          <div class="tab">
            <button class="tablinks ${this.view=='month'?'active':''}" @click="${()=> this.onChangeView('month')}">month</button>
            <button class="tablinks ${this.view=='week'?'active':''}" @click="${()=> this.onChangeView('week')}">week</button>
            <button class="tablinks ${this.view=='day'?'active':''}" @click="${()=>this.onChangeView('day')}">day</button>
          </div>
          <div class="icon"  @click="${this.onNextMonthClick}">chevron_right</div>
        </div>
      </div>
    `;
  }

}

window.customElements.define('app-calendar-header', AppCalendarHeader);
