(() => {
  const root = document.documentElement;
  const menu = document.getElementById('chapter-menu');
  const main = document.getElementById('main-content');
  const palettes = [
    ['#f5f1e8', '#302d27', '#686253', '#74603c', '#d4cbbb'],
    ['#faf4e5', '#302c24', '#68604e', '#765b2c', '#d9ccb0'],
    ['#f2e5d5', '#352b24', '#6b5847', '#795634', '#d0baa4'],
    ['#272923', '#eee9dc', '#c5beac', '#d4bd8c', '#555747']
  ];
  const names = ['morning', 'noon', 'afternoon', 'night'];
  const properties = ['--bg', '--text', '--muted', '--accent', '--line'];

  menu.addEventListener('click', event => {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });

  function initializeReading() {
    const sections = [...main.querySelectorAll('section[id]')];
    const links = [...menu.querySelectorAll('a')];
    const themes = { intro: 0, lanterna: 0, combray: 1, section1: 1, section2: 2, section3: 3, bibliografia: 3 };
    let pending = false;
    let previousStage = -1;
    function update() {
      pending = false;
      const readingLine = window.innerHeight * .4;
      let active = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) active = section;
      }
      if (!active) return;
      const stage = themes[active.id] ?? 0;
      if (stage !== previousStage) {
        properties.forEach((property, index) => root.style.setProperty(property, palettes[stage][index]));
        document.body.dataset.time = names[stage];
        root.style.colorScheme = stage === 3 ? 'dark' : 'light';
        previousStage = stage;
      }
      links.forEach(link => {
        if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function schedule() {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    main.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule, { once: true }));
    update();
  }

  async function start() {
    if (main.dataset.contentSrc) {
      try {
        const response = await fetch(main.dataset.contentSrc);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        main.innerHTML = await response.text();
        if (window.location.hash) {
          const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
          target?.scrollIntoView({ behavior: 'instant' });
        }
      } catch {
        main.innerHTML = '<p class="loading-message" role="alert">Não foi possível carregar esta prévia. <a href="index.html">Abrir o caderno completo</a>.</p>';
      } finally {
        main.removeAttribute('aria-busy');
      }
    }
    initializeReading();
  }
  start();
})();
