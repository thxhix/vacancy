let activeItems = [];

document.addEventListener("DOMContentLoaded", () => {
    let activeTab = "active";

    itemsInit();

    // * Clicked Events
    // ? Clicked Events
    // ! Clicked Events

    document.addEventListener("click", (event) => {
        let target = event.target;

        if (target.closest(".modal-open-trigger")) {
            modalOpen(target.closest(".modal-open-trigger").getAttribute("data-modal"));
        }
        if (target.closest(".modal-close-trigger")) {
            modalClose(target.closest(".modal-close-trigger").getAttribute("data-modal"));
        }
        // * Переключение между табами
        if (target.closest(".menu .menu-list .menu-list__item")) {
            let click = target.closest(".menu .menu-list .menu-list__item");
            let activeTabName = click.getAttribute("data-tab");
            // Перезаписываем переменную активный таб
            let activeTab = activeTabName;

            // Очищаем checked у айтемов и чекбокса в фильтре
            activeItems = [];

            let filterCheckbox = document.querySelector(".mtFilter .mtFilter-checkbox .mtFilter-checkbox__input");
            filterCheckbox.checked = false;
            filterCheckbox.parentNode.querySelector(".mtFilter-checkbox__fake").classList.remove("mtFilter-checkbox__fake--half");

            let items = document.querySelectorAll(".tab .item");
            items.forEach((item) => {
                let checkbox = item.querySelector(".item-checkbox__input");
                checkbox.checked = false;
            });

            // Меняем фильтр
            let filter = document.querySelector(".mtFilter");
            // let filterSearch = document.querySelector(".mtFilter .mtFilter-right .mtFilter-search");
            // let filterDropdownCity = document.querySelector(".mtFilter .mtFilter-right .mtFilter-dropdown--city");
            // let filterDropdownSort = document.querySelector(".mtFilter .mtFilter-right .mtFilter-dropdown--sort");

            if (activeTab == "active") {
                filter.classList.value = `mtFilter mtFilter--active`;
            }
            if (activeTab == "wait") {
                filter.classList.value = `mtFilter mtFilter--wait`;
            }
            if (activeTab == "archive") {
                filter.classList.value = `mtFilter mtFilter--archive`;
            }
            if (activeTab == "draft") {
                filter.classList.value = `mtFilter mtFilter--draft`;
            }

            //

            disableFilterButtons();
        }

        // * Общий чекбокс в фильтре
        if (target.closest(".mtFilter .mtFilter-checkbox__fake ")) {
            let parent = target.closest(".mtFilter .mtFilter-checkbox__fake").parentNode;
            let hidden = parent.querySelector(".mtFilter-checkbox__input");
            let visible = target.closest(".mtFilter .mtFilter-checkbox__fake");

            if (!hidden.checked) {
                let items = document.querySelectorAll(`.tab--${activeTab} .item`);

                visible.classList.remove("mtFilter-checkbox__fake--half");

                items.forEach((item) => {
                    let hiddenInput = item.querySelector(".item-checkbox__input");
                    let itemId = item.getAttribute("data-id");
                    // Записываем ID в массив
                    if (activeItems.indexOf(itemId) === -1) {
                        activeItems.push(itemId);
                    }
                    // Ставим Checked
                    hiddenInput.checked = true;
                });
            } else {
                let items = document.querySelectorAll(`.tab--${activeTab} .item`);

                visible.classList.remove("mtFilter-checkbox__fake--half");

                items.forEach((item) => {
                    let hiddenInput = item.querySelector(".item-checkbox__input");
                    let itemId = item.getAttribute("data-id");
                    // Удаляем из массива
                    activeItems.splice(activeItems.indexOf(itemId), 1);
                    // Ставим Checked
                    hiddenInput.checked = false;
                });
            }

            //
            disableFilterButtons();
        }

        // * Открываем выпадающие списки в фильтре
        if (target.closest(".mtFilter .mtFilter-dropdown-input")) {
            let menus = document.querySelectorAll(".mtFilter .mtFilter-dropdown");
            menus.forEach((item) => {
                item.classList.remove("active");
            });

            let menu = target.closest(".mtFilter .mtFilter-dropdown-input").parentNode;
            menu.classList.toggle("active");
        } else {
            let menus = document.querySelectorAll(".mtFilter .mtFilter-dropdown");
            menus.forEach((item) => {
                item.classList.remove("active");
            });
        }

        // * Клик по элементу в выпадающем списке
        if (target.closest(".mtFilter .mtFilter-dropdown-menu-item")) {
            let clickedOption = target.closest(".mtFilter .mtFilter-dropdown-menu-item");
            let container = clickedOption.parentNode;
            let options = container.querySelectorAll(".mtFilter-dropdown-menu-item");

            // Обновляем active
            options.forEach((option) => {
                option.classList.remove("active");
            });
            clickedOption.classList.add("active");

            // Прописываем новые данные инпуту
            let clickData = clickedOption.getAttribute("data-value");
            let input = clickedOption.parentNode.parentNode.querySelector(".mtFilter-dropdown-input");
            let inputValue = input.querySelector(".mtFilter-dropdown-input__value");

            input.setAttribute("data-sort", clickData);
            inputValue.textContent = input.getAttribute("data-sort");
        }

        // * Открываем - закрываем dropdown "Еще действия" у айтемов
        if (target.closest(".actions__item.action-more")) {
            let currentItem = target.closest(".actions__item.action-more");
            let dropdown = currentItem.querySelector(".more-dropdown");

            dropdown.classList.toggle("active");
        } else {
            let items = document.querySelectorAll(".actions__item.action-more");
            items.forEach((item) => {
                if (item.querySelector(".more-dropdown")) {
                    item.querySelector(".more-dropdown").classList.remove("active");
                }
            });
        }

        // * Чекбоксы у айтемов
        if (target.closest(".tab .item .item-checkbox .item-checkbox__fake")) {
            let parent = target.closest(".tab .item .item-checkbox .item-checkbox__fake").parentNode;
            let itemId = parent.parentNode.parentNode.getAttribute("data-id");
            let hidden = parent.querySelector(".item-checkbox__input");

            if (!hidden.checked) {
                // Записываем ID в массив
                if (activeItems.indexOf(itemId) === -1) {
                    activeItems.push(itemId);
                }
            } else {
                // Удаляем из массива
                activeItems.splice(activeItems.indexOf(itemId), 1);
            }

            // Меняем чекбокс в фильтре (Если выбраны все - галочка, если не все - черточка)
            let currentTab = parent.parentNode.parentNode.parentNode;
            let itemsCount = currentTab.querySelectorAll(".item").length;
            let filterVisibleInput = document.querySelector(".mtFilter .mtFilter-checkbox__fake");
            let filterHiddenInput = document.querySelector(".mtFilter-checkbox__input");

            if (activeItems.length == itemsCount) {
                filterVisibleInput.classList.remove("mtFilter-checkbox__fake--half");
                filterHiddenInput.checked = true;
            } else if (activeItems.length > 0 && activeItems.length < itemsCount) {
                filterVisibleInput.classList.add("mtFilter-checkbox__fake--half");
                filterHiddenInput.checked = false;
            } else {
                filterVisibleInput.classList.remove("mtFilter-checkbox__fake--half");
                filterHiddenInput.checked = false;
            }

            //
            disableFilterButtons();
        }
        //
        if (target.closest(".item .item__actions .actions__item.action-archive")) {
            let currentClick = target.closest(".item .item__actions .actions__item.action-archive");

            let itemData = currentClick.parentNode.parentNode.parentNode.getAttribute("data-id");

            modalOpen("archive-self", itemData);
        }
    });

    // * DOM Loaded Events
    // ? DOM Loaded Events
    // ! DOM Loaded Events

    function disableFilterButtons() {
        let boostButton = document.querySelector(".mtFilter .mtFilter-button--boost");
        let archiveButton = document.querySelector(".mtFilter .mtFilter-button--archive");
        let activateButton = document.querySelector(".mtFilter .mtFilter-button--activate");
        let transferButton = document.querySelector(".mtFilter .mtFilter-button--transfer");
        let deleteButton = document.querySelector(".mtFilter .mtFilter-button--delete");

        if (activeItems.length > 0) {
            boostButton.classList.remove("disabled");
            archiveButton.classList.remove("disabled");
            activateButton.classList.remove("disabled");
            transferButton.classList.remove("disabled");
            deleteButton.classList.remove("disabled");
        } else {
            boostButton.classList.add("disabled");
            archiveButton.classList.add("disabled");
            activateButton.classList.add("disabled");
            transferButton.classList.add("disabled");
            deleteButton.classList.add("disabled");
        }
    }

    function modalArchiveInit() {
        let modalArchive = document.querySelector(".mtModal-archive");
        let title = modalArchive.querySelector(".mtModal-inner-head__title");
        let form = modalArchive.querySelector(".mtModal-archive-form");
        if (activeItems.length > 1) {
            title.textContent = `Архивировать ${activeItems.length} ${numWord(activeItems.length, ["вакансию", "вакансии", "вакансий"])}`;
            form.classList.add("hide");
        } else {
            title.textContent = `Укажите причину архивации вакансии`;
            form.classList.remove("hide");
        }
    }

    function numWord(n, text_forms) {
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) {
            return text_forms[2];
        }
        if (n1 > 1 && n1 < 5) {
            return text_forms[1];
        }
        if (n1 == 1) {
            return text_forms[0];
        }
        return text_forms[2];
    }

    function itemsInit() {
        const MAX_CHARS = 3;
        const LIMIT_CHAR = "+99";

        let items = document.querySelectorAll(".tab .item");

        // Проходимся по всем айтемам
        items.forEach((item) => {
            // Прогресс бар
            // Выставляем ширину иннера равную процентам
            let progressBarLine = item.querySelector(".bar-line__inner");
            let progressBarPercents = item.querySelector(".bar__percent");

            if (progressBarPercents) {
                progressBarLine.style.width = `${parseInt(progressBarPercents.textContent)}%`;
            }

            // Кроп новых просмотров/приглашений и тд в счетчиках
            let responses = item.querySelector("#counter-responses");
            if (responses) {
                if (responses.textContent.length - 1 >= MAX_CHARS) {
                    responses.textContent = LIMIT_CHAR;
                }
            }
            let invites = item.querySelector("#counter-invites");
            if (invites) {
                if (invites.textContent.length - 1 >= MAX_CHARS) {
                    invites.textContent = LIMIT_CHAR;
                }
            }
            let views = item.querySelector("#counter-views");
            if (views) {
                if (views.textContent.length - 1 >= MAX_CHARS) {
                    views.textContent = LIMIT_CHAR;
                }
            }
            let fits = item.querySelector("#counter-fits");
            if (fits) {
                if (fits.textContent.length - 1 >= MAX_CHARS) {
                    fits.textContent = LIMIT_CHAR;
                }
            }
        });
    }

    // Открывыем модалки
    function modalOpen(modalName, data = null) {
        if (!modalName) {
            return console.error("Modal ID not found");
        }
        let modal = document.querySelector(`.mtModal-${modalName}`);
        if (!modal) {
            return console.error("Model with that ID is not found.");
        }
        if (data) {
            modal.setAttribute("data-value", data);
        }
        let overlay = document.querySelector(`.mtModal-overlay`);
        overlay.setAttribute("data-modal", modalName);
        overlay.classList.add("active");
        modal.classList.add("active");
        document.body.style.overflowY = "hidden";
        if (modalName == "archive") {
            modalArchiveInit();
        }
    }
    // Закрываем модалки
    function modalClose(modalName) {
        if (!modalName) {
            return console.error("Modal ID not found");
        }
        let modals = document.querySelectorAll(`.mtModal.active`);
        if (!modals) {
            return console.error("No active modals");
        }
        let overlay = document.querySelector(`.mtModal-overlay`);
        modals.forEach((modal) => {
            modal.classList.remove("active");
        });
        overlay.classList.remove("active");
        document.body.style.overflowY = "auto";
    }
});