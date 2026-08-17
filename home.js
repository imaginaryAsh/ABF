(() => {
  const main = document.querySelector('.main');
  const panel = document.createElement('section');
  panel.className = 'home-panel is-open';
  panel.innerHTML = `<div class="home-hero"><div class="eyebrow">WELCOME TO ABF</div><h1>What do you want to do?</h1><p>Keep your digital life together. Choose a space to get started.</p><label class="home-universal-search"><span>⌕</span><input id="homeUniversalSearch" placeholder="Search files, apps, or the web" /></label></div><div class="choose-label">CHOOSE A SPACE</div><div class="choice-grid"><button class="choice-card" data-go="files"><div class="choice-icon">⌑</div><h2>Files Management</h2><p>Organise documents, images, videos, and folders in one place.</p></button><button class="choice-card" data-go="apps"><div class="choice-icon">▦</div><h2>Apps</h2><p>Install and open the tools you use most from ABF.</p></button><button class="choice-card" data-go="browser"><div class="choice-icon">◎</div><h2>Browser</h2><p>Browse the web without leaving your workspace.</p></button></div><div class="home-search-results" id="homeSearchResults" hidden></div><div class="home-bottom"><span>✦</span> Your files, apps, and browsing—under one roof.</div>`;
  const shell = document.querySelector('.app-shell');
  const details = document.querySelector('#detailsContent');
  const topActions = document.querySelector('.top-actions');
  topActions.insertAdjacentHTML('afterbegin', '<button class="return-home" id="returnHome">← Home</button>');
  main.append(panel);
  main.classList.add('home-active');
  shell.classList.add('home-mode');
  let restoringHistory = false;
  history.replaceState({ abfView: 'home' }, '', location.pathname + location.search + '#home');
  function context(title, symbol, text, tip){ details.innerHTML = `<div class="space-side-note"><div class="side-symbol">${symbol}</div><h3>${title}</h3><p>${text}</p><div class="side-tip">${tip}</div></div>`; }
  function closeHome(target='files'){
    main.classList.remove('home-active');panel.classList.remove('is-open');shell.classList.remove('home-mode');
    shell.classList.toggle('workspace-mode', target !== 'files');
    if(target === 'files') shell.classList.remove('apps-active', 'browser-active');
    if(target === 'apps') context('Apps', '▦', 'Install your favourite tools and open them from one simple space.', 'Choose “Install apps” to build your personal app shelf.');
    if(target === 'browser') context('Browser', '◎', 'Search the web and open websites without leaving ABF.', 'Some websites may open best in a new tab.');
  }
  panel.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.go;
    if(target === 'files') document.querySelector('[data-library="all"]').click();
    else document.querySelector(`[data-workspace="${target}"]`).click();
    closeHome(target);
  }));
  document.querySelectorAll('[data-library]').forEach(button => button.addEventListener('click', () => closeHome('files')));
  document.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => closeHome(button.dataset.workspace)));
  function goHome(){ document.querySelector('.workspace-panel')?.classList.remove('is-open'); main.classList.remove('workspace-active'); main.classList.add('home-active'); panel.classList.add('is-open'); shell.classList.remove('workspace-mode', 'apps-active', 'browser-active'); shell.classList.add('home-mode'); }
  document.querySelector('#homeBrand').addEventListener('click', event => { event.preventDefault(); goHome(); });
  document.querySelector('#returnHome').addEventListener('click', goHome);
  const appNames = {docs:'Docs',notion:'Notion',canva:'Canva',youtube:'YouTube',drive:'Drive',calendar:'Calendar',figma:'Figma',github:'GitHub',slack:'Slack',spotify:'Spotify',zoom:'Zoom',gmail:'Gmail',maps:'Maps'};
  const escapeHtml = text => String(text).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function universalSearch(query) {
    const results = document.querySelector('#homeSearchResults'); const q = query.trim().toLowerCase();
    if(!q){results.hidden=true;results.innerHTML='';return;}
    let vault; try { vault = JSON.parse(localStorage.getItem('file-vault-data-v1') || '{"files":[],"folders":[]}'); } catch { vault = {files:[],folders:[]}; }
    const files = (vault.files || []).filter(file => file.name.toLowerCase().includes(q)).slice(0,5);
    const folders = (vault.folders || []).filter(folder => folder.name.toLowerCase().includes(q)).slice(0,5);
    let installed; try { installed = JSON.parse(localStorage.getItem('file-vault-installed-apps-v1') || '[]'); } catch { installed = []; } installed = installed.filter(app => (appNames[app] || app).toLowerCase().includes(q));
    let html = '';
    if(folders.length) html += `<section class="search-result-section"><h2>FOLDERS</h2>${folders.map(folder => `<button class="search-result" data-home-folder="${folder.id}"><span class="result-icon">⌑</span><span class="result-info"><strong>${escapeHtml(folder.name)}</strong><span>Folder · Open in Files Management</span></span></button>`).join('')}</section>`;
    if(files.length) html += `<section class="search-result-section"><h2>FILES</h2>${files.map(file => `<button class="search-result" data-home-file="${escapeHtml(file.name)}"><span class="result-icon">⌑</span><span class="result-info"><strong>${escapeHtml(file.name)}</strong><span>${escapeHtml(file.type || 'File')} · Open in Files Management</span></span></button>`).join('')}</section>`;
    if(installed.length) html += `<section class="search-result-section"><h2>APPS</h2>${installed.map(app => `<button class="search-result" data-home-app="${app}"><span class="result-icon">▦</span><span class="result-info"><strong>${escapeHtml(appNames[app] || app)}</strong><span>Installed app · Open in Apps</span></span></button>`).join('')}</section>`;
    html += `<section class="search-result-section"><h2>WEB</h2><button class="search-result" data-home-web="${escapeHtml(query)}"><span class="result-icon">◎</span><span class="result-info"><strong>Search the web for “${escapeHtml(query)}”</strong><span>Open in ABF Browser</span></span></button></section>`;
    results.innerHTML=html;results.hidden=false;
    results.querySelectorAll('[data-home-folder]').forEach(button=>button.onclick=()=>{document.querySelector('[data-library="all"]').click();state.folder=button.dataset.homeFolder;state.query='';render();});
    results.querySelectorAll('[data-home-file]').forEach(button=>button.onclick=()=>{document.querySelector('#searchInput').value=button.dataset.homeFile;document.querySelector('[data-library="all"]').click();});
    results.querySelectorAll('[data-home-app]').forEach(button=>button.onclick=()=>document.querySelector('[data-workspace="apps"]').click());
    results.querySelectorAll('[data-home-web]').forEach(button=>button.onclick=()=>{document.querySelector('[data-workspace="browser"]').click();document.querySelector('#browserAddress').value=button.dataset.homeWeb;document.querySelector('#goToPage').click();});
  }
  const topSearch = document.querySelector('#searchInput'); const homeSearch = document.querySelector('#homeUniversalSearch');
  function searchFrom(source, other){ other.value=source.value; universalSearch(source.value); }
  topSearch.addEventListener('input', () => searchFrom(topSearch, homeSearch));
  topSearch.addEventListener('keyup', () => searchFrom(topSearch, homeSearch));
  homeSearch.addEventListener('input', () => searchFrom(homeSearch, topSearch));
  homeSearch.addEventListener('keyup', () => searchFrom(homeSearch, topSearch));
  const profileButton = document.querySelector('.avatar');
  topActions.insertAdjacentHTML('beforeend', '<div class="profile-menu" id="profileMenu" hidden><div class="profile-summary"><strong id="profileName"></strong><span id="profileEmail"></span></div><button id="openProfile">Profile & settings</button></div>');
  function renderProfile(){const profile=JSON.parse(localStorage.getItem('abf-settings-v1') || '{}');document.querySelector('#profileName').textContent=profile.name || 'ABF user';document.querySelector('#profileEmail').textContent=profile.email || 'Add your email in Settings';}
  profileButton.addEventListener('click', event=>{event.stopPropagation();renderProfile();const menu=document.querySelector('#profileMenu');menu.hidden=!menu.hidden;});
  document.addEventListener('click', event=>{if(!event.target.closest('.profile-menu'))document.querySelector('#profileMenu').hidden=true;});
  document.querySelector('#openProfile').onclick=()=>{document.querySelector('#profileMenu').hidden=true;document.querySelector('#settingsButton').click();};
  function record(view) { if (!restoringHistory) history.pushState({ abfView: view }, '', '#' + view); }
  document.querySelectorAll('[data-library]').forEach(button => button.addEventListener('click', () => record('files')));
  document.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => record(button.dataset.workspace)));
  document.querySelector('#returnHome').addEventListener('click', () => record('home'));
  document.querySelector('#homeBrand').addEventListener('click', () => record('home'));
  window.addEventListener('popstate', event => {
    restoringHistory = true;
    const view = event.state?.abfView || 'home';
    if (view === 'home') goHome();
    else if (view === 'files') document.querySelector('[data-library="all"]').click();
    else document.querySelector(`[data-workspace="${view}"]`)?.click();
    restoringHistory = false;
  });
})();
