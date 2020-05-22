function updateSectionMap() {
  const winTop = document.documentElement.scrollTop;
  let $prev, $current, $next;
  document.querySelectorAll('.fullScreen').forEach(($el, index, arr) => {
    const top = $el.offsetTop;
    const bottom = $el.offsetTop + $el.offsetHeight;

    if (winTop >= top && winTop <= bottom) {
      $prev = arr[index - 1] || null;
      $current = $el;
      $next = arr[index + 1] || null;
    }
  });

  window.sectionMap = { $prev, $current, $next };
}

function makeScroll(newTop, speed = 15, dir, count) {
  if (count === undefined) {
    count = winTop;
    dir = winTop <= newTop ? 1 : -1;
  }
  // If current point is end position => stop recursion
  if (winTop >= newTop && dir === 1 || winTop <= newTop && dir === -1) {
    return false;
  };

  requestAnimationFrame(() => {
    window.scrollTo(0, count);
    count = winTop < newTop ? count + speed : count - speed;
    makeScroll(newTop, speed, dir, count);
  });
}

function addShadow($section, shade) {
  if(!$section) return false;

  $section.style.zIndex = '2';
  sectionMap.$current.style.filter = `blur(${Math.floor(shade / 100)}px)`;
  $section.style.boxShadow = `0 0 500px ${shade}px rgba(0, 0, 0)`;
}

function onScrollEnd(cb, timeout) {
  window.timerEnd;
  document.addEventListener('wheel', () => {
    if (window.timerEnd) {
      clearTimeout(window.timerEnd);
    }
    window.timerEnd = setTimeout(cb, timeout);
  })
}

onScrollEnd(() => {

}, 100);

window.winTop = document.documentElement.scrollTop;
document.addEventListener('scroll', () => {
  window.winTop = document.documentElement.scrollTop;
  window.scrollDir = window.scrollY <= window.prevScroll ? -1 : 1;
  window.prevScroll = window.scrollY;
  updateSectionMap();
  if (sectionMap.$current) {
    sectionMap.$current.style.zIndex = '2';
  }
  addShadow(
    sectionMap.$next,
    winTop - sectionMap.$current.offsetTop
  );
});