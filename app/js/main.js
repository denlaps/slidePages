function refreshScreen() {
  window.winTop = document.documentElement.scrollTop;
  window.screenMap.forEach(($el, index, arr) => {
    const top = $el.offsetTop + (window.isMobile ? -1 : 0);
    const bottom = $el.offsetTop + $el.offsetHeight;
    if (winTop >= top && winTop <= bottom) {
      window.screenState = {
        prev: arr[index - 1] ? index - 1 : null,
        current: index,
        next: arr[index + 1] ? index + 1 : null
      }
    }
  });
}

function updateMenu() {
  document.querySelectorAll('.mainMenu a').forEach(($item) => {
    if ($item.dataset.id == window.screenState.current) {
      $item.classList.add('active');
    } else {
      $item.classList.remove('active');
    }
  });
}

function replaceHeader(firstLoad) {
  refreshScreen();
  updateMenu();

  const attachAction = prevScreen === 0 && screenState.current === 1 || (firstLoad && screenState.current !== 0);
  const detachAction = prevScreen === 1 && screenState.current === 0;

  if (window.isMobile) {
    const $menu = document.querySelector('.toggleMenu');

    if(attachAction) {
      $menu.classList.add('toggleMenu_invert');
    } else if(detachAction) {
      $menu.classList.remove('toggleMenu_invert');
    }
  } else {
    const $header = document.querySelector('header');

    if (attachAction) {
      $header.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        $header.classList.add('attached');
      }, 0);
    } else if (detachAction) {
      $header.style.transform = 'translateY(0)';
      $header.classList.remove('attached');
    }
  }

  window.prevScreen = screenState.current;
}

function makeScroll($section, dir, step = 20, count) {
  if(!$section) {
    window.wheelBlocked = false;
    return false;
  }

  const newTop = $section.offsetTop;

  if (count === undefined) {
    count = winTop;
  }
  // If current point is end position => stop recursion
  const endMove = (winTop + step >= newTop) && (dir > 0) 
  || (winTop - step <= newTop) && (dir < 0);
  
  if(endMove) {
    window.scrollTo(0, newTop);
    window.wheelBlocked = false;
    return false;
  };

  requestAnimationFrame(() => {
    window.scrollTo(0, count);
    count = winTop < newTop ? count + step : count - step;
    makeScroll($section, dir, step, count);
  });
}

function addShadow($section, transY) {
  if(!$section || !screenMap[screenState.next] || window.isMobile) return false;

  transY = window.innerHeight - transY * 2;
  transY = transY < 0 ? 0 : transY;
  const $overlay = $section.querySelector('.fullScreen__overlay');
  $overlay.style.transform = `translateY(${transY}px)`;
}

function onWheel(ev) {
  window.prevTop = window.winTop;
  window.winTop = document.documentElement.scrollTop;
  const wheelDiff = winTop - prevTop;
  
  if (window.isMobile || wheelDiff !== 0) return false;

  refreshScreen();
  window.scrollDir = ev.deltaY;

  const winBottom = winTop + window.innerHeight;
  const top = screenMap[screenState.current].offsetTop;
  const bottom = screenMap[screenState.current].offsetTop + screenMap[screenState.current].offsetHeight;
  const stepScroll = scrollDir < 0 ? -100 : 100;
  const inSection = winTop + stepScroll >= top && winBottom + stepScroll <= bottom;

  if (window.wheelBlocked || inSection) return false;
  window.wheelBlocked = true;
  makeScroll(
    window.scrollDir > 0 ? screenMap[screenState.next] : screenMap[screenState.prev], 
    window.scrollDir
  );
}

function onScroll() {
  window.isMobile = window.innerWidth <= 600;
  window.winTop = document.documentElement.scrollTop;
  const top = screenMap[screenState.current].offsetTop;
  const bottom = top + screenMap[screenState.current].offsetHeight;

  if (winTop - 1 < top || winTop + 1 > bottom) {
    replaceHeader();
  }

  addShadow(
    screenMap[screenState.current],
    winTop - screenMap[screenState.current].offsetTop
  );
}

function scrollOnClick(ev) {
  ev.preventDefault();
  const screenId = ev.target.dataset.id || screenState.next;
  window.scrollDir = screenId > screenState.current ? 100 : -100;
  makeScroll(screenMap[screenId], window.scrollDir, 40);

  if(ev.target.dataset.id) {
    toggleMenu();
  }
}

function toggleMenu() {
  const $button = document.querySelector('.toggleMenu');
  const $menu = document.querySelector('.mainMenu');
  $button.classList.toggle('toggleMenu_opened');
  $menu.classList.toggle('mainMenu_show');
}

document.addEventListener('DOMContentLoaded', () => {
  window.winTop = document.documentElement.scrollTop;
  window.screenMap = document.querySelectorAll('.fullScreen');

  refreshScreen();
  window.prevScreen = screenState.current;
  replaceHeader(true);

  document.querySelectorAll('.fullScreen__overlay').forEach($overlay => {
    $overlay.style.transform = `translateY(${window.innerHeight * 2}px)`;
  });

  document.addEventListener('wheel', onWheel);
  document.addEventListener('scroll', onScroll);
  document.querySelectorAll('.scroll-prompt button').forEach($button => {
    $button.addEventListener('click', scrollOnClick);
  });
  document.querySelectorAll('.mainMenu a').forEach($button => {
    $button.addEventListener('click', scrollOnClick);
  });
  
  document.querySelector('.toggleMenu').addEventListener('click', toggleMenu);
});