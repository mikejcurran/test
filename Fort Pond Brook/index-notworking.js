'use strict';

// Utility functions (outside of the main IIFE)
function setupToggleProfileButton() {
    var toggleLongProfileButton = document.getElementById('toggleLongProfile');
    var longProfileContainer = document.getElementById('longProfileContainer');

    if (toggleLongProfileButton && longProfileContainer) {
        toggleLongProfileButton.addEventListener('click', function() {
            if (longProfileContainer.style.display === 'none') {
                longProfileContainer.style.display = 'block';
                toggleLongProfileButton.textContent = 'Hide Long Profile';
            } else {
                longProfileContainer.style.display = 'none';
                toggleLongProfileButton.textContent = 'Show Long Profile';
            }
        });
    } else {
        console.error('Long Profile elements not found');
    }
}

function initializeUI() {
    setupToggleProfileButton();
    
    var toggleMapButton = document.getElementById('toggleMap');
    var mapContainer = document.getElementById('mapContainer');

    if (toggleMapButton && mapContainer) {
        toggleMapButton.addEventListener('click', function() {
            if (mapContainer.style.display === 'none') {
                mapContainer.style.display = 'block';
                toggleMapButton.textContent = 'Hide Map';
                if (window.map && typeof window.map.invalidateSize === 'function') {
                    window.map.invalidateSize();
                }
            } else {
                mapContainer.style.display = 'none';
                toggleMapButton.textContent = 'Show Map';
            }
        });
    } else {
        console.error('Map elements not found');
    }
}

// Main Marzipano setup and functionality
(function() {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    // Grab elements from DOM.
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneListElement = document.querySelector('#sceneList');
    var sceneElements = document.querySelectorAll('#sceneList .scene');
    var sceneListToggleElement = document.querySelector('#sceneListToggle');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');
    var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

    // Detect desktop or mobile mode.
    if (window.matchMedia) {
        var setMode = function() {
            if (mql.matches) {
                document.body.classList.remove('desktop');
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
                document.body.classList.add('desktop');
            }
        };
        var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
        setMode();
        mql.addListener(setMode);
    } else {
        document.body.classList.add('desktop');
    }

    // Viewer options.
    var viewerOpts = {
        controls: {
            mouseViewMode: data.settings.mouseViewMode
        }
    };

    // Initialize viewer.
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Create scenes.
    var scenes = data.scenes.map(function(data) {
        // ... (keep your existing scene creation code)
    });

    // Set up autorotate, if enabled.
    var autorotate = Marzipano.autorotate({
        yawSpeed: 0.03,
        targetPitch: 0,
        targetFov: Math.PI/2
    });
    if (data.settings.autorotateEnabled) {
        autorotateToggleElement.classList.add('enabled');
    }

    // Set handler for autorotate toggle.
    autorotateToggleElement.addEventListener('click', toggleAutorotate);

    // Set up fullscreen mode, if supported.
    if (screenfull.enabled && data.settings.fullscreenButton) {
        document.body.classList.add('fullscreen-enabled');
        fullscreenToggleElement.addEventListener('click', function() {
            screenfull.toggle();
        });
        screenfull.on('change', function() {
            if (screenfull.isFullscreen) {
                fullscreenToggleElement.classList.add('enabled');
            } else {
                fullscreenToggleElement.classList.remove('enabled');
            }
        });
    } else {
        document.body.classList.add('fullscreen-disabled');
    }

    // Set handler for scene list toggle.
    sceneListToggleElement.addEventListener('click', toggleSceneList);

    // Start with the scene list open on desktop.
    if (!document.body.classList.contains('mobile')) {
        showSceneList();
    }

    // Set handler for scene switch.
    scenes.forEach(function(scene) {
        var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
        el.addEventListener('click', function() {
            switchScene(scene);
            // On mobile, hide scene list after selecting a scene.
            if (document.body.classList.contains('mobile')) {
                hideSceneList();
            }
        });
    });

    function sanitize(s) {
        return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }

    function switchScene(scene) {
        stopAutorotate();
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
        startAutorotate();
        updateSceneName(scene);
        updateSceneList(scene);
        toggleWelcomeBox(scene.data.id);
    }

    function updateSceneName(scene) {
        sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    function updateSceneList(scene) {
        for (var i = 0; i < sceneElements.length; i++) {
            var el = sceneElements[i];
            if (el.getAttribute('data-id') === scene.data.id) {
                el.classList.add('current');
            } else {
                el.classList.remove('current');
            }
        }
    }

    function showSceneList() {
        sceneListElement.classList.add('enabled');
        sceneListToggleElement.classList.add('enabled');
    }

    function hideSceneList() {
        sceneListElement.classList.remove('enabled');
        sceneListToggleElement.classList.remove('enabled');
    }

    function toggleSceneList() {
        sceneListElement.classList.toggle('enabled');
        sceneListToggleElement.classList.toggle('enabled');
    }

    function startAutorotate() {
        if (!autorotateToggleElement.classList.contains('enabled')) {
            return;
        }
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(3000, autorotate);
    }

    function stopAutorotate() {
        viewer.stopMovement();
        viewer.setIdleMovement(Infinity);
    }

    function toggleAutorotate() {
        if (autorotateToggleElement.classList.contains('enabled')) {
            autorotateToggleElement.classList.remove('enabled');
            stopAutorotate();
        } else {
            autorotateToggleElement.classList.add('enabled');
            startAutorotate();
        }
    }

    function toggleWelcomeBox(sceneId) {
        var welcomeBox = document.getElementById('welcomeBox');
        var openingSceneId = '88-gsab0116';  // Replace with the ID of your opening scene

        if (sceneId === openingSceneId) {
            welcomeBox.style.display = 'block';  // Show the welcome box
        } else {
            welcomeBox.style.display = 'none';   // Hide the welcome box
        }
    }

    // Expose necessary functions globally
    window.switchScene = switchScene;
    window.toggleWelcomeBox = toggleWelcomeBox;

    // Initialize UI and display the initial scene
    initializeUI();
    switchScene(scenes[88]);

})();

// Ensure initializeUI is called after the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
} else {
    initializeUI();
}