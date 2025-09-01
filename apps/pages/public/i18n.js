(function () {
  const dictMap = {
    fr: {
      title: '🎬 Partage d’écran instantané',
      sub: 'Démarrez une diffusion ou rejoignez une session en un clic — sans inscription. WebRTC chiffré end-to-end.',
      start: 'Démarrer une session',
      join: 'Rejoindre',
      placeholder: 'Ex. abc123',
      volume: 'Volume',
      footer_html: `Projet open-source. Vous aimez ? <a href="https://github.com/palpaga/ShareScreen" target="_blank" rel="noopener noreferrer">Disponible sur GitHub</a> et ouvert aux contributions. <a href="https://buymeacoffee.com/lamas" rel="nofollow">Soutenez le développement</a>.`,
      lang_label: 'Langue',
      tooltip_join: 'Rejoindre',
      tooltip_copy: 'Copier',
      tooltip_quit: 'Quitter',
      tooltip_logs: 'Logs',
      tooltip_fullscreen: 'Plein écran (f)',
      role_host: 'Hôte',
      role_viewer: 'Spectateur',
      status_init: 'Initialisation…',
      status_wait_share: 'En attente du partage d’écran…',
      status_started: 'Partage d’écran démarré',
      status_copy_fail: 'Impossible de copier',
      status_conn: 'Connexion…',
      status_negotiating: 'Négociation…',
      status_streaming: 'Diffusion en cours',
      status_host_left: 'L’hôte a quitté la session.',
      status_conn_failed: 'Connexion échouée',
      status_session_end: 'Session terminée.',
      status_session_quit: 'Session quittée.',
      invalidId: 'ID invalide (3–64 lettres/chiffres/_-)',
    },
    en: {
      title: '🎬 Instant P2P screen sharing',
      sub: 'Start or join in one click — no account. WebRTC end-to-end encrypted.',
      start: 'Start session',
      join: 'Join',
      placeholder: 'e.g. abc123',
      volume: 'Volume',
      footer_html: `Open-source project. Like it? <a href="https://github.com/palpaga/ShareScreen" target="_blank" rel="noopener noreferrer">See it on GitHub</a> and contribute. <a href="https://buymeacoffee.com/lamas" rel="nofollow">Support the development</a>.`,
      lang_label: 'Language',
      tooltip_join: 'Join',
      tooltip_copy: 'Copy',
      tooltip_quit: 'Quit',
      tooltip_logs: 'Logs',
      tooltip_fullscreen: 'Fullscreen (f)',
      role_host: 'Host',
      role_viewer: 'Viewer',
      status_init: 'Initializing…',
      status_wait_share: 'Waiting for screen share…',
      status_started: 'Screen sharing started',
      status_copy_fail: 'Unable to copy',
      status_conn: 'Connecting…',
      status_negotiating: 'Negotiating…',
      status_streaming: 'Streaming',
      status_host_left: 'The host left the session.',
      status_conn_failed: 'Connection failed',
      status_session_end: 'Session ended.',
      status_session_quit: 'Session left.',
      invalidId: 'Invalid ID (3–64 letters/digits/_-)',
    }
  };

  function getInitialLang() {
    const saved = localStorage.getItem('lang');
    if (saved && (saved === 'fr' || saved === 'en')) return saved;
    return (navigator.language || navigator.userLanguage || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }

  function applyI18n(dict) {
    const $ = s => document.querySelector(s);
    $('#t-title').textContent = dict.title;
    $('#t-sub').innerHTML = dict.sub;
    $('#t-start').textContent = dict.start;
    $('#t-join').textContent = dict.join;

    const joinInput = $('#joinId');
    if (joinInput) {
      joinInput.placeholder = dict.placeholder;
      joinInput.title = dict.invalidId;
    }

    const vLabel = $('#t-volume'); if (vLabel) vLabel.textContent = dict.volume;
    const footer = document.getElementById('t-footer'); if (footer) footer.innerHTML = dict.footer_html;
    const langLabel = document.getElementById('t-lang-label'); if (langLabel) langLabel.textContent = dict.lang_label;

    const btnJoin = document.getElementById('btnJoin'); if (btnJoin) btnJoin.title = dict.tooltip_join;
    const btnCopy = document.getElementById('btnCopy'); if (btnCopy) btnCopy.title = dict.tooltip_copy, btnCopy.textContent = dict.tooltip_copy;
    const btnQuit = document.getElementById('btnQuitTop'); if (btnQuit) btnQuit.title = dict.tooltip_quit;
    const btnLogs = document.getElementById('btnLogs'); if (btnLogs) btnLogs.title = dict.tooltip_logs;
    const btnFs = document.getElementById('btnFullscreen'); if (btnFs) btnFs.title = dict.tooltip_fullscreen;

    const statusText = document.getElementById('statusText'); if (statusText) statusText.textContent = dict.status_init;
  }

  const langSel = () => document.getElementById('langSel');

  window.i18n = {
    dictMap,
    get lang() { return localStorage.getItem('lang') || getInitialLang(); },
    set lang(v) { localStorage.setItem('lang', v); document.documentElement.lang = v; applyI18n(dictMap[v]); window.__i18n = dictMap[v]; },
    t(key) { return (window.__i18n && window.__i18n[key]) || key; }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const initial = getInitialLang();
    document.documentElement.lang = initial;
    window.__i18n = dictMap[initial];
    applyI18n(window.__i18n);
    const sel = langSel(); if (sel) { sel.value = initial; sel.addEventListener('change', () => window.i18n.lang = sel.value); }
  });
})();
