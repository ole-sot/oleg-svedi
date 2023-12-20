/*Player*/

const audio = document.querySelector('audio');
const playBtn = document.querySelector('.play-pause');
const btnPrev = document.querySelector('.previous-song');
const btnNext = document.querySelector('.next-song');
const artistName = document.querySelector('.artist-name');
const songName = document.querySelector('.song-name');
const cover = document.querySelector('.album-cover');
const fader = document.querySelector('.fader-slider');
const timecode = document.querySelector('.timecode');

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

playBtn.addEventListener('click', playTrack);

function playTrack() {
    if (trackPlaying === false) {
        audio.play();
        trackPlaying = true;
    } else {
        audio.pause();
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
}

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

audio.addEventListener('timeupdate', () => {
    const currentAudioTime = Math.floor(audio.currentTime);
    setTime(timecode, currentAudioTime);
});

let bottomValue;

function moveFader() {
    const volumeValue = (fader.style.bottom.replace('%', '0') / 10) / 50;
    audio.volume = volumeValue;
}