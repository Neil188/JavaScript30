
const compass = document.querySelector('.compass');
const arrow = document.querySelector('.arrow');
const displaySpeed = document.querySelector('.speed-value');
const locationText = document.querySelector('.location-details');

const handleWatchPosition = ({
    coords : { speed, heading, latitude, longitude },
} ) => {
    compass.classList.remove('hide');
    document.querySelector('.loading').classList.add('hide');
    if (!speed && !heading) {
        compass.textContent =
            'Sorry, heading and speed are not available on this device'
    } else {
        displaySpeed.textContent = speed;
        arrow.style.transform = `rotate(${heading}deg)`;
    }
    locationText.textContent =
            `Latitude is ${latitude}° <br>Longitude is ${longitude}°`;
    const img = new Image();
    img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=300x300&sensor=false&key=AIzaSyCG2rERGcV3GqJPntdoCJgoOgKYQuPKeyI`;

    locationText.appendChild(img);
};

const handleFail = error =>
    document.querySelector('.loading').textContent =
        `Sorry, something went wrong: ${error.code} ${error.message}`;

navigator.geolocation.watchPosition(handleWatchPosition, handleFail);
