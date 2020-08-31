
  const path  = require('path');
  const exec = require('child_process').exec;

  const cssPath = path.join(__dirname, '../../public/css/');

  module.exports = () => {
    return new Promise((resolve, reject) => {
      exec(`rm -r ${cssPath}`, error => {
        if (error) {
          reject(error);
        }

        console.log('Deleted CSS files');
        resolve();
      });
    }).catch(console.error);
  };
