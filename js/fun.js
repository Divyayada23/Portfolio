/* Fun house scene: builds the pulsing string-light bulbs and the drifting fireflies.
   (Opening and closing the scene is handled by js/nav.js.)
   Plain JavaScript, no libraries. */
(function () {
  'use strict';

  var fun = document.getElementById('fun');
  if (!fun) return;

  /* ---------- the pulsing bulbs ---------- */
  var bulbBox = fun.querySelector('.bulbs');
  (window.FUN_BULBS || []).forEach(function (b) {
    var el = document.createElement('span');
    el.className = 'bulb';
    el.style.left = (b[0] / 640 * 100) + '%';
    el.style.top = (b[1] / 360 * 100) + '%';
    el.style.setProperty('--c', b[3]);
    /* a ripple of light travels left to right along the strings */
    el.style.animationDelay = 'calc(var(--beat) * ' + (-4 + (b[0] / 640) * 4).toFixed(3) + ')';
    bulbBox.appendChild(el);
  });

  /* ---------- the fireflies ---------- */
  var flyBox = fun.querySelector('.fireflies');
  var FLY_COLORS = ['255,233,138', '255,209,106', '159,245,208', '140,230,255'];
  for (var i = 0; i < 26; i++) {
    var f = document.createElement('span');
    f.className = 'firefly';
    f.style.left = (8 + Math.random() * 84) + '%';
    f.style.top = (30 + Math.random() * 62) + '%';     // mostly the meadow and lower trees
    f.style.setProperty('--c', FLY_COLORS[i % FLY_COLORS.length]);
    f.style.setProperty('--dx', (Math.random() * 24 - 12).toFixed(1) + 'vmin');
    f.style.setProperty('--dy', (Math.random() * -18 - 2).toFixed(1) + 'vmin');
    f.style.setProperty('--dur', (7 + Math.random() * 9).toFixed(1) + 's');
    f.style.setProperty('--blink', (1.6 + Math.random() * 2.2).toFixed(2) + 's');
    f.style.animationDelay = '-' + (Math.random() * 10).toFixed(1) + 's, -' + (Math.random() * 3).toFixed(1) + 's';
    flyBox.appendChild(f);
  }
})();
