(() => {
  const shell = document.querySelector('.app-shell');
  const topActions = document.querySelector('.top-actions');
  const storageKey = 'abf-details-hidden-v1';
  document.querySelector('#settingsButton').insertAdjacentHTML('beforebegin', '<button class="details-toggle" id="detailsToggle">◧ Hide details</button>');
  const toggle = document.querySelector('#detailsToggle');
  function update(hidden){ shell.classList.toggle('details-hidden', hidden); toggle.textContent = hidden ? '◫ Show details' : '◧ Hide details'; localStorage.setItem(storageKey, String(hidden)); }
  update(localStorage.getItem(storageKey) === 'true');
  toggle.addEventListener('click', () => update(!shell.classList.contains('details-hidden')));
  document.querySelector('#closeDetails').onclick = () => update(true);
})();
