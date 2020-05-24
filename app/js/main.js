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

function attachHeader() {
  const screenMap = document.querySelectorAll('.fullScreen');
  const attachAction = window.prevSection.classList.contains('forest');
  const detachAction = window.prevSection === screenMap[1] && sectionMap.$current === screenMap[0];

  const $header = document.querySelector('header');
  
  if(attachAction) {
    $header.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      $header.classList.add('attached');
    }, 0);
  } else if(detachAction) {
    $header.style.transform = 'translateY(0)';
    $header.classList.remove('attached');
  }
  window.prevSection = sectionMap.$current;
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
    updateSectionMap();
    attachHeader();
    return false;
  };

  requestAnimationFrame(() => {
    window.scrollTo(0, count);
    count = winTop < newTop ? count + step : count - step;
    makeScroll($section, step, dir, count);
  });
}

function addShadow($section, transY) {
  if(!$section || !sectionMap.$next) return false;

  transY = window.innerHeight - transY * 2;
  transY = transY < 0 ? 0 : transY;
  const $overlay = $section.querySelector('.fullScreen__overlay');
  $overlay.style.transform = `translateY(${transY}px)`;
}

function onWheel(ev) {
  updateSectionMap();
  window.scrollDir = ev.deltaY;
  window.winTop = document.documentElement.scrollTop;
  const winBottom = winTop + window.innerHeight;
  const top = sectionMap.$current.offsetTop;
  const bottom = sectionMap.$current.offsetTop + sectionMap.$current.offsetHeight;
  const stepScroll = scrollDir < 0 ? -100 : 100;
  const inSection = winTop + stepScroll >= top && winBottom + stepScroll <= bottom;

  if (window.wheelBlocked || inSection) return false;
  window.wheelBlocked = true;
  makeScroll(window.scrollDir > 0 ? sectionMap.$next : sectionMap.$prev);
}

function onScroll() {
  window.winTop = document.documentElement.scrollTop;
  const top = sectionMap.$current.offsetTop;
  const bottom = top + sectionMap.$current.offsetHeight;
  if (winTop < top || winTop > bottom) {
    updateSectionMap();
  }

  addShadow(
    sectionMap.$current,
    winTop - sectionMap.$current.offsetTop
  );
}

function scrollNext(ev) {
  ev.preventDefault();
  updateSectionMap();
  makeScroll(sectionMap.$next);
}


document.addEventListener('DOMContentLoaded', () => {
  window.winTop = document.documentElement.scrollTop;
  updateSectionMap();
  window.prevSection = sectionMap.$current;

  document.querySelectorAll('.fullScreen__overlay').forEach($overlay => {
    $overlay.style.transform = `translateY(${window.innerHeight * 2}px)`;
  });

  document.addEventListener('wheel', onWheel);
  document.addEventListener('scroll', onScroll);
  document.querySelectorAll('.scroll-prompt button').forEach($button => {
    $button.addEventListener('click', scrollNext);
  });
});