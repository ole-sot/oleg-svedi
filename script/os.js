/*Player*/

const audio = document.querySelector('audio');
const playBtn = document.querySelector('.play-pause');
const btnPrev = document.querySelector('.previous-song');
const btnNext = document.querySelector('.next-song');
const artistName = document.querySelector('.artist-name');
const songName = document.querySelector('.song-name');
const cover = document.querySelector('.album-cover');
const slider = document.querySelector('#line-for-time');
const thumb = document.querySelector('.slider-thumb');
const progress = document.querySelector('.progress');
const faderLine = document.querySelector('#line-for-fader');
const faderKnob = document.querySelector('.fader-knob');
const timecode = document.querySelector('.timecode');

const timeline = document.querySelector('#player-timeline');


let trackPlaying = false;
let volumeMuted = false;
let trackID = 0;

/*Data*/
const audioFiles = [
    './audio/indie/01_leto.mp3',
    './audio/indie/02_rap.mp3',
    './audio/indie/03_toxic.mp3',
];
const tracks = [
    'Лето',
    'Рэп',
    'Токсик',
];
const artists = [
    'Телескоп',
    'Телескоп',
    'Телескоп',
];
const covers = [
    './img/album-covers/cover-1.png',
    './img/album-covers/cover-1.png',
    './img/album-covers/cover-1.png',
];


function moveTimelineProgress() {
    const timelineVal = timeline.value;

    timeline.style.background = `linear-gradient(to right, var(--accent-samall-tr) ${timelineVal}%, var(--_track-color) ${timelineVal}%)`;
}

moveTimelineProgress();


playBtn.addEventListener('click', playTrack);

function playTrack() {
    if (trackPlaying === false) {
        audio.play();
        playBtn.innerHTML = `
        <span class="material-symbols-outlined">
            pause
        </span>
        `;
        trackPlaying = true;
    } else {
        audio.pause();
        playBtn.innerHTML = `
        <span class="material-symbols-outlined">
            play_arrow
        </span>
        `;
        trackPlaying = false;
    };
}

function switchTrack() {
    if (trackPlaying === true) {
        audio.play();
    };
}

const trackSrc = audioFiles[trackID];

function loadTrack() {
    audio.src = audioFiles[trackID];

    audio.load();

    artistName.innerHTML = artists[trackID];
    songName.innerHTML = tracks[trackID];
    cover.src = covers[trackID];
    progress.style.width = 0;
    thumb.style.left = 0;
}

audio.addEventListener('loadeddata', () => {
    // Set max value to slider
    slider.setAttribute('max', audio.duration);
});

loadTrack();

btnPrev.addEventListener('click', () => {
    trackID--;

    if (trackID < 0) {
        trackID = audioFiles.length - 1;
    };

    loadTrack();
    switchTrack();
});

function nextTrack() {
    trackID++;

    if (trackID > audioFiles.length - 1) {
        trackID = 0;
    };

    loadTrack();
    switchTrack();
}

btnNext.addEventListener('click', nextTrack);

audio.addEventListener('ended', nextTrack);

function setTime(output, input) {
    const min = Math.floor(input / 60);
    const sec = Math.floor(input % 60);

    if (sec < 10) {
        output.innerHTML = min + ':0' + sec;
    } else {
        output.innerHTML = min + ':' + sec;
    };
}

// setTime(fullTime, audio.duration);

audio.addEventListener('timeupdate', () => {
    const currentAudioTime = Math.floor(audio.currentTime);
    const timePercentage = (currentAudioTime / audio.duration) * 100 + '%';

    setTime(timecode, currentAudioTime);

    progress.style.width = timePercentage;
    thumb.style.left = timePercentage;
});

function handleSlider() {
    const val = (slider.value / audio.duration) * 100 + '%';

    progress.style.width = val;
    thumb.style.left = val;

    setTime(timecode, slider.value);

    audio.currentTime = slider.value;
}

handleSlider();

slider.addEventListener('input', handleSlider);

let volVal;

function respondToFader() {
    // const volumeValue = (fader.style.bottom.replace('%', '0') / 10) / 50;
    // audio.volume = volumeValue;
    const maxVal = faderLine.getAttribute('max');

    volVal = (faderLine.value / maxVal) * 100 + '%';

    faderKnob.style.bottom = volVal;

    audio.volume = faderLine.value / 100;
}

respondToFader();

faderLine.addEventListener('input', respondToFader);