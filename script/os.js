/*** Player ***/

const audio = document.querySelector('audio');
const playBtn = document.querySelector('.play-pause');
const btnPrev = document.querySelector('.previous-song');
const btnNext = document.querySelector('.next-song');
const artistName = document.querySelector('.artist-name');
const songName = document.querySelector('.song-name');
const cover = document.querySelector('.album-cover');
const timecode = document.querySelector('.timecode');
const volumeFader = document.querySelector('#volume-fader');
const timeline = document.querySelector('#player-timeline');

const genreBtns = document.querySelectorAll('.genre-selector button');

let trackPlaying = false;
let trackID = 0;
let isToggled = true;


/* --- Data --- */

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

/* ------------ */


function clearActive() {
    genreBtns.forEach(btn => {
        if (btn.classList.contains('active') === true) {
            btn.classList.remove('active');
        };
    });
}

function genreToggle() {
    if (this.classList.contains('active') === false) {
        clearActive();
        this.classList.toggle('active');
        // Change playlist
    };
}

genreBtns.forEach(btn => btn.addEventListener('click', genreToggle));

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
    timeline.value = 0;
}

audio.addEventListener('loadeddata', () => {
    timeline.setAttribute('max', audio.duration);
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

function moveTimelineProgress() {
    if (audio.currentTime > 0) {
        const currentAudioTime = Math.floor(audio.currentTime);
        const timePercentage = (currentAudioTime / audio.duration) * 100 + '%';
    
        timeline.style.background = `linear-gradient(to right, var(--accent-samall-tr) ${timePercentage}, var(--_track-color) ${timePercentage})`;
    } else {
        timeline.style.background = 'var(--_track-color)';
    };
}

moveTimelineProgress();

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
    timeline.value = audio.currentTime;
    moveTimelineProgress();
});

function handleSlider() {
    setTime(timecode, timeline.value);
    audio.currentTime = timeline.value;
}

handleSlider();

timeline.addEventListener('input', handleSlider);

let volVal;

function respondToFader() {
    const maxVal = volumeFader.getAttribute('max');

    volVal = (volumeFader.value / maxVal) * 100 + '%';
    audio.volume = volumeFader.value / 100;
}

respondToFader();

volumeFader.addEventListener('input', respondToFader);