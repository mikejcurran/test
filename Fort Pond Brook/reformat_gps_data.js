const fs = require('fs');
const path = require('path');

// Define the path to the input and output files
const inputFilePath = path.join(__dirname, 'gps_data.json');
const outputFilePath = path.join(__dirname, 'gps_data_formatted.json');

// Function to preprocess the JSON string and fix common issues
function preprocessJSON(data) {
  // Add fixes to handle common malformed JSON issues, like missing commas
  // Replace any occurrences of `\"` without trailing commas and quotes
  let fixedData = data.replace(/\"(\s*\n)/g, '\",$1');

  // Optional: Add more preprocessing steps if needed
  return fixedData;
}

// Read the content of the gps_data.json file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading gps_data.json:', err);
    return;
  }

  // Preprocess the JSON data to fix common formatting issues
  let processedData = preprocessJSON(data);

  let gpsData;
  try {
    gpsData = JSON.parse(processedData);
  } catch (e) {
    console.error('Error parsing gps_data.json after preprocessing:', e);
    return;
  }

  const formattedData = {};

  // Loop through each entry in the GPS data and reformat it
  Object.keys(gpsData).forEach(key => {
    const entry = gpsData[key];

    if (entry.GPSLatitude && entry.GPSLongitude && entry.GPSLatitudeRef && entry.GPSLongitudeRef) {
      const formattedLatitude = convertDMSToDecimal(entry.GPSLatitude, entry.GPSLatitudeRef);
      const formattedLongitude = convertDMSToDecimal(entry.GPSLongitude, entry.GPSLongitudeRef);

      formattedData[key] = {
        SourceFile: entry.SourceFile,
        GPSLatitude: formattedLatitude,
        GPSLongitude: formattedLongitude
      };
    }
  });

  // Write the formatted data to a new file
  fs.writeFile(outputFilePath, JSON.stringify(formattedData, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing formatted GPS data:', err);
    } else {
      console.log('Formatted GPS data written to gps_data_formatted.json');
    }
  });
});

// Function to convert DMS (Degrees, Minutes, Seconds) to Decimal format
function convertDMSToDecimal(dms, ref) {
  const parts = dms.match(/(\d+) deg (\d+)' (\d+\.\d+)"/);
  if (!parts) return null;

  const degrees = parseFloat(parts[1]);
  const minutes = parseFloat(parts[2]);
  const seconds = parseFloat(parts[3]);
  let decimal = degrees + (minutes / 60) + (seconds / 3600);

  // Apply hemisphere to get the correct sign for coordinates
  if (ref === 'S' || ref === 'W') {
    decimal = decimal * -1;
  }

  return decimal;
}
