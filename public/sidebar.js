var sidebarEl = document.querySelector(".sidebar");

function fadeIn (e) {
    sidebarEl.className = 'sidebar fullHeight';
    sidebarEl.classList.add('move_right');
}

function fadeOut (e) {
    sidebarEl.className = 'sidebar fullHeight';
    sidebarEl.classList.add('move_left');
}
