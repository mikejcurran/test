const fs = require('fs');
const path = require('path');

// Define the correct path to your data.js file
const filePath = path.join('E:/Marzipano/MIKE/app-files/Fort Pond Brook/data.js');

// Read the content of the data.js file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading data.js:', err);
    return;
  }

  // Extract the APP_DATA object from the file
  let appData;
  try {
    eval(data);  // Safely evaluate the data file to retrieve APP_DATA
    appData = APP_DATA;  // Ensure that we retrieve the correct object
  } catch (e) {
    console.error('Error parsing data.js:', e);
    return;
  }

  // Modify the scenes to add next and previous hotspots
  const scenes = appData.scenes;
  
  scenes.forEach((scene, index) => {
    const nextSceneIndex = index + 1 < scenes.length ? index + 1 : 0;
    const prevSceneIndex = index - 1 >= 0 ? index - 1 : scenes.length - 1;

    // Add "Next" hotspot at 0 degrees (yaw: 0)
    const nextHotspot = {
      yaw: 0,
      pitch: 0,  // Adjust pitch as needed (0 is straight ahead)
      rotation: 0,
      target: scenes[nextSceneIndex].id
    };

    // Add "Previous" hotspot at 180 degrees (yaw: Math.PI or 3.14159 radians)
    const prevHotspot = {
      yaw: Math.PI,
      pitch: 0,  // Adjust pitch as needed
      rotation: 0,
      target: scenes[prevSceneIndex].id
    };

    // Add the hotspots to the scene
    scene.linkHotspots = scene.linkHotspots || [];
    scene.linkHotspots.push(nextHotspot, prevHotspot);
  });

  // Write the modified APP_DATA back to the data.js file
  const newData = `var APP_DATA = ${JSON.stringify(appData, null, 2)};`;

  fs.writeFile(filePath, newData, 'utf8', err => {
    if (err) {
      console.error('Error writing updated data.js:', err);
    } else {
      console.log('Hotspots added successfully to data.js');
    }
  });
});
