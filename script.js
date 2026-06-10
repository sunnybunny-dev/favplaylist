// Track Asset Database Mapping - Handpicked Favorites Edition
const tracksList = [
    {
        title: "Yellow",
        artist: "Wisp",
        art: "images/wisp.webp",
        url: "audio/wisp.mp3"
    },
    {
        title: "Something About You",
        artist: "Eyedress",
        art: "images/somethingaboutyou.jpg",
        url: "audio/somethingaboutyou.mp3"
        
    },
    {
        title: "Better Things",
        artist: "Aespa",
        art: "images/aespa .jpg",
        url:"audio/aespa.mp3"
        
    },
    {
        title: "Summer Wine",
        artist: "Lana Del Rey",
        art: "images/summer wine.jpg", 
        url:"audio/summerwine.mp3"
       
    },
    {
        title: "Hard to Face Reality",
        artist: "Justin Bieber",
        art: "images/reality.jpg",
        url:"audio/reality.mp3" 
        
    },
    {
        title: "Number One Girl",
        artist: "Rosé",
        art: "images/rose.jpg", 
        url:"audio/no1girl.mp3"
        
    },
    {
        title: "The Night We Met",
        artist: "Lord Huron (feat. Phoebe Bridgers)",
        art: "images/night.jpg",
        url:"audio/night.mp3" 
        
    },
    {
        title: "Midnight Rain",
        artist: "Taylor Swift",
        art: "images/midnightrain.webp",
        url:"audio/midnightrain.mp3"
       
    },
    {
        title: "Bad Idea",
        artist: "Tessa Violet",
        art: "images/badideas.jpg", 
        url: "audio/badidea.mp3"
    },
    {
        title: "POV",
        artist: "Ariana Grande",
        art: "images/pov.jpg", 
        url: "audio/pov.mp3"
    }
];
// Instantiating the native HTML5 Audio Engine Subsystem
const audio = new Audio();
let trackIndex = 0;
let isPlaying = false;

// DOM Selectors Setup
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackArt = document.getElementById('track-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressBar = document.getElementById('progress-bar');
const progressWrapper = document.getElementById('progress-wrapper');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistContainer = document.getElementById('playlist-container'); // <--- Connected Selector

// Initialize first track data runtime mapping
function loadTrack(track) {
    trackTitle.innerText = track.title;
    trackArtist.innerText = track.artist;
    trackArt.src = track.art;
    audio.src = track.url;

    if (typeof updatePlaylistHighlight === "function") {
        updatePlaylistHighlight();
    }
}

// Audio State Controller Hooks
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

// Build the list elements dynamically on startup
function initPlaylist() {
    playlistContainer.innerHTML = '';
    tracksList.forEach((track, index) => {
        const trackRow = document.createElement('div');
        trackRow.classList.add('playlist-item');
        if (index === trackIndex) trackRow.classList.add('active');
        
        trackRow.innerHTML = `
            <img src="${track.art}" alt="${track.title}">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            </div>
        `;
        
        // Let the user click any track row to jump directly to it
        trackRow.addEventListener('click', () => {
            trackIndex = index;
            loadTrack(tracksList[trackIndex]);
            playTrack();
        });
        
        playlistContainer.appendChild(trackRow);
    });
}

// Highlight the currently playing track row smoothly
function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === trackIndex) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

function playTrack() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function prevTrack() {
    trackIndex = (trackIndex - 1 + tracksList.length) % tracksList.length;
    loadTrack(tracksList[trackIndex]);
    if (isPlaying) audio.play();
}

function nextTrack() {
    trackIndex = (trackIndex + 1) % tracksList.length;
    loadTrack(tracksList[trackIndex]);
    if (isPlaying) audio.play();
}

// Asynchronous Time & Duration Synchronization Logic
function updateProgress(e) {
    if (isNaN(audio.duration)) return;
    
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Format timestamps explicitly
    currentTimeEl.innerText = formatTime(currentTime);
    durationTimeEl.innerText = formatTime(duration);
}

function formatTime(time) {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Interactive Seek Mapping Execution
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Passive Event Listeners Setup
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

// HTML5 Event Dispatch Hooks
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack); // Auto-advance state logic
progressWrapper.addEventListener('click', setProgress);

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Primary Entry Point Runtime Call
loadTrack(tracksList[trackIndex]);
initPlaylist(); // <--- Renders the checklist on load
audio.volume = volumeSlider.value;