const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const options = document.querySelector('.options');

let opts = {
    face: false,
}

getVideo = () => {
    navigator.mediaDevices.getUserMedia( {video: true, audio:false})
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


paintToCanvas = () => {
    const {videoWidth : width, videoHeight : height} = video;
    // reset canvas size to match video
    [canvas.width, canvas.height] = [width, height];
    return setInterval( () => {
        ctx.drawImage(video, 0, 0, width, height);
        // get the pixels from the image
        let pixels = ctx.getImageData(0, 0, width, height);
        // update pixels
        pixels = opts.redeffect ? redEffect(pixels)
                : opts.rgbsplit ? rgbSplit(pixels)
                : opts.greenscreen ? greenScreen(pixels)
                : pixels;
        // update canvas using new pixels
        ctx.putImageData(pixels, 0, 0);

        // now look for faces
        opts.face && detectFaces();
    }, 16 )
};

redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i+=4) {
        // pixels[i] // r
        // pixels[i+1] // g
        // pixels[i+2] // b
        // pixels[i+3] // a
        pixels.data[i + 0] = pixels.data[i + 0] + 100;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
};

rgbSplit = (pixels) => {
    for (let i = 0; i < pixels.data.length; i+=4) {

        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 400] = pixels.data[i + 1];
        pixels.data[i - 450] = pixels.data[i + 2];
    }
    return pixels;
};

greenScreen = (pixels) => {
    const levels = {};

    document.querySelectorAll('.greenscreen input').forEach((input) => {
      levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out by setting transparency to 0
        pixels.data[i + 3] = 0;
      }
    }

    return pixels;
}

takePhoto = () => {
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


detectFaces = () => {
    // detect all faces on canvas using ccv
    const faces = [...ccv.detect_objects(
        {   "canvas" : (ccv.pre(canvas)), 
            "cascade" : cascade,
            "interval" : 5,
            "min_neighbors": 1
        }
        
    )];

    // draw rectangle around each detected face
    faces.forEach( face => {
        ctx.beginPath();
        ctx.strokeRect(face.x, face.y, face.width, face.height);
        ctx.closePath();
    });
}

const handleOptionsChange = () => {
    opts = { face: options.face.checked };
    const currentEffect = options.effect.value;
    opts[currentEffect] = true;
}

getVideo();
// once video.play is called, and the video is ready the canplay event fires
video.addEventListener('canplay', paintToCanvas);

options.addEventListener('change', handleOptionsChange)
