export default {
    delay: 2500,
    speed: 900,
    methods: {
        getMaxHeight: (content) => {
            let height = 0;

            for (let i = 0; i < content.length; i++) {
                if (height < content[i].offsetHeight) {
                    height = content[i].offsetHeight;
                }
            }

            return height;
        },
        centerSlides: (swiper) => {
            const swiperWrapper = swiper.slidesEl;
            const slidesLength = swiper.slides.length;
            const currentSlidesPerView = swiper.params.slidesPerView;

            if (slidesLength < currentSlidesPerView) {
                swiperWrapper.style.justifyContent = "center";
            }
        },
    },
};

