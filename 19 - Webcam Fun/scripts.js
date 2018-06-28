const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const options = document.querySelector('.options');
const photo = document.querySelector('#photo');

let opts = {
    face: false,
}

const getVideo = () => {
    navigator.mediaDevices.getUserMedia( { video: true, audio:false })
        .then( localMediaStream => {
            // set source to media stream
            video.srcObject = localMediaStream;
            // start showing video
            video.play();
        } )
        .catch(err => {
            console.error(`Oh noes! ${err}`);
        })
};


const redEffect = ( { data } ) => {

    const levels = {};

    document.querySelectorAll('.redeffect input').forEach((input) => {
        levels[input.name] = Number(input.value);
    });

    for (let i = 0; i < data.length; i+=4) {
        // pixels[i] // r
        // pixels[i+1] // g
        // pixels[i+2] // b
        // pixels[i+3] // a
        data[i + 0] = data[i + 0] + levels.red;
        data[i + 1] = data[i + 1] + levels.green;
        data[i + 2] = data[i + 2] + levels.blue;
    }
    return data;
};

const rgbSplit = ( { data } ) => {
    const levels = {};
    const original = [...data];

    document.querySelectorAll('.rgbsplit input').forEach((input) => {
        levels[input.name] = Number(input.value);
    });

    for (let i = 0; i < data.length; i+=4) {
        // shift red
        data[i + levels.red] = original[i + 0];
        // shift green
        data[i + 1 + levels.green] = original[i + 1];
        // shift blue
        data[i + 2 + levels.blue] = original[i + 2];
    }
    return data;
};

const greenScreen = ( { data } ) => {
    const levels = {};

    document.querySelectorAll('.greenscreen input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i + 0];
        const green = data[i + 1];
        const blue = data[i + 2];
        // const alpha = data[i + 3];

        if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out by setting transparency to 0
            data[i + 3] = 0;
        }
    }

    return data;
};

const detectFaces = (source) => {
    // detect all faces on canvas using ccv
    const faces = [...ccv.detectObjects(
        {   "canvas" : (ccv.pre(source)),
            "cascade" : cascade,
            "interval" : 5,
            "minNeighbors": 1,
        }

    )];

    // draw rectangle around each detected face
    faces.forEach( face => {
        ctx.beginPath();
        ctx.strokeRect(face.x, face.y, face.width, face.height);
        ctx.closePath();
    });

}

const paintToCanvas = () => {
    const { videoWidth : width, videoHeight : height } = video;
    // reset canvas size to match video
    [canvas.width, canvas.height] = [width, height];
    const paint = () => {
        ctx.drawImage(video, 0, 0, width, height);
        if ( opts.redeffect || opts.rgbsplit || opts.greenscreen ) {
            // get the pixels from the image
            const pixels = ctx.getImageData(0, 0, width, height);
            // update pixels
            const data = opts.redeffect ? redEffect(pixels)
                : opts.rgbsplit ? rgbSplit(pixels)
                    : opts.greenscreen ? greenScreen(pixels)
                        : pixels.data;

            // create ImageData object
            const imageData = new ImageData( data, width, height );
            // update canvas using new pixels
            ctx.putImageData(imageData, 0, 0);
        }

        // now look for faces
        opts.face && detectFaces(ctx.canvas);

        requestAnimationFrame(paint);
    };

    requestAnimationFrame(paint);
};

const takePhoto = () => {
    // Play sound
    snap.currentTime = 0;
    snap.play();

    // get data out of canvas
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a');
    link.href = data;
    // set download attribute - used as filename for a download
    link.setAttribute('download','weirdo');
    // use image as icon for download link
    link.innerHTML = `<img src="${data}" alt="screenshot"/>`;
    strip.insertBefore(link, strip.firstChild);
}

const handleOptionsChange = () => {
    const controls = document.querySelector('.controls');
    opts = { face: options.face.checked };
    const currentEffect = options.effect.value;
    controls.style.setProperty('--greenscreenDisplay',
        currentEffect === 'greenscreen' ? 'flex' : 'none');
    controls.style.setProperty('--rgbsplitDisplay',
        currentEffect === 'rgbsplit' ? 'flex' : 'none');
    controls.style.setProperty('--redeffectDisplay',
        currentEffect === 'redeffect' ? 'flex' : 'none');
    opts[currentEffect] = true;
}

getVideo();
// once video.play is called, and the video is ready the canplay event fires
video.addEventListener('canplay', paintToCanvas);

options.addEventListener('change', handleOptionsChange);
photo.addEventListener('click', takePhoto);


