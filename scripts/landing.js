import swipersSettings from "./swiperSettings.js";


document.addEventListener("DOMContentLoaded", () => {
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
            init: (swiper) => {},
        },
    });
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
                swiper.el.style.height = swipersSettings.methods.getMaxHeight(slideContents) + "px";
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
                swipersSettings.methods.centerSlides(swiper);
                reviewSwiperSetBreakpoints(swiper);
            },
            resize: (swiper) => {
                swipersSettings.methods.centerSlides(swiper);
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
            this.productButtons = this.querySelectorAll(`.${customOrderSelectors.productButton}`);
            this.infoContent = this.querySelector(`.${customOrderSelectors.orderInfoContent}`);
            this.orderButtons = this.querySelector(`.${customOrderSelectors.orderButtons}`);
            this.orderDuration = this.querySelector(`.${customOrderSelectors.orderDuration}`);
            this.productButtons.forEach((e) => {
                e.addEventListener("click", this.productButtonHandle.bind(this));
            });
        }

        connectedCallback() {
            //this.setButtonsMargin();
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
});