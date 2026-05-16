(function () {
  var resizeTimer;
  var mosaicStyleId = 'attic-gallery-mosaic-styles';

  function injectMosaicStyles() {
    if (document.getElementById(mosaicStyleId)) {
      return;
    }

    var style = document.createElement('style');
    style.id = mosaicStyleId;
    style.textContent = [
      '.gallery--mosaic {',
      '  display: grid !important;',
      '  grid-template-columns: repeat(6, minmax(0, 1fr));',
      '  grid-auto-rows: clamp(105px, 14vw, 145px);',
      '  grid-auto-flow: dense;',
      '  gap: 10px;',
      '  margin: 1.6em auto 2.8em;',
      '  max-width: 100%;',
      '}',
      '.gallery--mosaic .figure,',
      '.gallery--mosaic figure {',
      '  position: relative;',
      '  background: #fffaf1;',
      '  border: 3px solid rgba(255, 250, 240, 0.92);',
      '  border-radius: 14px;',
      '  box-shadow: 0 12px 28px rgba(70, 50, 30, 0.16), 0 2px 8px rgba(70, 50, 30, 0.10);',
      '  transform: rotate(var(--gallery-rotate, 0deg)) translateY(0);',
      '  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;',
      '  will-change: transform;',
      '}',
      '.gallery--mosaic .figure::after,',
      '.gallery--mosaic figure::after {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 0;',
      '  border-radius: 11px;',
      '  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);',
      '  pointer-events: none;',
      '}',
      '.gallery--mosaic .figure:hover,',
      '.gallery--mosaic figure:hover {',
      '  box-shadow: 0 18px 40px rgba(70, 50, 30, 0.22), 0 6px 14px rgba(70, 50, 30, 0.14);',
      '  filter: saturate(1.08) brightness(1.03);',
      '  transform: rotate(var(--gallery-rotate, 0deg)) translateY(-5px) scale(1.015);',
      '  z-index: 2;',
      '}',
      '.gallery--mosaic .figure p,',
      '.gallery--mosaic figure p,',
      '.gallery--mosaic a[data-lightbox] {',
      '  height: 100%;',
      '  margin: 0;',
      '}',
      '.gallery--mosaic a[data-lightbox] {',
      '  display: block;',
      '  border-bottom: 0 !important;',
      '}',
      '.gallery--mosaic img {',
      '  display: block;',
      '  width: 100%;',
      '  height: 100%;',
      '  max-width: none;',
      '  object-fit: cover;',
      '  border-radius: 10px;',
      '  padding: 0;',
      '}',
      '.gallery--mosaic br {',
      '  display: none;',
      '}',
      '@media (max-width: 760px) {',
      '  .gallery--mosaic {',
      '    grid-template-columns: repeat(2, minmax(0, 1fr));',
      '    grid-auto-rows: 130px;',
      '    gap: 8px;',
      '  }',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  function setupGalleryLightbox() {
    var images = document.querySelectorAll('img[data-lightbox]');

    images.forEach(function (image) {
      if (image.closest('a[data-lightbox]')) {
        return;
      }

      var link = document.createElement('a');
      link.href = image.currentSrc || image.src;
      link.setAttribute('data-lightbox', image.getAttribute('data-lightbox'));

      if (image.alt) {
        link.setAttribute('data-title', image.alt);
      }

      image.removeAttribute('data-lightbox');
      image.parentNode.insertBefore(link, image);
      link.appendChild(image);
    });
  }

  function imageIsReady(image) {
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  }

  function whenImagesReady(images, callback) {
    var pending = images.filter(function (image) {
      return !imageIsReady(image);
    }).length;

    if (pending === 0) {
      callback();
      return;
    }

    images.forEach(function (image) {
      if (imageIsReady(image)) {
        return;
      }

      var done = function () {
        pending -= 1;

        if (pending === 0) {
          callback();
        }
      };

      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    });
  }

  function getGalleryItem(image) {
    return image.closest('.figure') || image.closest('figure') || image.parentElement;
  }

  function prepareGalleryItem(item) {
    var paragraph = item.querySelector('p');
    var link = item.querySelector('a[data-lightbox]');
    var image = item.querySelector('img');

    item.style.margin = '0';
    item.style.padding = '0';
    item.style.overflow = 'hidden';

    if (paragraph) {
      paragraph.style.margin = '0';
      paragraph.style.height = '100%';
    }

    if (link) {
      link.style.display = 'block';
      link.style.width = '100%';
      link.style.height = '100%';
      link.style.borderBottom = '0';
    }

    if (image) {
      image.style.display = 'block';
      image.style.width = '100%';
      image.style.height = '100%';
      image.style.objectFit = 'cover';
      image.style.maxWidth = 'none';
    }

    item.querySelectorAll('br').forEach(function (lineBreak) {
      lineBreak.style.display = 'none';
    });
  }

  function resetGalleryItem(item) {
    item.style.flex = '';
    item.style.width = '';
    item.style.height = '';
    item.style.gridColumn = '';
    item.style.gridRow = '';
  }

  function layoutJustifiedGallery(gallery) {
    var gap = Number(gallery.getAttribute('data-gallery-gap')) || 4;
    var targetHeight = Number(gallery.getAttribute('data-gallery-row-height')) || 170;
    var minHeight = Number(gallery.getAttribute('data-gallery-min-height')) || 120;
    var maxHeight = Number(gallery.getAttribute('data-gallery-max-height')) || 260;
    var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    var items = images.map(getGalleryItem).filter(Boolean);
    var containerWidth;
    var row = [];
    var ratioSum = 0;

    if (images.length === 0) {
      return;
    }

    gallery.style.display = 'flex';
    gallery.style.flexWrap = 'wrap';
    gallery.style.alignItems = 'flex-start';
    gallery.style.gap = gap + 'px';
    gallery.style.gridTemplateColumns = 'none';

    containerWidth = gallery.clientWidth;

    if (!containerWidth) {
      return;
    }

    function placeRow(rowItems, rowRatioSum, isLastRow) {
      var rowGap = gap * Math.max(rowItems.length - 1, 0);
      var rowHeight = (containerWidth - rowGap) / rowRatioSum;

      if (isLastRow) {
        rowHeight = Math.min(targetHeight, rowHeight);
      }

      rowHeight = Math.max(minHeight, Math.min(maxHeight, rowHeight));

      rowItems.forEach(function (entry) {
        var width = Math.max(80, Math.round(entry.ratio * rowHeight));

        prepareGalleryItem(entry.item);
        entry.item.style.flex = '0 0 ' + width + 'px';
        entry.item.style.width = width + 'px';
        entry.item.style.height = Math.round(rowHeight) + 'px';
      });
    }

    items.forEach(function (item, index) {
      var image = images[index];
      var ratio = imageIsReady(image) ? image.naturalWidth / image.naturalHeight : 1;

      row.push({ item: item, ratio: ratio });
      ratioSum += ratio;

      if ((ratioSum * targetHeight) + (gap * Math.max(row.length - 1, 0)) >= containerWidth) {
        placeRow(row, ratioSum, false);
        row = [];
        ratioSum = 0;
      }
    });

    if (row.length > 0) {
      placeRow(row, ratioSum, true);
    }
  }

  function setupJustifiedGalleries() {
    var galleries = Array.prototype.slice.call(document.querySelectorAll('.gallery--justified'));

    galleries.forEach(function (gallery) {
      var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));

      whenImagesReady(images, function () {
        layoutJustifiedGallery(gallery);
      });
    });
  }

  function layoutMosaicGallery(gallery) {
    var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    var items = images.map(getGalleryItem).filter(Boolean);
    var desktopPattern = [
      { columns: 3, rows: 2, rotate: '-0.7deg' },
      { columns: 2, rows: 1, rotate: '0.5deg' },
      { columns: 1, rows: 1, rotate: '-0.3deg' },
      { columns: 2, rows: 1, rotate: '0.4deg' },
      { columns: 2, rows: 1, rotate: '-0.5deg' },
      { columns: 2, rows: 1, rotate: '0.2deg' },
      { columns: 2, rows: 2, rotate: '0.6deg' },
      { columns: 4, rows: 1, rotate: '-0.4deg' }
    ];
    var mobilePattern = [
      { columns: 2, rows: 2, rotate: '-0.5deg' },
      { columns: 1, rows: 1, rotate: '0.4deg' },
      { columns: 1, rows: 1, rotate: '-0.3deg' },
      { columns: 2, rows: 1, rotate: '0.3deg' }
    ];
    var pattern = gallery.clientWidth < 640 ? mobilePattern : desktopPattern;

    injectMosaicStyles();

    items.forEach(function (item, index) {
      var tile = pattern[index % pattern.length];

      resetGalleryItem(item);
      prepareGalleryItem(item);
      item.style.gridColumn = 'span ' + tile.columns;
      item.style.gridRow = 'span ' + tile.rows;
      item.style.setProperty('--gallery-rotate', tile.rotate);
    });
  }

  function setupMosaicGalleries() {
    var galleries = Array.prototype.slice.call(document.querySelectorAll('.gallery--mosaic'));

    galleries.forEach(function (gallery) {
      var images = Array.prototype.slice.call(gallery.querySelectorAll('img'));

      whenImagesReady(images, function () {
        layoutMosaicGallery(gallery);
      });
    });
  }

  function setupGalleries() {
    setupGalleryLightbox();
    setupJustifiedGalleries();
    setupMosaicGalleries();
  }

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setupJustifiedGalleries();
      setupMosaicGalleries();
    }, 100);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGalleries);
  } else {
    setupGalleries();
  }
})();
