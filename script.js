const preloadImage = document.createElement("link");
preloadImage.href = "https://javascript30.com/images/JS3-social-share.png";
preloadImage.rel = "preload";
preloadImage.as = "image";
preloadImage.onload = swapImage;
document.head.appendChild(preloadImage);

function swapImage() {
    const banner = document.querySelector('.banner');
    banner.classList.add('loaded');
    banner.classList.remove('initImage');
}
