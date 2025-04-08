const customSpeeds = [3, 4, 5];

// We use this to check if we're in the Playback Speed submenu
function isSpeedSubmenuOpen() {
  const panelMenu = document.querySelector('.ytp-panel-menu');
  if (!panelMenu) return false;

  const items = Array.from(panelMenu.querySelectorAll('.ytp-menuitem-label'));
  return items.some(item => {
    const text = item.textContent.trim();
    return text === "0.25" || text === "1.25" || text === "2";
  });
}

// Here we are observing for any submenu opening

function injectCustomSpeedOptions() {
  const panelMenu = document.querySelector('.ytp-panel-menu');
  if (!panelMenu || !isSpeedSubmenuOpen()) return;

  // Prevent duplicate injection
  if (panelMenu.querySelector('[data-custom-speed]')) return;

  customSpeeds.forEach(speed => {
    const item = document.createElement('div');
    item.className = 'ytp-menuitem';
    item.setAttribute('data-custom-speed', speed);
    item.setAttribute('role', 'menuitemradio');
    item.setAttribute('tabindex', '0');

    item.innerHTML = `
      <div class="ytp-menuitem-label">${speed}</div>
      <div class="ytp-menuitem-content">${speed}x</div>
    `;

    item.onclick = () => {
      const video = document.querySelector('video');
      if (video) video.playbackRate = speed;

      const allItems = panelMenu.querySelectorAll('.ytp-menuitem');
      allItems.forEach(i => i.removeAttribute('aria-checked'));

      item.setAttribute('aria-checked', 'true');

      document.dispatchEvent(new MouseEvent('click'));
    };

    panelMenu.appendChild(item);
  });
}

const observer = new MutationObserver(() => {
  const panelMenu = document.querySelector('.ytp-panel-menu');
  if (panelMenu && isSpeedSubmenuOpen()) {
    injectCustomSpeedOptions();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
