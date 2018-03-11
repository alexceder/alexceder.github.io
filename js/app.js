(function() {
'use strict';

function mod(x, n) {
  return ((x % n) + n) % n;
}

function Slider(element) {
  this.element = element;
  this.images = this.element.getElementsByTagName('img');
  this.current = 0;
  this.visited = false;

  this.progress = document.createElement('div');
  this.progress.className = 'slider-progress';
  this.updateProgress();

  this.next = document.createElement('div');
  this.next.className = 'slider-control';
  this.next.setAttribute('data-next', '');
  this.next.addEventListener('click', this.navigate.bind(this));

  this.prev = document.createElement('div');
  this.prev.className = 'slider-control';
  this.prev.setAttribute('data-prev', '');
  this.prev.addEventListener('click', this.navigate.bind(this));

  this.element.appendChild(this.progress);
  this.element.appendChild(this.next);
  this.element.appendChild(this.prev);
}

Slider.prototype.navigate = function(event) {
  var is_next = event.target.hasAttribute('data-next');
  this.images[this.current].style.display = 'none';
  this.current = mod(this.current + (is_next ? 1 : -1), this.images.length);
  this.images[this.current].style.display = 'block';
  this.updateProgress();
  if (!this.visited) {
    this.element.className += ' slider-visited';
    this.visited = true;
  }
};

Slider.prototype.updateProgress = function() {
  var percent = (1 + this.current) % this.images.length / this.images.length || 1;
  this.progress.style.width = (percent * 100) + '%';
};

var sliders = document.getElementsByClassName('slider');
for (var i = 0; i < sliders.length; ++i) {
  new Slider(sliders[i]);
}
})();
