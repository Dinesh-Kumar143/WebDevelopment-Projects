async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Project%202%20Spotify%20Clone/src/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split("/songs/")[1]);
        }

    }
    return songs;
}

let currentSong = new Audio();
let songs;

const playMusic = (track, pause = false) => {

    currentSong.src = "src/songs/" + track;
    play.src = "src/images/play.svg"
    if (!pause) {
        currentSong.play()
        play.src = "src/images/pause.svg"
        
    }
    
    

    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "";

}


function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Round down to the nearest whole number

    // Format the minutes and seconds to always have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main() {
    let songs = await getSongs();

    playMusic(songs[0], true);

    songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` <li><img class="invert" src="src/images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Dinesh</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="src/images/play.svg" alt="">
                            </div>
                            </li>`;
    }

    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            play.src = "src/images/play.svg"
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
        })
    })

    // let play = document.querySelector('.songButtons').elemen;
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "src/images/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "src/images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        document.querySelector(".seekbar").addEventListener("click", e => {
            document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
            currentSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * currentSong.duration;

        })
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector(".left").style.left = "-120%";
    })


    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log("Index: " + index)
        if ((index-1) >=0){
            playMusic(songs[index - 1])

        }    })
    next.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log("Index: " + index)
        if ((index+1) <= songs.length-1){
            playMusic(songs[index + 1])

        }
   
    })

    volume.addEventListener("change",(e)=>{
        // console.log(e, e.target, e.target.value)
        if (e.target.value <50 && e.target.value > 0){
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "src/images/halfVolume.svg";
        }
        else if (e.target.value == 0){
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "src/images/mute.svg";
        }
        else{
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "src/images/fullVolume.svg";
        }
        currentSong.volume = parseInt(e.target.value)/100;
    })
}
main();