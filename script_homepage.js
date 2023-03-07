
const search = () => {
    let uri = "https://saavn.me/modules?language=hindi"
    fetch(uri)
        .then(response => {
            if (response.status == 404) {
                alert("Sorry, looks like something is wrong...")
            }

            return response.json();
        }
        )
        .then(resp => {
            let albums = resp["data"]["trending"]["albums"]
            let songs = resp["data"]["trending"]["songs"]
            let albums_showcase = [
                {
                    name: albums[0]["name"],
                    image: albums[0]["image"][2]["link"]
                },
                {
                    name: albums[1]["name"],
                    image: albums[1]["image"][2]["link"]
                },
                {
                    name: albums[2]["name"],
                    image: albums[2]["image"][2]["link"]
                },
                {
                    name: albums[3]["name"],
                    image: albums[3]["image"][2]["link"]
                }]

            let songs_showcase = [
                {
                    name: songs[0]["name"],
                    image: songs[0]["image"][2]["link"]
                },
                {
                    name: songs[1]["name"],
                    image: songs[1]["image"][2]["link"]
                },
                {
                    name: songs[2]["name"],
                    image: songs[2]["image"][2]["link"]
                },
                {
                    name: songs[3]["name"],
                    image: songs[3]["image"][2]["link"]
                }]

            for (let album of albums_showcase) {
                albums_cards.innerHTML += `
                <div class="p-4 lg:w-1/4 md:w-1/2">
                    <div class="h-full flex flex-col items-center text-center">
                        <img alt="team" class="hover:brightness-50 flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4"
                            src="${album["image"]}">
                        <div class="w-full">
                            <h2 class="title-font font-medium text-lg text-white">${album["name"]}</h2>                

                        </div>
                    </div>
                </div>`
            }
            for (let song of songs_showcase) {
                songs_cards.innerHTML += `
                <div class="p-4 lg:w-1/4 md:w-1/2">
                    <div class="h-full flex flex-col items-center text-center">
                        <img class="hover:brightness-50 flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4"
                            src="${song["image"]}">
                        <div class="w-full">
                            <h2 class="title-font font-medium text-lg text-white">${song["name"]}</h2>                

                        </div>
                    </div>
                </div>`
            }

        })
        .catch(err => {
            alert("Some error occurred :(")
            console.log(err)
        });
}

window.onload = search()