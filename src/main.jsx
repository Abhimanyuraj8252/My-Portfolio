import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Polyfill to make wheel/touch events passive by default (fixes Chrome violations from @react-three/drei)
(function () {
  if (typeof EventTarget !== 'undefined') {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const passiveEvents = ['wheel', 'touchstart', 'touchmove', 'touchend'];
      if (passiveEvents.includes(type)) {
        let newOptions = options;
        if (typeof options === 'boolean') {
          newOptions = { capture: options, passive: true };
        } else if (typeof options === 'object' || options === undefined) {
          newOptions = { ...options, passive: options?.passive !== false };
        }
        return originalAddEventListener.call(this, type, listener, newOptions);
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
