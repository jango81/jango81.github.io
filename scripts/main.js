document.addEventListener("DOMContentLoaded", () => {
    const getMaxHeight = (content) => {
        let height = 0;
        console.log(content);

        for (let i = 0; i < content.length; i++) {
            if (height < content[i].offsetHeight) {
                height = content[i].offsetHeight;
            }
            console.log(height);
        }

        return height;
    };

    const centerSlides = (swiper) => {
        const swiperWrapper = swiper.slidesEl;
        const slidesLength = swiper.slides.length;
        const currentSlidesPerView = swiper.params.slidesPerView;

        if (slidesLength < currentSlidesPerView) {
            swiperWrapper.style.justifyContent = "center";
        }
    };

    const swipersSettings = {
        delay: 2500,
        speed: 900,
    };

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
        navRow: "navigation__row",
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
            this.navRow = [...this.querySelectorAll(`.${headerSelectors.navRow}`)];
        }
        connectedCallback() {
            this.init();
        }

        init() {
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
            const target = event.currentTarget;
            const parent = target.closest(`.${headerSelectors.menuItem}`);
            const subMenu = this.checkSubmenu(parent);

            if (subMenu) {
                subMenu.classList.toggle("_active");
                this.changeHeight(subMenu);
            }

            target.classList.toggle("_active");
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

    const customOrderSelectors = {
        productButton: "order-products__product",
        orderSpoiler: "infos-order__spoiler",
        orderInfoHeading: "infos-order__heading",
        orderInfoContent: "infos-order__content",
        orderButtons: "order__buttons",
        orderBlock: "order-block",
        orderDuration: "order__duration",
    };

    class CustomOrder extends HTMLElement {
        constructor() {
            super();
            this.spoilers = this.querySelectorAll(`.${customOrderSelectors.orderSpoiler}`);
            this.productButtons = this.querySelectorAll(`.${customOrderSelectors.productButton}`);
            this.infoContent = this.querySelector(`.${customOrderSelectors.orderInfoContent}`);
            this.orderButtons = this.querySelector(`.${customOrderSelectors.orderButtons}`);
            this.orderDuration = this.querySelector(`.${customOrderSelectors.orderDuration}`);

            this.spoilers.forEach((e) => {
                e.querySelector(`.${customOrderSelectors.orderInfoHeading}`).addEventListener("click", this.spoilerHandle.bind(this));
            });
            this.productButtons.forEach((e) => {
                e.addEventListener("click", this.productButtonHandle.bind(this));
            });
        }

        connectedCallback() {
            //this.setButtonsMargin();
        }

        spoilerHandle(event) {
            const target = event.currentTarget;
            const parent = target.parentElement;

            parent.classList.toggle("_opened");
            this.setSpoilerContentHeight(parent);
        }

        setSpoilerContentHeight(parent) {
            const contentElem = parent.querySelector(`.${customOrderSelectors.orderInfoContent}`);
            if (parent.classList.contains("_opened")) {
                const height = contentElem.scrollHeight;
                contentElem.style.height = `${height}px`;
                contentElem.style.opacity = 1;
            } else {
                contentElem.style.height = "0px";
                contentElem.style.opacity = 0;
            }
        }

        productButtonHandle(e) {
            const target = e.currentTarget;
            this.productButtons.forEach((e) => {
                e.classList.remove("_active");
            });

            target.classList.add("_active");
        }

        setButtonsMargin() {
            const orderDurationMargin = parseInt(window.getComputedStyle(this.orderDuration).marginTop);
            const orderBlockHeight = this.orderDuration.offsetHeight + orderDurationMargin;
            const orderButtonsHeight = this.orderButtons.offsetHeight;

            console.log(orderDurationMargin);

            console.log("block height: " + orderBlockHeight);
            console.log("buttons height: " + orderButtonsHeight);

            const margin = orderBlockHeight - orderButtonsHeight;

            this.orderButtons.style.marginTop = margin + "px";
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
            const selectValueHeight = this.customSelectValue.offsetHeight;
            const selectValueOptions = this.customSelectOptions.scrollHeight;
            this.customSelectOptions.style.height = "0px";
            setTimeout(() => {
                this.customSelectOptions.style.height = `${selectValueOptions + selectValueHeight}px`;
                this.customSelectOptions.style.paddingTop = `${selectValueHeight}px`;
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
        }

        deleteRadio(element) {
            let currentRadio = element;
            let radioName = currentRadio.getAttribute("data-radio");

            if (this.radios.has(radioName)) {
                const radioElements = this.radios.get(radioName);
                let changedArray = radioElements.filter((el) => el !== currentRadio);
                this.radios.set(radioName, changedArray);
            }

            this.checkForGroup(radioName);
        }

        checkForGroup(key) {
            if (this.radios.has(key)) {
                const radioElements = this.radios.get(key);
                const radioElementsLength = radioElements.length;
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

            if (clickedRadio.classList.contains("_checked")) return;

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

    const timerSelectors = {
        days: "#timer-days",
        hours: "#timer-hours",
        minutes: "#timer-minutes",
        seconds: "#timer-seconds",
    };

    class CustomTimer extends HTMLElement {
        constructor() {
            super();
            this.daysElement = this.querySelector(timerSelectors.days);
            this.hoursElement = this.querySelector(timerSelectors.hours);
            this.minutesElement = this.querySelector(timerSelectors.minutes);
            this.secondsElement = this.querySelector(timerSelectors.seconds);

            this.endDay = this.getAttribute("data-day").toLowerCase();
            this.endTime = this.getAttribute("data-time");

            this.daysInMs = 1000 * 60 * 60 * 24;
            this.hoursInMs = this.daysInMs / 24;
            this.minutesInMs = this.hoursInMs / 60;
            this.secondsInMs = this.minutesInMs / 60;
        }

        connectedCallback() {
            this.calcEndDate();

            this.interval = setInterval(this.updateTime.bind(this), 1000);
        }

        calcEndDate() {
            const week = {
                "sunnuntai": 0,
                "maanantai": 1,
                "tiistai": 2,
                "keskiviikko": 3,
                "torstai": 4,
                "perjantai": 5,
                "lauatai": 6,
            };

            const [hours, minutes] = this.endTime.split(":").map(Number);
            const currentDate = new Date();
            const currentDay = currentDate.getDay();
            const deliveryDay = week[this.endDay];

            const nextDeliveryDate = new Date(currentDate);
            nextDeliveryDate.setHours(hours);
            nextDeliveryDate.setMinutes(minutes);
            nextDeliveryDate.setSeconds(0);
            nextDeliveryDate.setMilliseconds(0);

            let daysRemaining;

            if (currentDay < deliveryDay) {
                daysRemaining = deliveryDay - currentDay;
            } else if (currentDay === deliveryDay) {
                if (currentDate > nextDeliveryDate) {
                    daysRemaining = 7;
                } else {
                    daysRemaining = 0;
                }
            } else {
                daysRemaining = 7 - (currentDay - deliveryDay);
            }

            nextDeliveryDate.setDate(currentDate.getDate() + daysRemaining);

            this.endDate = Date.parse(nextDeliveryDate);
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
            const timeDiff = this.endDate - currentDate;

            if (timeDiff <= 0) {
                this.calcNextDate();

                return;
            }

            const remainingTime = this.convertTime(timeDiff);

            this.render(remainingTime);
        }
    }

    customElements.define("custom-timer", CustomTimer);

    const stepsSwiper = new Swiper(".steps-swiper", {
        direction: "vertical",
        spaceBetween: 50,
        speed: swipersSettings.speed,
        threshold: 0,
        touchReleaseOnEdges: true,
        autoplay: {
            delay: swipersSettings.delay,
        },
        on: {
            init: (swiper) => {
                const slideContents = document.querySelectorAll(".steps-slide__content");
                swiper.el.style.height = getMaxHeight(slideContents) + "px";
            },
        },
    });

    const stepsSelectors = {
        stepsPoint: "steps__point",
        slides: "steps-slide",
        slideContent: "steps-slide__content",
    };

    class CustomSteps extends HTMLElement {
        constructor() {
            super();
            this.slides = this.querySelectorAll(`.${stepsSelectors.slides}`);
            this.slideContents = this.querySelectorAll(`.${stepsSelectors.slideContent}`);
            this.stepsPoints = this.querySelectorAll(`.${stepsSelectors.stepsPoint}`);
            this.activeSlide = stepsSwiper.realIndex;
            this.activePoints = new Set();
        }

        connectedCallback() {
            this.addProgress();
            stepsSwiper.on("realIndexChange", () => {
                let oldSlideIndex = this.activeSlide;
                this.activeSlide = stepsSwiper.realIndex;

                if (oldSlideIndex < this.activeSlide) {
                    this.addProgress();
                } else {
                    this.removeProgress();
                }
            });
        }

        addProgress() {
            for (let i = 0; i <= this.activeSlide; i++) {
                this.stepsPoints[i].classList.add("_scrolled");
                if (this.activeSlide > 0 && i > 0) {
                    this.stepsPoints[i - 1].classList.add("_active");
                }
            }
        }

        removeProgress() {
            for (let i = this.activeSlide; i < this.stepsPoints.length; i++) {
                this.stepsPoints[i].classList.remove("_active");
                if (i !== this.activeSlide) {
                    this.stepsPoints[i].classList.remove("_scrolled");
                }
            }
        }
        setSlidesHeight() {}
    }

    customElements.define("custom-steps", CustomSteps);

    const reviewsSelectors = {
        reviewsSlide: "reviews-slide",
        reviewText: "reviews-slide__text",
    };

    class CustomReviews extends HTMLElement {
        constructor() {
            super();

            this.reviewsSlide = this.querySelectorAll(`.${reviewsSelectors.reviewsSlide}`);
            this.reviewText = this.querySelectorAll(`.${reviewsSelectors.reviewText}`);
            this.reviewsSlide.forEach((el) => el.addEventListener("click", this.reviewsClickHandle.bind(this)));
        }

        connectedCallback() {
            this.init();
        }
        init() {
            this.reviewsSlide.forEach((el) => {
                const textElem = el.querySelector(`.${reviewsSelectors.reviewText}`);
                const textLineHeight = window.getComputedStyle(textElem).lineHeight;
                const rows = textElem.scrollHeight / parseInt(textLineHeight);

                if (rows >= 5) {
                    el.classList.add("_collapsed");
                }
            });
        }
        reviewsClickHandle(event) {
            const target = event.currentTarget;

            if (!target.classList.contains("_collapsed")) return;

            this.closeAllReviews(target);
            target.classList.toggle("_opened");

            this.setTextHeight(target);
        }

        closeAllReviews(target) {
            this.reviewsSlide.forEach((el) => {
                const textElem = el.querySelector(`.${reviewsSelectors.reviewText}`);
                if (el !== target) {
                    el.classList.remove("_opened");
                    textElem.style.height = this.getAttribute("data-text-initial-height");
                }
            });
        }

        setTextHeight(target) {
            const textElem = target.querySelector(`.${reviewsSelectors.reviewText}`);
            if (target.classList.contains("_opened")) {
                this.initialTextHeight = window.getComputedStyle(textElem).height;
                textElem.setAttribute("data-initial-height", this.initialTextHeight);
                const textFullHeight = textElem.scrollHeight;

                textElem.style.height = textFullHeight + "px";
            } else {
                textElem.style.height = this.getAttribute("data-text-initial-height");
            }
        }
    }

    customElements.define("custom-reviews", CustomReviews);

    class CustomBanner extends HTMLElement {
        constructor() {
            super();
        }
    }

    customElements.define("custom-banner", CustomBanner);

    const customMenuSelectors = {
        dayCard: "day-card",
        mealPopup: "popup-meal",
        timeOfDay: "day-card-meal",
        productProperities: "day-card-properties",
        productImage: "day-card-image",
        productName: "day-card-meal-name",
        menuSticky: "menu__sticky",
    };

    class CustomMenu extends HTMLElement {
        constructor() {
            super();

            this.dayCard = this.querySelectorAll(`.${customMenuSelectors.dayCard}`);
            this.mealPopup = this.querySelector(`.${customMenuSelectors.mealPopup}`);
            this.menuSticky = this.querySelector(`.${customMenuSelectors.menuSticky}`);
            this.header = document.querySelector(".header");
            this.currentMealData = {};

            this.dayCard.forEach((el) => el.addEventListener("click", this.popupHandle.bind(this)));
            this.mealPopup.addEventListener("click", this.popupHandle.bind(this));
        }

        connectedCallback() {
            this.mealPopup.style.visibility = "hidden";
            this.menuSticky.style.top = this.header.offsetHeight + "px";
        }
        popupHandle(e) {
            const isDayCardClicked = e.currentTarget === this.mealPopup.querySelector(`.${customMenuSelectors.dayCard}`);
            if (isDayCardClicked) {
                this.closePopup();
            }
            if (this.mealPopup.classList.contains("_active") && !isDayCardClicked) {
                this.closePopup();
            } else {
                this.showPopup();
            }
        }
        showPopup() {
            this.mealPopup.classList.add("_active");
            this.mealPopup.style.visibility = "visible";
        }
        closePopup() {
            const popupCard = this.mealPopup.querySelector(`.${customMenuSelectors.dayCard}`);
            this.mealPopup.classList.remove("_active");
            popupCard.addEventListener(
                "transitionend",
                () => {
                    this.mealPopup.style.visibility = "hidden";
                },
                { once: true }
            );
        }
    }

    customElements.define("custom-menu", CustomMenu);

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

    const reviewSwiperSetBreakpoints = (swiper) => {
        const slidesLength = swiper.slides.length;

        swiper.params.breakpoints = {
            620: {
                slidesPerView: slidesLength > 2 ? 2 : slidesLength,
                slidesPerGroup: slidesLength > 2 ? 2 : slidesLength,
            },
            990: {
                slidesPerView: slidesLength > 3 ? 3 : slidesLength,
                slidesPerGroup: slidesLength > 2 ? 2 : slidesLength,
            },
            1260: {
                slidesPerView: slidesLength > 4 ? 4 : slidesLength,
                slidesPerGroup: slidesLength > 2 ? 2 : slidesLength,
            },
        };

        swiper.update();
    };

    const infoSwiper = new Swiper(".info-swiper", {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 20,
        speed: swipersSettings.speed,
        pagination: {
            el: ".info-swiper__pagination",
        },
    });
    const mealsSwiper = new Swiper(".meals-swiper", {
        loop: false,
        speed: swipersSettings.speed,
        breakpoints: {
            550: {
                slidesPerView: 2,
            },
            980: {
                slidesPerView: 3,
            },
            1080: {
                navigation: {
                    enabled: true,
                    prevEl: ".meals-swiper-prev",
                    nextEl: ".meals-swiper-next",
                },
                slidesPerView: 3,
            },
            1340: {
                slidesPerView: 4,
            },
        },
        pagination: {
            el: ".meals-swiper__pagination",
        },
        navigation: {
            enabled: false,
        },
        on: {
            init: (swiper) => {
                const content = swiper.el.querySelectorAll(".meals-slide__content");
                swiper.slides.forEach((el) => (el.style.height = getMaxHeight(content) + "px"));
            },
        },
    });
    const whySwiper = new Swiper(".why-swiper", {
        spaceBetween: 20,
        slidesPerView: 1,
        speed: swipersSettings.speed,
        loop: true,
        autoplay: {
            delay: swipersSettings.delay,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            590: {
                slidesPerView: 2,
            },
            1280: {
                slidesPerView: 4,
            },
        },
        on: {
            init: (swiper) => {},
        },
    });
    const reviewsSwiper = new Swiper(".reviews-swiper", {
        spaceBetween: 20,
        speed: swipersSettings.speed,
        loop: true,
        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            1080: {
                navigation: {
                    enabled: true,
                    prevEl: ".reviews-swiper-prev",
                    nextEl: ".reviews-swiper-next",
                },
            },
        },
        navigation: {
            enabled: false,
        },
        pagination: {
            el: ".swiper-pagination",
        },
        on: {
            init: (swiper) => {
                centerSlides(swiper);
                reviewSwiperSetBreakpoints(swiper);
            },
            resize: (swiper) => {
                centerSlides(swiper);
                reviewSwiperSetBreakpoints(swiper);
            },
        },
    });
    const bannerSwiper = new Swiper(".banner-swiper", {
        slidesPerView: 1,
        effect: "fade",
        speed: 600,
        autoplay: {
            delay: swipersSettings.delay,
        },
    });
    const cooperationSwiper = new Swiper(".cooperation-swiper", {
        slidesPerView: "auto",
        spaceBetween: 100,
        loop: true,
        autoplay: {
            enabled: true,
            delay: swipersSettings.delay,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            520: {
                slidesPerView: 2,
            },
            630: {
                slidesPerView: 3,
            },
            1040: {
                slidesPerView: 4,
            },
        },
        speed: swipersSettings.speed,
    });
    const dayMenuSwiper = new Swiper(".day-swiper", {
        slidesPerView: "auto",
        pagination: {
            el: ".swiper-pagination",
        },
        breakpoints: {
            730: {
                slidesPerView: 2,
            },
            1100: {
                slidesPerView: 3,
            },
            1580: {
                slidesPerView: 4,
            },
        },

        on: {
            init: (swiper) => {
                centerSlides(swiper);
            },
        },
    });
    window.addEventListener("resize", () => {
        const meals = document.querySelector(".meals");
        if (meals) {
            meals.addDays();
        }
    });
});
