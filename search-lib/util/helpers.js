exports.delay = function (msec) {
  new Promise(resolve => setTimeout(resolve, msec));
};

exports.getNestedField = function getNestedField (obj, field) {
  let result = null;

  if (obj instanceof Array) {
    for (let i of obj) {
      result = getNestedField(obj[i]);
        if (result) {
          break;
        }   
    }
  } else {
    for (let prop in obj) {
      if (prop == field) {
        return obj[prop];
      }

      if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
        result = getNestedField(obj[prop]);
        if (result) {
          break;
        }
      } 
    }
  }
  return result;
};

exports.checkNested = function (obj) {
  for (let i = 1; i < arguments.length; i++) {
    if (!obj.hasOwnProperty(arguments[i])) {
      return false;
    }
    obj = obj[arguments[i]];
  }
  return true;
}