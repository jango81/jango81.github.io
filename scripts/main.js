document.addEventListener("DOMContentLoaded", () => {
    const announcementSelectors = {
        announcementItem: "announcement__item",
        announcementIcon: "announcement__icon",
        announcementHeading: "announcement__heading",
    };

    const announcementDataAttributes = {
        heading: "data-heading",
        iconUrl: "data-icon",
    };

    class AnnouncementBar extends HTMLElement {
        constructor() {
            super();
            this.contentBlock = this.querySelector(".announcement__content");
            this.iconUrl = this.getAttribute(announcementDataAttributes.iconUrl);
            this.headingText = this.getAttribute(announcementDataAttributes.heading);
            this.windowWidth = window.innerWidth;
            this.itemsCount = 14;
        }
        connectedCallback() {
            this.addItems();
            requestAnimationFrame(this.animate.bind(this));
        }
        addItems() {
            for (let i = 0; i < this.itemsCount; i++) {
                const itemBlock = document.createElement("div");
                itemBlock.classList.add(announcementSelectors.announcementItem);

                const iconElement = document.createElement("div");
                iconElement.classList.add(announcementSelectors.announcementIcon);
                iconElement.innerHTML = `<img src="${this.iconUrl}" alt="" />`;

                const headingElement = document.createElement("h3");
                headingElement.classList.add(announcementSelectors.announcementHeading);
                headingElement.textContent = this.headingText;

                itemBlock.appendChild(iconElement);
                itemBlock.appendChild(headingElement);

                this.contentBlock.prepend(itemBlock);
            }
        }
        checkViewPoint(element) {
            const rect = element.getBoundingClientRect();
            const elementRight = rect.right;

            if (elementRight <= 0) {
                this.contentBlock.appendChild(element);
                element.style.marginLeft = 0;
                return true;
            }

            return false;
        }
        animate() {
            const firstElement = this.querySelector(`.${announcementSelectors.announcementItem}:first-child`);

            const elementMarginLeft = parseInt(window.getComputedStyle(firstElement).marginLeft);

            if (isNaN(elementMarginLeft)) {
                elementMarginLeft = 0;
            }

            firstElement.style.marginLeft = `${elementMarginLeft - 1}px`;

            this.checkViewPoint(firstElement);

            requestAnimationFrame(this.animate.bind(this));
        }
    }
    customElements.define("announcement-bar", AnnouncementBar);

    const headerSelectors = {
        headerTag: "header",
        burgerMenu: "header__burger",
        navButton: "navigation__button",
        drawer: "header__drawer",
        headerItem: "header__item",
        menuItem: "menu__item",
        subMenu: "submenu",
        navOpenSubMenuBtn: "navigation__open button",
        navOpenSubMenuBlock: "navigation__open",
    };

    class CustomHeader extends HTMLElement {
        constructor() {
            super();

            this.siteWrapper = document.querySelector("#wrapper");
            this.headerTag = document.querySelector(`#${headerSelectors.headerTag}`);
            this.burgerMenu = this.querySelector(`.${headerSelectors.burgerMenu}`);
            this.navigationButton = this.querySelector(`.${headerSelectors.navButton}`);
            this.drawer = this.querySelector(`.${headerSelectors.drawer}`);
            this.headerItem = [...this.querySelectorAll(`.${headerSelectors.headerItem}`)];
            this.menuItem = [...this.querySelectorAll(`.${headerSelectors.menuItem}`)];
            this.navOpenSubMenuBtn = [...this.querySelectorAll(`.${headerSelectors.navOpenSubMenuBtn}`)];
        }
        connectedCallback() {
            this.init();
        }

        init() {
            this.siteWrapper.addEventListener("scroll", this.showHeaderScrolled.bind(this));
            this.burgerMenu.addEventListener("click", this.setNavigationClass.bind(this));
            this.navigationButton.addEventListener("click", this.removeNavigationClass.bind(this));
            this.drawer.addEventListener("click", this.removeNavigationClass.bind(this));
            this.navOpenSubMenuBtn.forEach((element) => {
                element.addEventListener("click", this.navSubmenuButtonHandle.bind(this));
            });
            this.headerItem.forEach((element) => {
                element.addEventListener("mouseover", this.showSubMenu.bind(this));
                element.addEventListener("mouseout", this.hideSubMenu.bind(this));
            });

            this.menuItem.forEach((element) => {
                const subMenu = this.checkSubmenu(element);
                if (subMenu) {
                    subMenu.style.height = 0;
                }
            });
        }

        showHeaderScrolled() {
            const rect = this.headerTag.getBoundingClientRect();
            const headerTopSide = rect.top;
            const headerBottomSide = rect.bottom;
            const headerHeight = this.headerTag.offsetHeight;

            if (headerTopSide < 0 - headerHeight) {
                this.headerTag.style.height = headerHeight;
                this.classList.add("scrolled");
            } else if (headerBottomSide >= 0 && this.classList.contains("scrolled")) {
                this.classList.remove("scrolled");
                this.classList.add("hide");
                this.addEventListener(
                    "animationend",
                    () => {
                        this.classList.remove("hide");
                    },
                    { once: true }
                );
            }
        }

        //Set class active to navigation that showing it
        setNavigationClass() {
            document.querySelector(".navigation").classList.add("_active");
            document.querySelector(".header__drawer").classList.add("_active");
        }
        //Remove class active from navigation that closing it
        removeNavigationClass() {
            document.querySelector(".navigation").classList.remove("_active");
            document.querySelector(".header__drawer").classList.remove("_active");
        }

        //Checking if nav link has submenu
        checkSubmenu(menuItem) {
            const children = [...menuItem.children];
            for (const child of children) {
                if (child.classList.contains(headerSelectors.subMenu)) {
                    const parent = child.closest(`.${headerSelectors.menuItem}`);
                    const buttonBlock = parent.querySelector(`.${headerSelectors.navOpenSubMenuBlock}`);

                    if (buttonBlock) {
                        buttonBlock.style.visibility = "visible";
                    }
                    return child;
                }
            }

            return null;
        }

        showSubMenu(event) {
            const currentMenuItem = event.currentTarget;
            const subMenu = this.checkSubmenu(currentMenuItem);

            if (subMenu && subMenu.classList.contains("_active")) return;

            if (subMenu) {
                subMenu.classList.add("_active");
                this.changeHeight(subMenu);
            }
        }

        hideSubMenu(event) {
            const currentMenuItem = event.currentTarget;
            const toElement = event.relatedTarget;
            const subMenu = this.checkSubmenu(currentMenuItem);

            if (subMenu && !subMenu.classList.contains("_active")) return;

            if (subMenu && (currentMenuItem.contains(toElement) || subMenu.contains(toElement))) {
                return;
            }

            if (subMenu) {
                subMenu.classList.remove("_active");
                this.changeHeight(subMenu);
            }
        }

        //Changing submenu height
        changeHeight(subMenu) {
            if (subMenu.classList.contains("_active")) {
                const height = subMenu.scrollHeight + "px";
                subMenu.style.height = "0px";

                setTimeout(function () {
                    subMenu.style.height = height;
                }, 0);
            } else {
                subMenu.style.height = "0px";
            }
        }

        //Submenu button click handle (mobile only)
        navSubmenuButtonHandle(event) {
            const button = event.currentTarget;
            const parent = button.closest(`.${headerSelectors.menuItem}`);
            const subMenu = this.checkSubmenu(parent);

            if (subMenu) {
                subMenu.classList.toggle("_active");
                this.changeHeight(subMenu);
            }

            button.classList.toggle("_active");
        }
    }

    customElements.define("custom-header", CustomHeader);

    const mealsSelectors = {
        mealsDays: "meals__days",
        mealsPopup: "meals-popup",
        mealsPopupImage: "meals-popup__image",
        mealsSlideImage: "meals-slide__image",
    };

    class CustomMeals extends HTMLElement {
        constructor() {
            super();
            this.daysElement = this.querySelector(`.${mealsSelectors.mealsDays}`);
            this.mealsPopup = this.querySelector(`.${mealsSelectors.mealsPopup}`);
            this.mealsPopupImage = this.querySelector(`.${mealsSelectors.mealsPopupImage}`);
            this.mealsSlideImages = this.querySelectorAll(`.${mealsSelectors.mealsSlideImage}`);
        }
        connectedCallback() {
            this.init();
            this.addDays();
        }
        init() {
            this.daysObj = {
                monday: "Maanantai",
                tuesday: "Tiistai",
                wednesday: "Keskiviikko",
                thursday: "Torstai",
                friday: "Perjantai",
                saturday: "Lauantai",
                sunday: "Sunnuntai",
            };

            if (this.mealsSlideImages.length > 0 && this.mealsPopup) {
                this.mealsSlideImages.forEach((el) => el.addEventListener("click", this.openPopup.bind(this)));
            }
        }
        openPopup(e) {
            const currentImage = e.currentTarget.querySelector("img");
            const imagePath = currentImage.getAttribute("src");

            if (imagePath === "") throw new Error("Image path undefined");

            this.mealsPopup.classList.add("_active");
            this.mealsPopupImage.querySelector("img").setAttribute("src", imagePath);
            this.mealsPopup.addEventListener("click", this.closePopup.bind(this));
        }
        closePopup(e) {
            this.mealsPopup.classList.remove("_active");
        }
        buttonClickHandle(event) {
            const currentBtn = event.currentTarget;
            if (this.clickedBtn) this.clickedBtn.classList.remove("_active");

            this.clickedBtn = currentBtn;
            currentBtn.classList.toggle("_active");
        }
        addDays() {
            this.daysElement.innerHTML = "";

            if (window.innerWidth > 640) {
                for (const day in this.daysObj) {
                    this.daysElement.innerHTML += `<li><button>${this.daysObj[day]}</button></li>`;
                    this.daysElement.querySelectorAll("button").forEach((el) => el.addEventListener("click", this.buttonClickHandle.bind(this)));
                }
            } else if (window.innerWidth < 640) {
                for (const day in this.daysObj) {
                    const calcSliceIndex = 0 - this.daysObj[day].length + 2;
                    const shortestDay = this.daysObj[day].slice(0, calcSliceIndex);
                    this.daysElement.innerHTML += `<li><button>${shortestDay}</button></li>`;
                    this.daysElement.querySelectorAll("button").forEach((el) => el.addEventListener("click", this.buttonClickHandle.bind(this)));
                }
            }
        }
    }

    customElements.define("custom-meals", CustomMeals);

    const customOrderSelectors = {};

    class CustomOrder extends HTMLElement {
        constructor() {
            super();
        }
    }

    customElements.define("custom-order", CustomOrder);

    const customSelect = {
        customSelecValue: "custom-select__value",
        customSelectOptions: "custom-select__options",
        customSelectOption: "custom-select__option",
    };

    class CustomSelect extends HTMLElement {
        constructor() {
            super();
            this.defaulSelect = this.querySelector("select");
            this.customSelectValue = this.querySelector(`.${customSelect.customSelecValue}`);
            this.customSelectOptions = this.querySelector(`.${customSelect.customSelectOptions}`);
            this.customSelectOption = this.querySelectorAll(`.${customSelect.customSelectOption}`);
            this.heading = this.getAttribute("data-heading");
        }

        connectedCallback() {
            this.init();
        }

        init() {
            this.changeHeading();
            this.customSelectValue.addEventListener("click", this.selectClickHandle.bind(this));
        }

        changeHeading() {
            this.customSelectValue.querySelector("h5").textContent = this.heading;
        }

        selectClickHandle() {
            this.customSelectValue.classList.toggle("_opened");
            this.customSelectOptions.classList.toggle("_opened");

            if (this.customSelectValue.classList.contains("_opened") && this.customSelectOptions.classList.contains("_opened")) {
                this.openSelectOptions();
            } else {
                this.closeSelectOptions();
            }
        }

        openSelectOptions() {
            let optionsHeight = 0;
            const selectValueHeight = this.customSelectValue.offsetHeight;
            this.customSelectOptions.style.height = "auto";
            optionsHeight = this.customSelectOptions.offsetHeight;

            setTimeout(() => {
                this.customSelectOptions.style.height = `${optionsHeight + selectValueHeight}px`;
                this.customSelectOptions.style.paddingTop = `${selectValueHeight + 10}px`;
            }, 0);

            this.customSelectOption.forEach((el) => el.addEventListener("click", this.setSelectData.bind(this)));
        }
        closeSelectOptions() {
            if (this.customSelectValue.classList.contains("_opened") && this.customSelectOptions.classList.contains("_opened")) {
                this.customSelectValue.classList.remove("_opened");
                this.customSelectOptions.classList.remove("_opened");
            }
            this.customSelectOptions.style.height = 0;
            this.customSelectOptions.style.paddingTop = 0;
        }

        setSelectData(event) {
            const currentOption = event.currentTarget;
            const dataValue = currentOption.getAttribute("data-value");
            if (!dataValue) throw new Error("data-value attribute is undefined");
            this.defaulSelect.value = dataValue;
            this.heading = dataValue;
            this.changeHeading();
            this.closeSelectOptions();
        }
    }

    customElements.define("custom-select", CustomSelect);

    const customRadioSelectors = {
        radioBullet: "custom-radio__bullet",
        radioHeading: "custom-radio__heading",
        radioPrice: "custom-radio__price",
    };

    class RadiosHandler {
        constructor() {
            this.sameRadioNames = new Set();
            this.radios = new Map();
        }

        addRadio(element) {
            console.log("before adding");
            console.log(this.radios);

            let currentRadio = element;

            let radioName = currentRadio.getAttribute("data-radio");

            this.sameRadioNames.add(radioName);

            if (!this.radios.has(radioName)) {
                this.radios.set(radioName, [currentRadio]);
            } else {
                const radioElements = this.radios.get(radioName);
                radioElements.push(currentRadio);
                this.radios.set(radioName, radioElements);
            }

            this.checkForGroup(radioName);
            this.init(radioName);

            console.log("after adding");
            console.log(this.radios);
        }

        deleteRadio(element) {
            console.log("Before deleting: ");
            console.log(this.radios);

            let currentRadio = element;
            let radioName = currentRadio.getAttribute("data-radio");

            if (this.radios.has(radioName)) {
                const radioElements = this.radios.get(radioName);
                let changedArray = radioElements.filter((el) => el !== currentRadio);
                this.radios.set(radioName, changedArray);
            }

            this.checkForGroup(radioName);

            console.log("After deleting:");
            console.log(this.radios);
        }

        checkForGroup(key) {
            if (this.radios.has(key)) {
                const radioElements = this.radios.get(key);
                const radioElementsLength = radioElements.length;
                console.log("length: " + radioElementsLength);
                if (radioElementsLength === 1) {
                    radioElements[0].setGroupStatus = false;
                    radioElements[0].setGroupName = "";
                    radioElements[0].setGroup = [];
                } else if (radioElementsLength <= 0) {
                    this.radios.delete(key);
                } else {
                    radioElements.forEach((el) => {
                        el.setGroupStatus = true;
                        el.setGroupName = key;
                        el.setGroup = radioElements;
                    });
                }
            }
        }

        init(key) {
            if (this.radios.has(key)) {
                const radioElements = this.radios.get(key);

                this.clearAllClasses(key);

                radioElements.forEach((el) => {
                    el.querySelector("input[type='radio']").checked = false;
                });

                if (radioElements.length === 1) {
                    radioElements[0].querySelector("input[type='radio']").checked = true;
                    radioElements[0].classList.add("_checked");
                } else if (radioElements.length > 1) {
                    let hasChecked = false;

                    for (const element of radioElements) {
                        const radioInput = element.querySelector("input[type='radio']");
                        if (radioInput.checked) {
                            element.classList.add("_checked");
                            hasChecked = true;
                            break;
                        }
                    }

                    if (!hasChecked) {
                        radioElements[0].querySelector("input[type='radio']").checked = true;
                        radioElements[0].classList.add("_checked");
                    }
                }
            }
        }

        clearAllClasses(key) {
            if (this.radios.has(key)) {
                this.radios.get(key).forEach((el) => {
                    el.classList.remove("_checked");
                    el.querySelector("input[type='radio']").checked = false;
                });
            }
        }

        clickHandle(event) {
            const clickedRadio = event.currentTarget;
            const radioGroupName = clickedRadio.getGroupName;

            if(clickedRadio.classList.contains("_checked")) return;

            this.clearAllClasses(radioGroupName);

            clickedRadio.classList.add("_checked");
            clickedRadio.querySelector("input[type='radio']").checked = true;
        }
    }

    const radioHandler = new RadiosHandler();

    class CustomRadio extends HTMLElement {
        constructor() {
            super();
            this.radioHeading = this.querySelector(`.${customRadioSelectors.radioHeading}`);
            this.radioBullet = this.querySelector(`${customRadioSelectors.radioBullet}`);
            this.radioPrice = this.querySelector(`.${customRadioSelectors.radioPrice}`);
            this.customRadios = document.querySelectorAll("custom-radio");
            this.checked = false;
            this.hasGroup = false;
            this.groupName = "";

            this.addEventListener("click", (event) => radioHandler.clickHandle(event));
        }

        set setGroupStatus(value) {
            this.hasGroup = value;
        }
        get getGroupStatus() {
            return this.hasGroup;
        }
        set setGroupName(value) {
            this.groupName = value;
        }
        get getGroupName() {
            return this.groupName;
        }
        set setGroup(value) {
            this.group = value;
        }
        get getGroup() {
            return this.group;
        }

        connectedCallback() {
            radioHandler.addRadio(this);
            this.setInfo();
        }
        disconnectedCallback() {
            radioHandler.deleteRadio(this);
        }
        
        setInfo() {
            let price = this.getAttribute("data-price") !== "" ? this.getAttribute("data-price") : "0.00€";
            this.radioHeading.textContent = this.getAttribute("data-heading");
            this.radioPrice.textContent = price;
        }
    }

    customElements.define("custom-radio", CustomRadio);

    const infoSwiper = new Swiper(".info-swiper", {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 20,
        pagination: {
            el: ".info-swiper__pagination",
        },
    });
    const mealsSwiper = new Swiper(".meals-swiper", {
        loop: false,
        breakpoints: {
            550: {
                slidesPerView: 2,
            },
            980: {
                slidesPerView: 3,
            },
            1340: {
                slidesPerView: 4,
            },
        },
        pagination: {
            el: ".meals-swiper__pagination",
        },
    });
    window.addEventListener("resize", () => {
        document.querySelector(".meals").addDays();
    });

    let lastTouchEnd = 0;

    document.addEventListener(
        "touchend",
        function (event) {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault(); // Предотвращаем зум при двойном касании
            }
            lastTouchEnd = now;
        },
        false
    );
});
