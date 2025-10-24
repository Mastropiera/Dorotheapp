// public/sounds/sw-sounds.js
// This file is imported by the service worker (`sw.js`) to provide sound data.

// Since the service worker cannot use ES6 modules, we attach the sound source to `self`.
// This makes ALARM_SOUND_SRC available as a global variable within the service worker's scope.
// Using a full path from the public root ensures it's accessible.
self.ALARM_SOUND_SRC = '/sounds/despertador.mp3';
