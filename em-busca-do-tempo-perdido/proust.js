document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('header');
  const headerRevealZone = document.querySelector('.header-reveal-zone');
  const menuToggle = document.getElementById('menuToggle');
  const dropdownMenu = document.getElementById('dropdownMenu');

  // Decoration system - enhanced for many elements
  function generatePilriteirosDecorations() {
    const decorations = [];
    const imageCount = 2; // We have 2 pilriteiro images
    
    // Top border (20 elements) - upside down, vegetation pointing inward
    for (let i = 0; i < 20; i++) {
      const hideAmount = Math.random() * 20 + 20; // 20-40px hidden
      decorations.push({
        class: `pilriteiro-top-${i}`,
        src: `../images/em-busca-do-tempo-perdido/decoration-pilriteiro-${(i % imageCount) + 1}.png`,
        position: {
          top: `-${hideAmount}px`, // Fixed pixel values instead of %
          left: `${(i / 19) * 100}vw`, // Use viewport width, spread across 20 elements
          rotation: 180 + (Math.random() * 30 - 15), // 165 to 195 degrees (upside down)
          size: Math.random() * 30 + 100 // 100-130px width
        }
      });
    }
    
    // Bottom border (20 elements) - normal orientation
    for (let i = 0; i < 20; i++) {
      const hideAmount = Math.random() * 20 + 20; // 20-40px hidden
      decorations.push({
        class: `pilriteiro-bottom-${i}`,
        src: `../images/em-busca-do-tempo-perdido/decoration-pilriteiro-${(i % imageCount) + 1}.png`,
        position: {
          bottom: `-${hideAmount}px`, // Fixed pixel values instead of %
          left: `${(i / 19) * 100}vw`, // Use viewport width, spread across 20 elements
          rotation: Math.random() * 30 - 15, // -15 to +15 degrees
          size: Math.random() * 30 + 100
        }
      });
    }
    
    // Left border (10 elements) - slight clockwise rotation
    for (let i = 0; i < 10; i++) {
      const hideAmount = Math.random() * 20 + 20; // 20-40px hidden
      decorations.push({
        class: `pilriteiro-left-${i}`,
        src: `../images/em-busca-do-tempo-perdido/decoration-pilriteiro-${(i % imageCount) + 1}.png`,
        position: {
          left: `-${hideAmount}px`, // Fixed pixel values instead of %
          top: `${(i / 9) * 100}vh`, // Use viewport height
          rotation: Math.random() * 20 + 5, // 5 to 25 degrees (clockwise)
          size: Math.random() * 30 + 100
        }
      });
    }
    
    // Right border (10 elements) - slight anti-clockwise rotation
    for (let i = 0; i < 10; i++) {
      const hideAmount = Math.random() * 20 + 20; // 20-40px hidden
      decorations.push({
        class: `pilriteiro-right-${i}`,
        src: `../images/em-busca-do-tempo-perdido/decoration-pilriteiro-${(i % imageCount) + 1}.png`,
        position: {
          right: `-${hideAmount}px`, // Fixed pixel values instead of %
          top: `${(i / 9) * 100}vh`, // Use viewport height
          rotation: Math.random() * 20 - 25, // -25 to -5 degrees (anti-clockwise)
          size: Math.random() * 30 + 100
        }
      });
    }
    
    return decorations;
  }

  const decorations = {
    "pilriteiros-decoration": generatePilriteirosDecorations(),
    "plants-decoration": [
      { class: "plant-top-left", src: "../images/em-busca-do-tempo-perdido/decoration-plant-1.png" },
      { class: "plant-top-right", src: "../images/em-busca-do-tempo-perdido/decoration-plant-2.png" },
      { class: "plant-bottom-left", src: "../images/em-busca-do-tempo-perdido/decoration-plant-1.png" },
      { class: "plant-bottom-right", src: "../images/em-busca-do-tempo-perdido/decoration-plant-2.png" },
      { class: "plant-left-middle", src: "../images/em-busca-do-tempo-perdido/decoration-plant-2.png" },
      { class: "plant-right-middle", src: "../images/em-busca-do-tempo-perdido/decoration-plant-1.png" }
    ]
  };

  // Initialize decorations function - enhanced for positioned elements
  function initializeDecorations() {
    console.log('initializeDecorations called');
    const sections = document.querySelectorAll(".content-section");
    console.log('Found sections:', sections.length);
    
    for (const section of sections) {
      console.log('Section classes:', section.className);
      for (const className in decorations) {
        if (section.classList.contains(className)) {
          console.log('Found matching decoration class:', className);
          const decorWrapper = document.createElement("div");
          decorWrapper.className = `section-decorations ${className}`;

          decorations[className].forEach(({ class: decoClass, src, position }, index) => {
            const div = document.createElement("div");
            div.className = `decoration-element ${decoClass}`;
            
            // Apply positioning if available
            if (position) {
              Object.keys(position).forEach(prop => {
                if (prop === 'rotation') {
                  div.style.setProperty('--rotation', `${position.rotation}deg`);
                } else if (prop === 'size') {
                  div.style.width = `${position.size}px`;
                  div.style.height = `${position.size * 1.2}px`; // Maintain aspect ratio
                } else {
                  div.style[prop] = position[prop];
                }
              });
            }
            
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Decoration";
            div.appendChild(img);
            decorWrapper.appendChild(div);
          
            // DON'T add visible class immediately - let CSS handle initial positioning
            // The handleDecorationAnimations function will add 'visible' when appropriate
          });

          section.insertBefore(decorWrapper, section.firstChild);
        }
      }
    }
  }

  // Make function available globally
  window.initializeDecorations = initializeDecorations;

  const stages = [
    {
      name: "morning",
      background: "#f3efe4",
      text: "#2e2a26",
      accent: "#d2b48c"
    },
    {
      name: "noon",
      background: "#fffbe9",
      text: "#1c1c1c",
      accent: "#e4be6b"
    },
    {
      name: "afternoon",
      background: "#ffe6d1",
      text: "#2b1e18",
      accent: "#c08b55"
    },
    {
      name: "night",
      background: "#1f1c1b",
      text: "#f0f0e5",
      accent: "#8a7f6e"
    }
  ];

  const totalStages = stages.length;
  const stageHeight = window.innerHeight * 1.5;
  const fullBleedSections = document.querySelectorAll('.full-bleed-section');
  
  let isScrolling = false;
  let scrollTimeout;
  let hasScrolled = false;
  let headerHideTimeout;
  let isMenuOpen = false;

  function applyStage(stageIndex) {
    const s = stages[stageIndex];
    root.style.setProperty("--bg", s.background);
    root.style.setProperty("--text", s.text);
    root.style.setProperty("--accent", s.accent);
    body.setAttribute("data-time", s.name);
  }

  function updateLighting() {
    const scrollTop = window.scrollY;
    const stageIndex = Math.min(
      totalStages - 1,
      Math.floor(scrollTop / stageHeight)
    );
    applyStage(stageIndex);
  }

  function handleHeaderVisibility() {
    const scrollTop = window.scrollY;
    
    // Only hide header after first scroll down AND if we're not at the very top
    if (scrollTop > 50 && !hasScrolled) {
      hasScrolled = true;
      header.classList.add('hidden');
      headerRevealZone.classList.add('active');
    }
    
    // Show header again if user scrolls back to top
    if (scrollTop <= 10 && hasScrolled) {
      hasScrolled = false;
      header.classList.remove('hidden');
      headerRevealZone.classList.remove('active');
    }
  }

  // Add these new functions for menu functionality
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    dropdownMenu.classList.toggle('active', isMenuOpen);
    menuToggle.textContent = isMenuOpen ? '✕' : '☰';
  }

  function closeMenu() {
    isMenuOpen = false;
    dropdownMenu.classList.remove('active');
    menuToggle.textContent = '☰';
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const imageContainer = section.querySelector('.image-container');
      if (imageContainer) {
        const rect = imageContainer.getBoundingClientRect();
        const targetScrollTop = window.scrollY + rect.top;
        
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
    closeMenu();
  }

  function showHeader() {
    console.log('Showing header');
    header.classList.remove('hidden');
    clearTimeout(headerHideTimeout);
  }

  function hideHeaderDelayed() {
    console.log('Hiding header delayed, hasScrolled:', hasScrolled);
    if (hasScrolled) {
      headerHideTimeout = setTimeout(() => {
        console.log('Actually hiding header now');
        header.classList.add('hidden');
        closeMenu(); // Close menu when header hides
      }, 2000); // Hide after 2 seconds of no mouse activity
    }
  }

  // Menu event listeners
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !header.contains(e.target)) {
      closeMenu();
    }
  });

  // Handle menu item clicks
  dropdownMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const sectionId = e.target.getAttribute('data-section');
      
      if (sectionId === 'intro') {
        // For intro, scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        scrollToSection(sectionId);
      }
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // Header reveal zone mouse events - enhanced with debugging
  headerRevealZone.addEventListener('mouseenter', (e) => {
    console.log('Header reveal zone mouseenter triggered');
    showHeader();
  });

  headerRevealZone.addEventListener('mouseleave', (e) => {
    console.log('Header reveal zone mouseleave triggered');
    hideHeaderDelayed();
  });

  // Also add a mousemove listener for better detection
  headerRevealZone.addEventListener('mousemove', (e) => {
    if (hasScrolled && header.classList.contains('hidden')) {
      showHeader();
    }
  });

  // Header mouse events (keep visible while hovering header itself)
  header.addEventListener('mouseenter', () => {
    console.log('Header mouseenter triggered');
    clearTimeout(headerHideTimeout);
  });

  header.addEventListener('mouseleave', (e) => {
    console.log('Header mouseleave triggered');
    hideHeaderDelayed();
  });

  function snapToNearestSection() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.3; // 30% of viewport height
    
    // Don't snap if we're at the very top of the page
    if (scrollTop <= 100) {
      return;
    }
    
    let closestSection = null;
    let closestDistance = Infinity;
    
    fullBleedSections.forEach(section => {
      const imageContainer = section.querySelector('.image-container');
      if (imageContainer) {
        const rect = imageContainer.getBoundingClientRect();
        const sectionTop = scrollTop + rect.top;
        const distance = Math.abs(scrollTop - sectionTop);
        
        if (distance < threshold && distance < closestDistance) {
          closestDistance = distance;
          closestSection = imageContainer;
        }
      }
    });
    
    if (closestSection) {
      const rect = closestSection.getBoundingClientRect();
      const targetScrollTop = scrollTop + rect.top;
      
      window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }

  function handleDecorationAnimations() {
    const decorationSections = document.querySelectorAll('.content-section');
    
    decorationSections.forEach(section => {
      const decorations = section.querySelectorAll('.decoration-element');
      if (decorations.length === 0) return;
      
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Check if section is in viewport
      const isInViewport = sectionTop < viewportHeight && (sectionTop + sectionHeight) > 0;
      
      if (isInViewport) {
        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, -sectionTop);
        const visibleBottom = Math.min(sectionHeight, viewportHeight - sectionTop);
        const visibleHeight = visibleBottom - visibleTop;
        const visibilityRatio = visibleHeight / viewportHeight;
        
        // Show decorations when section is at least 30% visible
        if (visibilityRatio > 0.3) {
          decorations.forEach((decoration, index) => {
            // Stagger the animation of each decoration
            setTimeout(() => {
              decoration.classList.add('visible');
            }, index * 150);
          });
        }
      } else {
        // Hide decorations when section is out of view
        decorations.forEach(decoration => {
          decoration.classList.remove('visible');
        });
      }
    });
  }

  function handleScroll() {
    updateLighting();
    handleHeaderVisibility();
    handleDecorationAnimations();
    
    // Clear existing timeout
    clearTimeout(scrollTimeout);
    
    // Set flag that we're scrolling
    isScrolling = true;
    
    // Set timeout to detect when scrolling stops
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      snapToNearestSection();
    }, 150); // Wait 150ms after scroll stops
  }

  window.addEventListener("scroll", handleScroll);
  updateLighting();
});
