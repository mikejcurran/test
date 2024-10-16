const fs = require('fs');

// Path to your data.js file
const filePath = './data.js';

// Function to restore names and IDs back to GSABxxxx format
function restoreOriginalData(content) {
  let namePattern = /"name":\s*"\d+"/g;
  let idPattern = /"id":\s*"\d+-\d+"/g;

  let i = 28;
  content = content.replace(namePattern, () => `"name": "GSAB00${i++}"`);
  
  i = 28;
  content = content.replace(idPattern, () => `"id": "0-gsab00${i++}"`);

  return content;
}

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Restore the content to original
  const restoredData = restoreOriginalData(data);

  // Write the restored content back to the file
  fs.writeFile(filePath, restoredData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log('File has been restored to original.');
  });
});
