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
let genre = 'indie';


/* --- Data --- */

const music = {
    indie: {
        audioFiles: [
            './audio/indie/02-felicette-slows_down.mp3',
            './audio/indie/01-moss_cape-prizrak.mp3',
            './audio/indie/03-voodoo-doppelganger.mp3',
        ],
        tracks: [
            'Slows Down',
            'Призрак',
            'Doppelganger',
        ],
        artists: [
            'Felicette',
            'Moss Cape',
            'Вууду',
        ],
        covers: [
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
        ],
    },
    metall: {
        audioFiles: [
            './audio/metall/01-the_revenge-grechka.mp3',
            './audio/metall/02-anchar-cyberninja.mp3',
            './audio/metall/03-lne-zamok.mp3',
        ],
        tracks: [
            'Гречка',
            'Киберниндзя',
            'Замок',
        ],
        artists: [
            'The Revenge',
            'Anchar',
            'Long Night Echoes',
        ],
        covers: [
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
        ],
    },
    noiserock: {
        audioFiles: [
            './audio/noiserock/01-displaced_fuzz-track_4.mp3',
            './audio/noiserock/02-nbs-noiserecsession-track_2.mp3',
            './audio/noiserock/03-nbs-noiserecsession-track_3.mp3',
        ],
        tracks: [
            'Трек 4',
            'Трек 2',
            'Трек 3',
        ],
        artists: [
            'Displaced Fuzz',
            'noisebleedsuns.',
            'noisebleedsuns.',
        ],
        covers: [
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
        ],
    },
    ambient: {
        audioFiles: [
            './audio/ambient/Forlate - Failing Better E1_2 M1_4.wav',
            './audio/ambient/Forlate - The Turning E1_1 M1_4.wav',
            './audio/ambient/Forlate - Rubber E1_5 M1_8.wav',
        ],
        tracks: [
            'Failing Better',
            'The Turning',
            'Rubber',
        ],
        artists: [
            'Forlate',
            'Forlate',
            'Forlate',
        ],
        covers: [
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
            './img/album-covers/cover-1.png',
        ],
    },
};

/* ------------ */


playBtn.addEventListener('click', playTrack);

function playTrack() {
    if (trackPlaying === false) {
        audio.play();
        playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="3" width="7" height="18" fill="black"/>
            <rect x="3" y="3" width="7" height="18" fill="black"/>
        </svg>
        `;
        trackPlaying = true;
    } else {
        audio.pause();
        playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 20V4L20 12L7 20Z" fill="black" stroke="black"/>
        </svg>
        `;
        trackPlaying = false;
    };
}

function switchTrack() {
    if (trackPlaying === true) {
        audio.play();
    };
}

function loadTrack() {
    audio.src = music[genre].audioFiles[trackID];

    audio.load();

    artistName.innerHTML = music[genre].artists[trackID];
    songName.innerHTML = music[genre].tracks[trackID];
    cover.src = music[genre].covers[trackID];
    timeline.value = 0;
}

audio.addEventListener('loadeddata', () => {
    timeline.setAttribute('max', audio.duration);
});

loadTrack();

btnPrev.addEventListener('click', () => {
    trackID--;

    if (trackID < 0) {
        trackID = music[genre].audioFiles.length - 1;
    };

    loadTrack();
    switchTrack();
});

function nextTrack() {
    trackID++;

    if (trackID > music[genre].audioFiles.length - 1) {
        trackID = 0;
    };

    loadTrack();
    switchTrack();
}

btnNext.addEventListener('click', nextTrack);

audio.addEventListener('ended', nextTrack);

function clearActive() {
    genreBtns.forEach(btn => {
        if (btn.classList.contains('active') === true) {
            btn.classList.remove('active');
        };
    });
}

function selectGenre(btn) {
    switch (btn.classList[0]) {
        case 'genre-1':
            genre = 'indie';
            break;
        case 'genre-2':
            genre = 'metall';
            break;
        case 'genre-3':
            genre = 'noiserock';
            break;
        case 'genre-4':
            genre = 'ambient';
            break;
    };
}

function switchGenre() {
    if (this.classList.contains('active') === false) {
        clearActive();
        this.classList.toggle('active');
        selectGenre(this);
        trackID = 0;
        loadTrack();
        switchTrack();
    };
}

genreBtns.forEach(btn => btn.addEventListener('click', switchGenre));

function moveTimelineProgress() {
    if (audio.currentTime > 0) {
        const currentAudioTime = Math.round(audio.currentTime);
        const timePercentage = Math.round((currentAudioTime / audio.duration) * 100) + '%';
    
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

function respondToFader() {
    const maxVal = volumeFader.getAttribute('max');

    audio.volume = volumeFader.value / maxVal;
}

respondToFader();

volumeFader.addEventListener('input', respondToFader);


/*** Hero section ***/

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        };
    });
});

const heroElements = document.querySelectorAll('.hero-section');

heroElements.forEach((el) => observer.observe(el));

function playHeroes(delay = 3000) {
    function addDisplay(el) {
        el.classList.add('display');
    }

    function clearDisplay() {
        heroElements.forEach(el => {
            el.classList.remove('display');
        });
    }
    
    for (let i = 0; i < (heroElements.length); i++) {
        const currEl = heroElements[i];

        setTimeout(clearDisplay, delay * i);
        setTimeout(addDisplay, delay * i, currEl);
    };
}

for (let i = 0; i < 100; i++) {
    const dly = 4000;

    setTimeout(playHeroes, dly * 5 * i, dly);
}
