const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views'));


hbs.registerHelper('ifvalue', function(conditional, options) {
  if (options.hash.value === conditional) {
    options.fn(this)
  } else {
    options.inverse(this);
  }
});