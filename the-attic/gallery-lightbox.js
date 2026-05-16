(function () {
  var resizeTimer;

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

  function setupGalleries() {
    setupGalleryLightbox();
    setupJustifiedGalleries();
  }

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupJustifiedGalleries, 100);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGalleries);
  } else {
    setupGalleries();
  }
})();
