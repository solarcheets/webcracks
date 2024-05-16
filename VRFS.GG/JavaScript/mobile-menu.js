//откритие/закрытие мобильного меню
const btnOpen = document.getElementById('button-menu-open');
const btnClose = document.getElementById('button-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const page = document.querySelector('.main');
const mobileLinkList = document.querySelectorAll('.mobile__navigatoin-link-text');


function toggleClass() {
  console.log('mobileMenu', mobileMenu)
  mobileMenu.classList.toggle('mobile-menu_opened');
  page.classList.toggle('mobile-menu_opened-body');
}
function removeClass() {
  mobileMenu.classList.remove('mobile-menu_opened');
  page.classList.remove('mobile-menu_opened-body');
}

btnOpen.addEventListener('click', toggleClass);
btnClose.addEventListener('click', removeClass);
for (let link of mobileLinkList) {
  link.addEventListener('click', removeClass);
}