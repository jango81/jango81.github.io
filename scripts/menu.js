import swipersSettings from "./swiperSettings.js";

document.addEventListener("DOMContentLoaded", () => {
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
                swipersSettings.methods.centerSlides(swiper);
            },
        },
    });
    const customMenuSelectors = {
        dayCard: ".day-card",
        mealPopup: ".popup-meal",
        timeOfDay: ".day-card-meal",
        productProperities: ".day-card-properties",
        productImage: ".day-card-image",
        productName: ".day-card-meal-name",
        menuSticky: ".menu__sticky",
        menuButton: ".menu__button",
    };
    class CustomMenu extends HTMLElement {
        constructor() {
            super();
            this.currentMealData = {};
        }

        connectedCallback() {
            this.init();

            this.mealPopup.style.visibility = "hidden";
            this.menuSticky.style.top = this.header.offsetHeight + "px";
        }
        init() {
            this.mealPopup = this.querySelector(customMenuSelectors.mealPopup);
            this.menuSticky = this.querySelector(customMenuSelectors.menuSticky);
            this.dayCard = this.querySelectorAll(customMenuSelectors.dayCard);
            this.menuButtons = this.querySelectorAll(customMenuSelectors.menuButton);
            this.header = document.querySelector(".header");

            this.menuButtons.forEach((e) => e.addEventListener("click", this.buttonHandle.bind(this)));
            this.dayCard.forEach((el) => el.addEventListener("click", this.popupHandle.bind(this)));
            this.mealPopup.addEventListener("click", this.popupHandle.bind(this));
        }
        buttonHandle(e) {
            
            this.menuButtons.forEach(e => e.classList.remove("_active"))
            e.currentTarget.classList.add("_active");
        }
        popupHandle(e) {
            const isDayCardClicked = e.currentTarget === this.mealPopup.querySelector(customMenuSelectors.dayCard);
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
            const popupCard = this.mealPopup.querySelector(customMenuSelectors.dayCard);
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
});
