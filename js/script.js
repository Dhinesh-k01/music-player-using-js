//let select all query or tag element

const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseButton = wrapper.querySelector(".play-pause"),
    prevButton = wrapper.querySelector("#prev"),
    nextButton = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");

//let's load random music when we refresh page
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling load music function once window loaded
    playingNow();
});

//load music function
function loadMusic(indexNumber) {
    musicName.innerHTML = allMusic[indexNumber - 1].name;
    musicArtist.innerHTML = allMusic[indexNumber - 1].artist;
    musicImg.src = `images/${allMusic[indexNumber - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseButton.querySelector("i").innerHTML = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseButton.querySelector("i").innerHTML = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    //here we will just increment of index by 1
    musicIndex++;
    //musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//prev music function
function prevMusic() {
    //here we will just decrement of index by 1
    musicIndex--;
    //musicIndex is lesser than 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//play or pause music button event
playPauseButton.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call playMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music button event
nextButton.addEventListener("click", () => {
    nextMusic(); //calling next music function
});

prevButton.addEventListener("click", () => {
    prevMusic(); //calling next music function
});

//update progress bar with according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting current time of the song
    const duration = e.target.duration; //getting total current duration of the song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerHTML = `${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        //adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});

//lets update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthValue = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offsset x value
    let songDuration = mainAudio.duration; //getting song total value

    mainAudio.currentTime = (clickedOffSetX / progressWidthValue) * songDuration;
    playMusic();
});

//lets work o repeat, shuffle song according to the icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": //if this is repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": //if icon icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": //if icon icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

//above we just change the icon, now let's work on what to do
//after the song ended

mainAudio.addEventListener("ended", () => {
    // we'll do according to the icon means if the user has set icon to loop the song then we'll repeat
    // the current song and will do further accordingly

    let getText = repeatBtn.innerText; //getting innerText of icon
    switch (getText) {
        case "repeat": //if this is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": //if icon icon is shuffle then change it to repeat
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            } while (musicIndex == randomIndex); //this loop run until the next random number won't be the samw of current music index
            musicIndex = randomIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); //calling loadMusic function
            playMusic(); //calling playMusic function
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//let's create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array to li
    let liTag = `
            <li li-index="${i + 1}">
            <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src
        }.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3.40</span>
            </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerHTML = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //let's remove playing class from all other li expect the last one which is close
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            //let's get that audio duration value and pass to .audio-duraiton innerhtml
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerHTML = adDuration; //passing t-duration value to audio value to audion duration innerText
        }
        //if there is an li tag which li-index is equal to musicIndex
        //then this music is playing now wand we'll style it

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerHTML = "Playing";
        }
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

//let's play the song on li click
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liInde to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
