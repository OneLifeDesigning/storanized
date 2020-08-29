const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views'));


hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});