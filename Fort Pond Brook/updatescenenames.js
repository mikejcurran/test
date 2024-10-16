const fs = require('fs');

// Path to your data.js file
const filePath = './data.js';

// Function to modify only the "name" fields and leave "id" fields intact
function modifyNames(content) {
  // Find all occurrences of "name": "GSABxxxx" and replace them with sequential numbers
  let namePattern = /"name":\s*"GSAB\d+"/g;

  let i = 1;
  content = content.replace(namePattern, () => `"name": "${i++}"`);

  return content;
}

// Read the data.js file as plain text
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Modify only the names
  const modifiedData = modifyNames(data);

  // Write the modified content back to the original file
  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log('File has been modified successfully, only names were changed!');
  });
});
