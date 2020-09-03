const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/'));

hbs.registerHelper(
  'ifEquals', function(arg1, arg2, options) {
    const val1 = arg1 !== undefined ? arg1 = arg1.toString() : arg1 = ''
    const val2 = arg2 !== undefined ? arg2 = arg2.toString() : arg2 = ''
    return val1 === val2 ? options.fn(this) : options.inverse(this)
  }
);