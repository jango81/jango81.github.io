

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

    const infoSwiper = new Swiper(".info-swiper", {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 20,
        pagination: {
            el: ".info-swiper__pagination"
        }
    })
});
