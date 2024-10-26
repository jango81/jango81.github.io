import { Time } from "./helper.js";
document.addEventListener("DOMContentLoaded", () => {
    const announcementSelectors = {
        announcementItem: ".announcement__item",
        announcementIcon: ".announcement__icon",
        announcementHeading: ".announcement__heading",
    };

    const announcementDataAttributes = {
        heading: "data-heading",
        iconUrl: "data-icon",
    };

    class AnnouncementBar extends HTMLElement {
        constructor() {
            super();
            this.windowWidth = window.innerWidth;
            this.itemsCount = 14;
        }
        init() {
            this.contentBlock = this.querySelector(".announcement__content");
            this.iconUrl = this.getAttribute(announcementDataAttributes.iconUrl);
            this.headingText = this.getAttribute(announcementDataAttributes.heading);
        }
        connectedCallback() {
            this.init();
            this.addItems();
            requestAnimationFrame(this.animate.bind(this));
        }
        addItems() {
            for (let i = 0; i < this.itemsCount; i++) {
                const itemBlock = document.createElement("div");
                itemBlock.classList.add("announcement__item");

                const iconElement = document.createElement("div");
                iconElement.classList.add("announcement__icon");
                iconElement.innerHTML = `<img src="${this.iconUrl}" alt="" />`;

                const headingElement = document.createElement("h3");
                headingElement.classList.add("announcement__heading");
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
            const firstElement = this.querySelector(`${announcementSelectors.announcementItem}:first-child`);

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
        headerTag: ".header",
        burgerMenu: ".header__burger",
        navButton: ".navigation__button",
        drawer: ".header__drawer",
        headerItem: ".header__item",
        menuItem: ".menu__item",
        subMenu: ".submenu",
        navOpenSubMenuBtn: ".navigation__open button",
        navOpenSubMenuBlock: ".navigation__open",
        navRow: ".navigation__row",
        cartIcon: ".header__cart-icon",
    };

    class CustomHeader extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.init();
        }

        init() {
            this.siteWrapper = document.querySelector("#wrapper");
            this.headerTag = document.querySelector("#header");
            this.mainDark = document.querySelector(".main__dark");

            this.burgerMenu = this.querySelector(headerSelectors.burgerMenu);
            this.navigationButton = this.querySelector(headerSelectors.navButton);
            this.drawer = this.querySelector(headerSelectors.drawer);
            this.cartIcon = this.querySelector(headerSelectors.cartIcon);
            this.headerItem = [...this.querySelectorAll(headerSelectors.headerItem)];
            this.menuItem = [...this.querySelectorAll(headerSelectors.menuItem)];
            this.navOpenSubMenuBtn = [...this.querySelectorAll(headerSelectors.navOpenSubMenuBtn)];
            this.navRow = [...this.querySelectorAll(headerSelectors.navRow)];

            this.menuItem.forEach((element) => {
                const subMenu = this.checkSubmenu(element);
                if (subMenu) {
                    subMenu.style.height = 0;
                }
            });

            this.addListeners();
        }

        addListeners() {
            this.cartIcon.addEventListener("click", this.showCart.bind(this));
            this.siteWrapper.addEventListener("scroll", this.showHeaderScrolled.bind(this));
            this.burgerMenu.addEventListener("click", this.setNavigationClass.bind(this));
            this.navigationButton.addEventListener("click", this.removeNavigationClass.bind(this));
            this.drawer.addEventListener("click", this.removeNavigationClass.bind(this));

            this.navRow.forEach((element) => {
                const subMenu = element.nextElementSibling;
                if (subMenu) {
                    element.addEventListener("click", this.navSubmenuButtonHandle.bind(this));
                }
            });

            this.headerItem.forEach((element) => {
                element.addEventListener("mouseover", this.showSubMenu.bind(this));
                element.addEventListener("mouseout", this.hideSubMenu.bind(this));
            });
        }
        showCart() {
            document.querySelector("#cart").classList.add("_active");
            this.mainDark.classList.add("_active");
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
        setNavigationClass() {
            document.querySelector(".navigation").classList.add("_active");
            document.querySelector(".header__drawer").classList.add("_active");
        }
        removeNavigationClass() {
            document.querySelector(".navigation").classList.remove("_active");
            document.querySelector(".header__drawer").classList.remove("_active");
        }

        checkSubmenu(menuItem) {
            const children = [...menuItem.children];
            for (const child of children) {
                if (child.classList.contains("submenu")) {
                    const parent = child.closest(".menu__item");
                    const buttonBlock = parent.querySelector(headerSelectors.navOpenSubMenuBlock);

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

            if (subMenu && (currentMenuItem.contains(toElement) || subMenu.contains(toElement))) return;

            if (subMenu) {
                subMenu.classList.remove("_active");
                this.changeHeight(subMenu);
            }
        }

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

        navSubmenuButtonHandle(event) {
            const target = event.currentTarget;
            const parent = target.closest(".menu__item");
            const subMenu = this.checkSubmenu(parent);

            if (subMenu) {
                subMenu.classList.toggle("_active");
                this.changeHeight(subMenu);
            }

            target.classList.toggle("_active");
        }
    }

    customElements.define("custom-header", CustomHeader);

    const cartSelectors = {
        closeButton: ".cart__close",
        amountSelect: ".cart-amount__select",
    };
    class CustomCart extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.init();
        }

        init() {
            this.closeButton = this.querySelector(cartSelectors.closeButton);
            this.amountSelect = this.querySelector(cartSelectors.amountSelect);
            this.mainDark = document.querySelector(".main__dark");
            this.cart = document.querySelector("#cart");

            this.closeButton.addEventListener("click", this.closeHandle.bind(this));
            this.mainDark.addEventListener("click", () => {
                this.mainDark.classList.remove("_active");
                this.classList.remove("_active");
            });
        }

        closeHandle() {
            this.classList.remove("_active");
            this.mainDark.classList.remove("_active");
        }
    }
    customElements.define("custom-cart", CustomCart);

    const customSelect = {
        customSelecValue: ".custom-select__value",
        customSelectOptions: ".custom-select__options",
        customSelectOption: ".custom-select__option",
    };
    class CustomSelect extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.init();
            this.changeHeading();
        }

        init() {
            this.defaultSelect = this.querySelector("select");
            this.customSelectValue = this.querySelector(customSelect.customSelecValue);
            this.customSelectOptions = this.querySelector(customSelect.customSelectOptions);
            this.customSelectOption = this.querySelectorAll(customSelect.customSelectOption);
            this.heading = this.getAttribute("data-heading");

            this.customSelectValue.addEventListener("click", this.selectClickHandle.bind(this));
            this.customSelectOption.forEach((el) => el.addEventListener("click", this.setSelectData.bind(this)));
            this.defaultSelect.selectedIndex = -1;
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
            const selectValueHeight = this.customSelectValue.offsetHeight;
            const selectValueOptions = this.customSelectOptions.scrollHeight;
            this.customSelectOptions.style.height = "0px";
            setTimeout(() => {
                this.customSelectOptions.style.height = `${selectValueOptions + selectValueHeight}px`;
                this.customSelectOptions.style.paddingTop = `${selectValueHeight}px`;
            }, 0);
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

            this.setAttribute("data-value", dataValue);
            this.defaultSelect.value = dataValue;
            this.heading = currentOption.textContent;

            this.setDefaultSelect(dataValue);

            this.changeHeading();
            this.closeSelectOptions();
        }

        setDefaultSelect(value) {
            const options = this.defaultSelect.options;
            const event = new Event("change");
            this.defaultSelect.dispatchEvent(event);
            for (let i = 0; i < this.defaultSelect.options.length; i++) {
                if (options[i].value === value) {
                    this.defaultSelect.selectedIndex = i;
                }
            }
        }
    }

    customElements.define("custom-select", CustomSelect);

    const timerSelectors = {
        days: "#timer-days",
        hours: "#timer-hours",
        minutes: "#timer-minutes",
        seconds: "#timer-seconds",
    };

    class CustomTimer extends HTMLElement {
        constructor() {
            super();
            this.daysInMs = 1000 * 60 * 60 * 24;
            this.hoursInMs = this.daysInMs / 24;
            this.minutesInMs = this.hoursInMs / 60;
            this.secondsInMs = this.minutesInMs / 60;
            this.time = new Time();
        }

        connectedCallback() {
            this.init();
            this.setEndDate();

            this.interval = setInterval(this.updateTime.bind(this), 1000);
        }
        init() {
            this.daysElement = this.querySelector(timerSelectors.days);
            this.hoursElement = this.querySelector(timerSelectors.hours);
            this.minutesElement = this.querySelector(timerSelectors.minutes);
            this.secondsElement = this.querySelector(timerSelectors.seconds);

            this.endDay = this.getAttribute("data-day").toLowerCase();
            this.endTime = this.getAttribute("data-time");
        }

        setEndDate() {
            this.endDate = this.time.getEndDate(this.endDay, this.endTime);
            this.parsedDate = Date.parse(this.endDate);
        }

        convertTime(timeInMs) {
            const days = parseInt(timeInMs / this.daysInMs, 10);
            timeInMs -= days * this.daysInMs;
            const hours = parseInt(timeInMs / this.hoursInMs, 10);
            timeInMs -= hours * this.hoursInMs;
            const minutes = parseInt(timeInMs / this.minutesInMs, 10);
            timeInMs -= minutes * this.minutesInMs;
            const seconds = parseInt(timeInMs / this.secondsInMs, 10);

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            };
        }

        formatDigits(number) {
            if (number < 10 && number !== 0) number = "0" + number;
            return number;
        }

        render(time) {
            this.daysElement.textContent = time.days;
            this.hoursElement.textContent = time.hours;
            this.minutesElement.textContent = time.minutes;
            this.secondsElement.textContent = time.seconds;
        }

        updateTime() {
            const currentDate = Date.now();
            const timeDiff = this.parsedDate - currentDate;

            if (timeDiff <= 0) {
                this.setEndDate();
                return;
            }

            const remainingTime = this.convertTime(timeDiff);

            this.render(remainingTime);
        }
    }
    customElements.define("custom-timer", CustomTimer);

    const customSpoilerSelectors = {
        spoilerHeading: ".custom-spoiler__heading",
        spoilerContent: ".custom-spoiler__content",
        spoilerText: ".custom-spoiler__text",
    };

    class CustomSpoiler extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.init();
            this.content.style.height = 0;
        }
        init() {
            this.content = this.querySelector(customSpoilerSelectors.spoilerContent);
            this.spoilerText = this.querySelector(customSpoilerSelectors.spoilerText);

            this.contentPadding = this.getAttribute("data-content-padding");

            this.addEventListener("click", this.spoilerHandle.bind(this));
        }
        spoilerHandle() {
            this.classList.toggle("_opened");
            this.changeSpoilerHeight();
        }

        changeSpoilerHeight() {
            let contentHeight = this.content.scrollHeight;
            contentHeight += parseInt(this.contentPadding * 2);

            if (this.classList.contains("_opened")) {
                this.content.style.paddingTop = this.contentPadding + "px";
                this.content.style.paddingBottom = this.contentPadding + "px";
                this.content.style.height = contentHeight + "px";
            } else {
                this.content.style.paddingTop = 0;
                this.content.style.paddingBottom = 0;
                this.content.style.height = 0;
            }
        }
    }

    customElements.define("custom-spoiler", CustomSpoiler);

    const disableDoubleTouchZoom = () => {
        let lastTouchEnd = 0;

        document.addEventListener(
            "touchend",
            function (event) {
                const now = new Date().getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            },
            false
        );
    };

    disableDoubleTouchZoom();
});
