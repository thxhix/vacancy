initSelfMenu();

function initSelfMenu() {
    const menuStartLink = document.querySelector(".menu .menu-list .menu-list__item.active");
    const startTab = document.querySelector(`.tab-${menuStartLink.getAttribute("data-tab")}`);

    const menuLinks = document.querySelectorAll(".menu .menu-list .menu-list__item");
    const menuLine = document.querySelector(".menu .menu__line");

    startTab.classList.add("tab--active");
    menuLine.style.width = `${menuStartLink.offsetWidth}px`;
    menuLine.style.left = `${menuStartLink.offsetLeft}px`;

    //переключение меню
    function showBlock(link) {
        menuLinks.forEach(function (menuLink) {
            const elData = menuLink.getAttribute("data-tab");
            const block = document.querySelector(`.tab-${elData}`);
            if (link !== menuLink) {
                menuLink.classList.remove("active");
                block.classList.remove("tab--active");
            } else {
                menuLink.classList.add("active");
                block.classList.add("tab--active");
            }
        });
        // Двигаем слайдер под кнопками
        menuLine.style.width = `${link.offsetWidth}px`;
        menuLine.style.left = `${link.offsetLeft}px`;
    }

    menuLinks.forEach(function (menuLink) {
        menuLink.addEventListener("click", () => showBlock(menuLink));
    });
}
