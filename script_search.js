
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


const songPlayer = new Audio();
slider.value = "0"
slider.addEventListener("oninput", () => {
    songPlayer.currentTime = slider.value
})

const setPlayer = (name, image, link, artists, copyright) => {
    blurred_results.classList.add("hidden");
    player.classList.remove("hidden")
    player.scrollIntoView(true);
    songName.innerHTML = name
    thumbnail.src = image
    artists_marquee.innerHTML = artists
    copyrights_label.innerHTML = copyright

    songPlayer.src = link
    songPlayer.load();


    songPlayer.addEventListener("loadeddata", () => {
        let duration = songPlayer.duration;
        // convert float to int

        let duration_mins = (Math.floor(duration / 60)).toString() + ":" + (Math.floor(duration % 60)).toString()
        console.log(duration_mins)
        endTime.innerHTML = duration_mins

        setInterval(() => {
            let currentTime = songPlayer.currentTime;
            let progress = currentTime / duration;
            progress = Math.round(progress * 100);
            progress = progress.toString();
            slider.value = progress
        }, 1000)



        songPlayer.currentTime = 0;
        songPlayer.play();
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
        songPlayer.addEventListener("ended", () => {
            songPlayer.pause();
        })

        downloadBtn.addEventListener("click", () => {
            downloadSong(link)
            alert("This song is being downloaded!")
        });
    })

}
searchBtn.addEventListener("click", search)
controlBtn.addEventListener("click", () => {
    if (songPlayer.paused) songPlayer.play();
    else songPlayer.pause();
})
