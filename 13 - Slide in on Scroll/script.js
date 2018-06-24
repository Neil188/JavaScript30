const handleScrollEvents = () => {
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return () => {
            const later = () => {
                timeout = null;
                if (!immediate) func();
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func();
        };
    }

    const sliderImages = document.querySelectorAll('.slide-in');

    const checkSlide = () => {
        const {
            scrollY,
            innerHeight,
        } = window;
        const bottomOfScreen = scrollY + innerHeight;
        sliderImages.forEach(({
            height,
            offsetTop,
            classList,
        }) => {
            // slide in when half way down image -
            //    bottom of screen - half image height
            const slideInAt = bottomOfScreen - height / 2;
            // get bottom of image
            const imageBottom = offsetTop + height;
            // is image half shown
            const isHalfShown = slideInAt > offsetTop
            // scrolled past image?
            const isNotScrolledPast = scrollY < imageBottom;

            (isHalfShown && isNotScrolledPast) ?
                classList.add('active'): classList.remove('active');
        })
    };

    window.addEventListener('scroll', debounce(checkSlide));
}

const handleIntersection = () => {

    const sliderImages = document.querySelectorAll('.slide-in');

    const handleIntersect = (entries, observer) => {
        // when 10% or less visible remove active
        // this moves image offscreen once we move away from it
        // could use 0%, but this lets us see it in action on edge of screen
        if (entries[0].intersectionRatio <= 0.1) {
            entries[0].target.classList.remove('active');
        }
        // Once we've reached 50% of target add active class
        if (entries[0].intersectionRatio >= 0.5) {
            entries[0].target.classList.add('active');
        }
    };

    const createObserver = (image) => {
        const options = {
            // watch for changes relative to viewport, so root is null
            root: null,
            // no margin required to offset set to 0px
            rootMargin: "0px",
            // trigger intersections on 10% and 50%
            threshold: [0.1, 0.5],
        }
        const imageObserver = new IntersectionObserver(handleIntersect, options);
        imageObserver.observe(image);
    };

    sliderImages.forEach(createObserver);


}


// Check if IntersectionObserver is supported
if ("IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
    // Use Intersection observer
    handleIntersection()
} else {
    // fallback to scroll events
    handleScrollEvents();
};
