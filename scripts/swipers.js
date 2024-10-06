class Swipers {
    constructor(swiperEl = "", pagginationEl = "", scrollbarEl = "", navigationEl = {}, others = {}) {
        const stringParams = [swiperEl, pagginationEl, scrollbarEl];
        const objParams = [navigationEl, others];
        
        for (const param of stringParams) {
            if(typeof(param) !== "string") {
                throw new Error("Invalid params")
            }
        }
        for (const param in objParams) {
            if(typeof(param) === "object") {
                throw new Error("Invalid params")
            }
        }

        this.swiperEl = swiperEl;
        this.pagginationEl = pagginationEl;
        this.scrollbarEl = scrollbarEl;
        this.navigationEl = navigationEl;
        this.othersParams = others;
    }
    createSwiper() {
        return new Swiper(this.swiperEl, {    

            loop: typeof(this.othersParams.loop) === "boolean" ? this.othersParams.loop : false,
            infinity: typeof(this.othersParams.infinity) === "boolean" ? this.othersParams.infinity : false,
            slidersPerView: typeof(this.othersParams.slidersPerView) === "number" ? this.othersParams.slidersPerView : 1,
            spaceBetween: typeof(this.othersParams.spaceBetween) === "number"  ? this.othersParams.spaceBetween : 0,

            pagination: this.pagginationEl ? {
                el: this.pagginationEl,
            } : undefined,
      
            navigation: Object.keys(this.navigationEl).length === 2 ? {
                nextEl: this.navigationEl[0],
                prevEl: this.navigationEl[1],
            } : undefined,

            scrollbar: this.scrollbarEl ? {
                el: this.scrollbarEl,
            } : undefined
        });
    }
}


export default Swipers;