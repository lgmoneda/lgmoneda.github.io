(function () {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGalleryLightbox);
  } else {
    setupGalleryLightbox();
  }
})();
