(() => {
  const catalog = [
    { id:'docs', name:'Docs', letter:'D', tone:'#dceafa', note:'Write and edit documents', url:'https://docs.google.com/' },
    { id:'notion', name:'Notion', letter:'N', tone:'#ededeb', note:'Notes and knowledge base', url:'https://www.notion.so/' },
    { id:'canva', name:'Canva', letter:'C', tone:'#dff4ef', note:'Designs and presentations', url:'https://www.canva.com/' },
    { id:'youtube', name:'YouTube', letter:'▶', tone:'#f8e5e5', note:'Watch and save videos', url:'https://www.youtube.com/' },
    { id:'drive', name:'Drive', letter:'△', tone:'#e1efe4', note:'Cloud file storage', url:'https://drive.google.com/' },
    { id:'calendar', name:'Calendar', letter:'□', tone:'#f8efd8', note:'Plans and schedules', url:'https://calendar.google.com/' },
    { id:'figma', name:'Figma', letter:'F', tone:'#f4e4ef', note:'Design together', url:'https://www.figma.com/' },
    { id:'github', name:'GitHub', letter:'◆', tone:'#e8e8e8', note:'Code and projects', url:'https://github.com/' },
    { id:'slack', name:'Slack', letter:'S', tone:'#f2e2ef', note:'Team conversations', url:'https://slack.com/' },
    { id:'spotify', name:'Spotify', letter:'◒', tone:'#e0f0df', note:'Music and podcasts', url:'https://open.spotify.com/' },
    { id:'zoom', name:'Zoom', letter:'Z', tone:'#dceafa', note:'Meet and collaborate', url:'https://zoom.us/' },
    { id:'gmail', name:'Gmail', letter:'M', tone:'#f8e4e1', note:'Email in one place', url:'https://mail.google.com/' },
    { id:'maps', name:'Maps', letter:'⌖', tone:'#e2f0e8', note:'Explore places', url:'https://maps.google.com/' }
  ];
  const appKey = 'file-vault-installed-apps-v1';
  let installed = JSON.parse(localStorage.getItem(appKey) || '[]');
  let mode = 'files';
  const main = document.querySelector('.main');
  const nav = document.querySelector('.nav');
  const actions = document.querySelector('.top-actions');
  const panel = document.createElement('section');
  panel.className = 'workspace-panel';
  panel.innerHTML = `<div class="workspace-hero"><div><h1 id="workspaceTitle">Your apps</h1><p id="workspaceCopy">Tools you have added to your Vault.</p></div></div><div id="workspaceBody"></div>`;
  main.append(panel);
  nav.insertAdjacentHTML('afterend', `<div class="workspace-nav-divider"></div><nav class="nav workspace-nav" aria-label="Workspace"><button class="nav-item" data-workspace="apps"><span class="nav-icon">▦</span> My apps <b id="appCount">0</b></button><button class="nav-item" data-workspace="browser"><span class="nav-icon">◎</span> Browser</button></nav>`);
  document.querySelector('.sidebar').insertAdjacentHTML('beforeend', `<section class="app-side-panel"><div class="side-panel-label">APPS</div><button class="side-main-link" id="sideMyApps">▦ <span>My apps</span></button><button class="side-main-link" id="sideInstallApps">＋ <span>Install apps</span></button><div class="side-panel-label installed-label-side">INSTALLED</div><div id="sideInstalledApps" class="side-list"></div></section><section class="browser-side-panel"><div class="side-panel-label">BROWSER</div><button class="side-main-link" id="sideBrowserHome">◎ <span>Start page</span></button><div class="side-panel-label installed-label-side">QUICK DESTINATIONS</div><div class="side-list"><button data-quick-url="https://www.google.com/">G <span>Google</span></button><button data-quick-url="https://www.youtube.com/">▶ <span>YouTube</span></button><button data-quick-url="https://www.wikipedia.org/">W <span>Wikipedia</span></button><button data-quick-url="https://news.google.com/">◉ <span>News</span></button></div></section>`);
  const addAppsButton = `<button id="showCatalog">+ Install apps</button>`;
  function persist(){ localStorage.setItem(appKey, JSON.stringify(installed)); }
  function renderAppSide(){ const target=document.querySelector('#sideInstalledApps'); const apps=catalog.filter(app=>installed.includes(app.id)); target.innerHTML=apps.length?apps.map(app=>`<button data-side-launch="${app.id}"><i style="background:${app.tone}">${app.letter}</i><span>${app.name}</span></button>`).join(''):'<p>No apps installed yet.</p>'; target.querySelectorAll('[data-side-launch]').forEach(button=>button.onclick=()=>{const app=catalog.find(x=>x.id===button.dataset.sideLaunch);browserView(app.url,app.name);show('browser');}); }
  function appCard(app, isInstalled){ return `<article class="app-card"><div class="app-icon" style="background:${app.tone}">${app.letter}</div>${isInstalled?'<button class="uninstall" data-uninstall="'+app.id+'" aria-label="Remove '+app.name+'">×</button>':''}<h3>${app.name}</h3><p>${app.note}</p>${isInstalled?`<button data-launch="${app.id}">Open app</button>`:`<button class="install" data-install="${app.id}">Install</button>`}</article>`; }
  function appsView(showCatalog=false){
    const selected = catalog.filter(a=>installed.includes(a.id));
    document.querySelector('#workspaceTitle').textContent = showCatalog ? 'Install apps' : 'Your apps';
    document.querySelector('#workspaceCopy').textContent = showCatalog ? 'Add the tools you want to use from your Vault.' : 'Tools you have added to your Vault.';
    document.querySelector('#workspaceBody').innerHTML = showCatalog ? `<div class="workspace-section-title"><h2>App catalog</h2><span>Install an app to add it to your space</span></div><div class="app-catalog">${catalog.map(a=>appCard(a,installed.includes(a.id))).join('')}</div>` : `<div class="workspace-section-title"><h2>Installed apps</h2>${addAppsButton}</div>${selected.length?`<div class="installed-apps">${selected.map(a=>appCard(a,true)).join('')}</div>`:`<div class="browser-welcome" style="height:270px;background:white;border:1px solid var(--line);border-radius:12px"><div class="compass">✦</div><h2>Your workspace is ready</h2><p>Install apps to open them from here, alongside your files.</p></div>`}`;
    document.querySelector('#showCatalog')?.addEventListener('click',()=>appsView(true));
    bindAppButtons();
  }
  function bindAppButtons(){
    document.querySelectorAll('[data-install]').forEach(btn=>btn.onclick=()=>{installed.push(btn.dataset.install);persist();appsView(true); updateCount();renderAppSide();});
    document.querySelectorAll('[data-uninstall]').forEach(btn=>btn.onclick=()=>{installed=installed.filter(x=>x!==btn.dataset.uninstall);persist();appsView();updateCount();renderAppSide();});
    document.querySelectorAll('[data-launch]').forEach(btn=>{const app=catalog.find(a=>a.id===btn.dataset.launch);btn.onclick=()=>browserView(app.url,app.name)});
  }
  function browserView(url='',name=''){
    document.querySelector('#workspaceTitle').textContent = name || 'Browse the web';
    document.querySelector('#workspaceCopy').textContent = name ? `Opening ${name} within your Vault.` : 'Search or enter a website address.';
    document.querySelector('#workspaceBody').innerHTML = `<div class="browser-shell"><div class="browser-toolbar"><span class="browser-dots">•••</span><input id="browserAddress" aria-label="Website address" placeholder="Search the web or enter a website address" value="${url}" /><button id="goToPage">Go</button></div><div class="browser-content" id="browserContent"><div class="browser-welcome"><div class="compass">◎</div><h2>A calm place to browse</h2><p>Type a website address above. Your files and app shortcuts remain close by.</p></div></div><div class="browser-footer"><span>Some websites may block embedded browsing.</span><a id="externalLink" href="#" target="_blank" hidden>Open in a new tab ↗</a></div></div>`;
    const address=document.querySelector('#browserAddress'); const visit=()=>{let value=address.value.trim();if(!value)return;if(!/^https?:\/\//i.test(value)) value=value.includes('.')?'https://'+value:'https://www.google.com/search?q='+encodeURIComponent(value);address.value=value;const frame=document.createElement('iframe');frame.src=value;frame.title='Web browser';const content=document.querySelector('#browserContent');content.replaceChildren(frame);let external=document.querySelector('#externalLink');external.href=value;external.hidden=false;};
    document.querySelector('#goToPage').onclick=visit;address.addEventListener('keydown',e=>{if(e.key==='Enter')visit()});if(url)visit();
  }
  function show(which){mode=which;main.classList.toggle('workspace-active',which!=='files');panel.classList.toggle('is-open',which!=='files');document.querySelector('.app-shell').classList.toggle('apps-active',which==='apps');document.querySelector('.app-shell').classList.toggle('browser-active',which==='browser');document.querySelectorAll('[data-workspace]').forEach(b=>b.classList.toggle('active',b.dataset.workspace===which));if(which==='apps')appsView();if(which==='browser')browserView();}
  function updateCount(){document.querySelector('#appCount').textContent=installed.length;}
  document.querySelectorAll('[data-workspace]').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.workspace)));
  document.querySelectorAll('[data-library]').forEach(btn=>btn.addEventListener('click',()=>show('files')));
  document.querySelector('#sideMyApps').onclick=()=>{show('apps');appsView();};
  document.querySelector('#sideInstallApps').onclick=()=>{show('apps');appsView(true);};
  document.querySelector('#sideBrowserHome').onclick=()=>{show('browser');browserView();};
  document.querySelectorAll('[data-quick-url]').forEach(button=>button.onclick=()=>{show('browser');browserView(button.dataset.quickUrl);});
  renderAppSide();
  updateCount();
})();
