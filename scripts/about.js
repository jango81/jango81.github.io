document.addEventListener("DOMContentLoaded", () => {
    const customQuoteSelectors = {
        quotes: ".about-quote__quotes",
        textBlock: ".about-quote__text",
        icon: ".about-quote__icon",
    };
    class CustomQuote extends HTMLElement {
        constructor() {
            super();
            this.map = new Map();
        }

        connectedCallback() {
            this.init();
            this.initMap();
            this.setActive();
            this.setWrapperHeight();
            this.interval = setInterval(this.changeQuotes.bind(this), 5000);
        }

        init() {
            this.icons = this.querySelectorAll(customQuoteSelectors.icon);
            this.quotes = this.querySelectorAll(customQuoteSelectors.textBlock);
            this.quotesBlock = this.querySelector(customQuoteSelectors.quotes);

            this.icons.forEach((el) => el.addEventListener("click", this.changeQuotes.bind(this)));

            this.activeQuote = this.icons[0];
        }

        setWrapperHeight() {
            const quotesArray = Array.from(this.quotes);
            const num = quotesArray.map((el) => el.scrollHeight);
            let height = Math.max(...num);

            this.quotesBlock.style.minHeight = height + "px";
        }

        changeQuotes() {
            clearInterval(this.interval);

            this.activeQuote.classList.remove("_active");
            this.map.get(this.activeQuote).classList.remove("_active");

            for (const [key, value] of this.map) {
                if (key !== this.activeQuote) {
                    this.activeQuote = key;
                    break;
                }
            }
            this.setActive();

            this.interval = setInterval(this.changeQuotes.bind(this), 5000);
        }
        setActive() {
            this.map.forEach((value, key) => {
                if (key === this.activeQuote) {
                    value.classList.add("_active");
                    key.classList.add("_active");
                }
            });
        }
        initMap() {
            for (let i = 0; i < this.icons.length; i++) {
                this.map.set(this.icons[i], this.quotes[i]);
            }
        }
    }
    customElements.define("custom-quote", CustomQuote);
});
