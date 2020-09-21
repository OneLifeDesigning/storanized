const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/'));

hbs.registerHelper(
  'ifEqual', function(arg1, arg2, options) {
    const val1 = arg1 ? arg1 = arg1.toString() : arg1 = ''
    const val2 = arg2 ? arg2 = arg2.toString() : arg2 = ''
    return val1 === val2 ? options.fn(this) : options.inverse(this)
  }
);
hbs.registerHelper(
  'ifDiferent', function(arg1, arg2, options) {
    const val1 = arg1 ? arg1 = arg1.toString() : arg1 = ''
    const val2 = arg2 ? arg2 = arg2.toString() : arg2 = ''
    return val1 === val2 ? options.inverse(this) : options.fn(this)
  }
);
hbs.registerHelper(
  'ifOr', function(arg1, arg2, options) {
    return arg1 || arg2 ? options.fn(this) : options.inverse(this)
  }
);
hbs.registerHelper(
  'DateFormat', function(date) {
    console.log(date);
    if (date) {
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return month < 10 ? `${day}-0${month}-${year}` : `${day}-${month}-${year}`
    }
  }
);

hbs.registerHelper(
  'Truncate', function(paragraph, num) {
    if (paragraph && paragraph.length <= num) {
      return paragraph
    }
    return paragraph.slice(0, num) + '...'  }
);
