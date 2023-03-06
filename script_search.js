const search = () => {
    let uri = `https://saavn.me/search/songs?query=${query.value.replaceAll(" ", "+")}&page=1&limit=6`
    fetch(uri)
        .then(response => {
            if (response.status == 404) {
                alert("Sorry, can't find that song!")
            }

            return response.json();
        }
        )
        .then(resp => {
            search_query.innerHTML = query.value
            results.innerHTML = ""
            blurred_results.classList.remove("blur-lg")
            blurred_results.classList.remove("hidden")
            blurred_results.scrollIntoView(true);

            let result = resp.data.results
            for (let song of result) {
                let name = song.name
                let image = song.image[2]["link"]
                let link = song.downloadUrl[4]["link"]
                let artists = song.primaryArtists //seperated by comma
                let copyright = song.copyright
                results.innerHTML += `
                <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div onclick="setPlayer('${name}','${image}', '${link}', '${artists}', '${copyright}')" class="h-full flex items-center border-gray-800 border p-4 rounded-lg hover:cursor-pointer hover:border-green-500 hover:bg-gray-900 hover:ring-2 hover:ring-green-900">
                        <img alt="thumbnail"
                            class="w-20 h-20 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                            src="${image}">
                        <div class="flex-grow">
                            <h2 class="text-white title-font font-medium">${name}</h2>
                            <p class="text-gray-600">${artists}</p>
                        </div>
                    </div>
                </div>`
            }

        })
        .catch(err => {
        });
}
// ---------------------------------------------------------------------------------------- 


// Download Functions 
const downloadBlob = (blob, filename) => {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

const downloadSong = (url) => {
    filename = url.split('\\').pop().split('/').pop().replace(".mp4", ".mp3")
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            downloadBlob(blobUrl, filename);
        })
        .catch(e => console.error(e));
}
// ---------------------------------------------------------------------------------------- 

// Initial Setups 
const songPlayer = new Audio();
slider.value = "0"
// ---------------------------------------------------------------------------------------- 




// Setting up the player UI and starting song
const setPlayer = (name, image, link, artists, copyright) => {
    // Setting the UI items
    blurred_results.classList.add("hidden");
    player.classList.remove("hidden")
    player.scrollIntoView(true);
    songName.innerHTML = name
    thumbnail.src = image
    artists_marquee.innerHTML = artists
    copyrights_label.innerHTML = copyright

    songPlayer.src = link
    songPlayer.load();

    // Download Event 
    downloadBtn.addEventListener("click", () => {
        downloadSong(link)
        alert("This song is being downloaded!")
    });

}
// ---------------------------------------------------------------------------------------- 

// On loaded
songPlayer.addEventListener("loadedmetadata", () => {
    let duration = songPlayer.duration;
    let duration_mins = Math.floor(duration / 60);
    let duration_secs = Math.floor(duration % 60);
    endTime.innerHTML = duration_mins + ":" + (duration_secs < 10 ? "0" : "") + duration_secs;
    unlike()
    songPlayer.play();

})
// ---------------------------------------------------------------------------------------- 

// Seek to the position clicked on the seek bar
slider.addEventListener('input', () => {
    const seekTime = (songPlayer.duration / 100) * slider.value;
    songPlayer.currentTime = seekTime;
});
// ---------------------------------------------------------------------------------------- 


// Auto updating
songPlayer.addEventListener('timeupdate', () => {
    const percentComplete = (songPlayer.currentTime / songPlayer.duration) * 100;
    slider.value = percentComplete;
    const currentMins = Math.floor(songPlayer.currentTime / 60);
    const currentSecs = Math.floor(songPlayer.currentTime % 60);
    currentTime.textContent = `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs}`;
});
// ---------------------------------------------------------------------------------------- 

// On ended
songPlayer.addEventListener('ended', () => {
    songPlayer.currentTime = 0;
    songPlayer.pause();
    slider.value = 0;
});
// ---------------------------------------------------------------------------------------- 


// Control Handlers
controlBtn.addEventListener("click", () => {
    if (songPlayer.paused) songPlayer.play();
    else songPlayer.pause();
})

previous.addEventListener("click", () => {
    songPlayer.currentTime = 0;
    slider.value = 0;
})
next.addEventListener("click", () => {
    songPlayer.currentTime = 0;
    slider.value = 0;
})
// ---------------------------------------------------------------------------------------- 


// Changing Button UI 
songPlayer.addEventListener('play', () => {
    controlBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>`
});
songPlayer.addEventListener('pause', () => {
    controlBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>`
});
// ---------------------------------------------------------------------------------------- 

// Managing Favourites
favBtn.addEventListener("click", () => {
    // if song not in favourites, then:
    favBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
`
})

const like = () => { //take songname
    // add song to localStorage
    favBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
`
}
const unlike = () => {  // Not dislike!!
    // remove song from localStorage
    favBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
`
}

document.getElementById("searchBtn").addEventListener("click", search)

