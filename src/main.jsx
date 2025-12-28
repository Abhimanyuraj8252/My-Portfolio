import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fix: Force wheel event listeners to be passive (for @react-three/drei OrbitControls)
// This only affects 'wheel' events to avoid breaking other functionality
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'wheel') {
      let newOptions = options;
      if (typeof options === 'boolean') {
        newOptions = { capture: options, passive: true };
      } else if (typeof options === 'object') {
        newOptions = { ...options, passive: true };
      } else {
        newOptions = { passive: true };
      }
      return originalAddEventListener.call(this, type, listener, newOptions);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
})();

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
