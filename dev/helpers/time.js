/**
   * function to convert time in 24 hr format to 12 hr format
   * @param {String} time 
   * @returns String
   */
 tConvert = function(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? 'a' : 'p'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

timeDifference = function(a, b) {
  let arr1 = a.split(':');
  let newHr1 = parseInt(arr1[0]);
  let arr2 = b.split(':');
  let newHr2 = parseInt(arr2[0]);
  return newHr2-newHr1;
}

addTime = function(a, b) {
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
addHours = function(time, addition) {
  // let x = parseInt(time.substring(0,2));
  let arr = time.split(':');
  let newHr = parseInt(arr[0]);
  newHr += addition;
  let newStr = newHr<10? '0'+ newHr: newHr;
  return newStr + ':' + arr[1];
}

timeDiff = function(a, b) {
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

function calcPer(time) {
  let arr1 = time.split(':');
  let newHr1 = parseInt(arr1[0]);
  let newMin1 = parseInt(arr1[1]);
  let total1 = newMin1 + newHr1 * 60;
  let per = (total1/60) *100;
  return per;
}


export {tConvert, calcPer, timeDifference, addTime, addHours}