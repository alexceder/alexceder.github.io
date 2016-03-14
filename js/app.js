(function() {
'use strict';

var sliders = document.getElementsByClassName('slider');
Object.keys(sliders).forEach(function(index) {
  new Slider(sliders[index]);
});

function Slider(element) {
  var images = element.getElementsByTagName('img');
  var current = 0;
  var visited = false;
  var progress;
  var next;
  var prev;

  progress = document.createElement('div');
  progress.className = 'slider-progress';
  updateProgress();

  next = document.createElement('div');
  next.className = 'slider-control';
  next.setAttribute('data-next', '');
  next.addEventListener('click', navigate);

  prev = document.createElement('div');
  prev.className = 'slider-control';
  prev.setAttribute('data-prev', '');
  prev.addEventListener('click', navigate);

  element.appendChild(next);
  element.appendChild(prev);
  element.appendChild(progress);

  function navigate(event) {
    var is_next = event.srcElement.hasAttribute('data-next');

    images[current].style.display = 'none';
    current = mod(current + (is_next ? 1 : -1), images.length);
    images[current].style.display = 'block';
    updateProgress();

    if (!visited) {
      element.className += ' slider-visited';
      visited = true;
    }
  }

  function updateProgress() {
    var percent = (1 + current) % images.length / images.length || 1;

    progress.style.width = (percent*100) + '%';
  }
}

function mod(x, n) {
  return ((x % n) + n) % n;
}
})();
