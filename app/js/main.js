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

function makeScroll($section, step = 20, dir, count) {
  if(!$section) {
    window.wheelBlocked = false;
    return false;
  }

  const newTop = $section.offsetTop;

  if (count === undefined) {
    count = winTop;
    dir = winTop <= newTop ? 1 : -1;
  }
  // If current point is end position => stop recursion
  if (winTop + step >= newTop && dir === 1 || winTop - step <= newTop && dir === -1) {
    window.scrollTo(0, newTop);
    window.wheelBlocked = false;
    return false;
  };

  requestAnimationFrame(() => {
    window.scrollTo(0, count);
    count = winTop < newTop ? count + step : count - step;
    makeScroll($section, step, dir, count);
  });
}

function addShadow($section, shade) {
  if(!$section) return false;

  $section.style.zIndex = '2';
  sectionMap.$current.style.filter = `blur(${Math.floor(shade / 100)}px)`;
  $section.style.boxShadow = `0 0 ${shade * 0.75}px ${shade / 2}px rgba(255, 255, 255)`;
}

function onWheel(ev) {
  window.winTop = document.documentElement.scrollTop;

  if (window.wheelBlocked) return false;
  window.scrollDir = ev.deltaY;
  window.wheelBlocked = true;

  updateSectionMap();
  makeScroll(window.scrollDir > 0 ? sectionMap.$next : sectionMap.$prev);
}

document.addEventListener('wheel', onWheel);
document.addEventListener('scroll', () => {
  window.winTop = document.documentElement.scrollTop;
  updateSectionMap();
  if (sectionMap.$current) {
    sectionMap.$current.style.zIndex = '2';
  }
  addShadow(
    sectionMap.$next,
    winTop - sectionMap.$current.offsetTop
  );
});