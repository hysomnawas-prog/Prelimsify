// no-inspect.js
// Deters casual right-click "Inspect" / view-source / DevTools shortcuts.
// NOTE: This cannot truly block a determined user from opening DevTools
// (e.g. via the browser's top-right menu) — browsers do not expose an API
// for that. It only removes the easy entry points.

(function () {
  // Disable right-click context menu (removes the "Inspect" menu item)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Disable common DevTools / view-source keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    var key = e.key;

    // F12
    if (key === 'F12') {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd + Shift + I / J / C  (DevTools, Console, Inspect element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
        (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd + U (view source)
    if ((e.ctrlKey || e.metaKey) && (key === 'U' || key === 'u')) {
      e.preventDefault();
      return;
    }
  });
})();
