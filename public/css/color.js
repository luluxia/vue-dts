const fs = require('fs');

const cssFile = 'green.css';

fs.readFile(cssFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const hexRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g;

  const convertedData = data.replace(hexRegex, (match) => {
    const hex = match.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  });

  fs.writeFile(cssFile, convertedData, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('CSS file updated successfully!');
  });
});
