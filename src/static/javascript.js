const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const searchexplicit = document.getElementsByTagName('exp');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const removeFiltersBtn = document.getElementById('remove-filters-btn');

let currentAudio = null; // stores the current audio being played

searchBtn.addEventListener('click', () => {
    // Get the input from the search bar
    const query = searchInput.value;

    // Create the URL to search on another website
    const url = `https://itunes.apple.com/search?term=${query}&limit=10`;

    // Fetch the search results from the other website
    fetch(url)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Check if there are any search results
            if (data.resultCount === 0) {
                searchResults.innerHTML = '<p>No results found.</p>';
                return;
            }
            // Loop through the search results and extract the relevant information
            // Loop through the search results and extract the relevant information
            let resultsHtml = '';
            let totalDuration = 0; // to keep track of the total duration of all tracks
            data.results.forEach((result, i) => {
                const artistName = result.artistName;
                const trackName = result.trackName;
                const albumPoster = result.artworkUrl100;
                const previewUrl = result.previewUrl;
                const trackDuration = result.trackTimeMillis / 1000;
                const explicit = result.trackExplicitness === 'explicit'; // check if the track is explicit

                totalDuration += trackDuration;

                // Create HTML for the search result
                const resultHtml = `
                <div>
                    <img src="${albumPoster}">
                    <p>${trackName} - ${artistName}</p>
                    <p>Explicit: ${explicit ? 'Yes' : 'No'}</p>
                    <button class="play-btn" data-preview-url="${previewUrl}"><i class="fa fa-play"></i></button>
                    <span class="duration">${convertSecondsToMinutesAndSeconds(trackDuration)}</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                `;


                resultsHtml += resultHtml; // Add the HTML for the result to the resultsHtml string
            });

            // Display the search results on the webpage
            searchResults.innerHTML = resultsHtml;

            // Display the total duration of all tracks
            const totalDurationText = document.createElement('p');
            totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
            searchResults.prepend(totalDurationText);

            // Add event listeners to the play buttons
            const playButtons = document.getElementsByClassName('play-btn');
            for (let i = 0; i < playButtons.length; i++) {
                const button = playButtons[i];
                const previewUrl = button.getAttribute('data-preview-url');
                button.addEventListener('click', () => {
                    if (currentAudio && !currentAudio.paused) {
                        currentAudio.pause(); // pause the current audio if there is any
                        button.classList.remove('pause-btn');
                        button.classList.add('play-btn');
                        return;
                    }

                    const audio = new Audio(previewUrl);
                    currentAudio = audio;

                    // update the icon to be a pause button
                    button.innerHTML = '<i class="fa fa-pause"></i>';
                    button.classList.remove('play-btn');
                    button.classList.add('pause-btn');

                    // update the progress bar as the audio is playing
                    const progressBar = button.parentNode.querySelector('.progress-bar');
                    audio.addEventListener('timeupdate', () => {
                        const progress = (audio.currentTime / audio.duration) * 100;
                        progressBar.style.width = progress + '%';
                    });

                    const currentTimeText = button.parentNode.querySelector('.current-time');
                    audio.addEventListener('timeupdate', () => {
                        const progress = (audio.currentTime / audio.duration) * 100;
                        progressBar.style.width = progress + '%';
                        currentTimeText.textContent = convertSecondsToMinutesAndSeconds(audio.currentTime);
                    });

                    // update the duration text
                    const duration = button.parentNode.querySelector('.duration');
                    audio.addEventListener('loadedmetadata', () => {
                        duration.textContent = convertSecondsToMinutesAndSeconds(audio.duration);
                    });


                    audio.addEventListener('ended', () => {
                        button.innerHTML = '<i class="fa fa-play"></i>'; // update the icon back to play button
                        button.classList.remove('pause-btn');
                        button.classList.add('play-btn');
                        progressBar.style.width = '0%'; // reset the progress bar
                    });
                    audio.play();

                });
            }

            applyFiltersBtn.addEventListener('click', () => {
                // Get the filter values from the input fields
                const maxDuration = document.getElementById('duration-input').value;
                const explicitFilter = document.getElementById('explicit-input').value;

                // Filter the search results based on the filter values
                let filteredResults = data.results.filter(result => {
                    // Check if the track duration is less than or equal to the max duration
                    if (maxDuration && result.trackTimeMillis / 1000 / 60 > maxDuration) {
                        return false;
                    }
                    // Check if the track is explicit based on the explicit filter value
                    if (explicitFilter === 'explicit' && result.trackExplicitness !== 'explicit') {
                        return false;
                    }
                    if (explicitFilter === 'not-explicit' && result.trackExplicitness === 'explicit') {
                        return false;
                    }
                    return true;
                });

                // Update the search results with the filtered results
                let resultsHtml = '';
                let totalDuration = 0;
                filteredResults.forEach((result, i) => {
                    const artistName = result.artistName;
                    const trackName = result.trackName;
                    const albumPoster = result.artworkUrl100;
                    const previewUrl = result.previewUrl;
                    const trackDuration = result.trackTimeMillis / 1000;
                    const explicit = result.trackExplicitness === 'explicit'; // check if the track is explicit

                    totalDuration += trackDuration;

                    // Create HTML for the search result
                    const resultHtml = `
        <div>
            <img src="${albumPoster}">
            <p>${trackName} - ${artistName}</p>
            <p>Explicit: ${explicit ? 'Yes' : 'No'}</p>
            <button class="play-btn" data-preview-url="${previewUrl}"><i class="fa fa-play"></i></button>
            <span class="duration">${convertSecondsToMinutesAndSeconds(trackDuration)}</span>
            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        `;


                    resultsHtml += resultHtml; // Add the HTML for the result to the resultsHtml string
                    // Same as before
                });
                searchResults.innerHTML = resultsHtml;

                // Update the total duration text
                const totalDurationText = document.createElement('p');
                totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
                searchResults.prepend(totalDurationText);

                // Add event listeners to the play buttons (same as before)
                const playButtons = document.getElementsByClassName('play-btn');
                for (let i = 0; i < playButtons.length; i++) {
                    const button = playButtons[i];
                    const previewUrl = button.getAttribute('data-preview-url');
                    button.addEventListener('click', () => {
                        if (currentAudio && !currentAudio.paused) {
                            currentAudio.pause(); // pause the current audio if there is any
                            button.classList.remove('pause-btn');
                            button.classList.add('play-btn');
                            return;
                        }

                        const audio = new Audio(previewUrl);
                        currentAudio = audio;

                        // update the icon to be a pause button
                        button.innerHTML = '<i class="fa fa-pause"></i>';
                        button.classList.remove('play-btn');
                        button.classList.add('pause-btn');

                        // update the progress bar as the audio is playing
                        const progressBar = button.parentNode.querySelector('.progress-bar');
                        audio.addEventListener('timeupdate', () => {
                            const progress = (audio.currentTime / audio.duration) * 100;
                            progressBar.style.width = progress + '%';
                        });

                        // update the duration text
                        const duration = button.parentNode.querySelector('.duration');
                        audio.addEventListener('loadedmetadata', () => {
                            duration.textContent = convertSecondsToMinutesAndSeconds(audio.duration);
                        });



                        audio.addEventListener('ended', () => {
                            button.innerHTML = '<i class="fa fa-play"></i>'; // update the icon back to play button
                            button.classList.remove('pause-btn');
                            button.classList.add('play-btn');
                            progressBar.style.width = '0%'; // reset the progress bar
                        });

                        audio.play();
                    });
                }
            });

            removeFiltersBtn.addEventListener('click', () => {
                // Reset the filter input fields
                document.getElementById('duration-input').value = '';
                document.getElementById('explicit-input').value = 'all';

                // Reset the search results to the original results
                let resultsHtml = '';
                let totalDuration = 0;
                data.results.forEach((result, i) => {
                    const artistName = result.artistName;
                    const trackName = result.trackName;
                    const albumPoster = result.artworkUrl100;
                    const previewUrl = result.previewUrl;
                    const trackDuration = result.trackTimeMillis / 1000;
                    const explicit = result.trackExplicitness === 'explicit'; // check if the track is explicit

                    totalDuration += trackDuration;

                    // Create HTML for the search result
                    const resultHtml = `
        <div>
            <img src="${albumPoster}">
            <p>${trackName} - ${artistName}</p>
            <p>Explicit: ${explicit ? 'Yes' : 'No'}</p>
            <button class="play-btn" data-preview-url="${previewUrl}"><i class="fa fa-play"></i></button>
            <span class="duration">${convertSecondsToMinutesAndSeconds(trackDuration)}</span>
            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        `;


                    resultsHtml += resultHtml; // Add the HTML for the result to the resultsHtml string

                    // Same as before
                });
                searchResults.innerHTML = resultsHtml;

                // Update the total duration text
                const totalDurationText = document.createElement('p');
                totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
                searchResults.prepend(totalDurationText);

                // Add event listeners to the play buttons (same as before)
                const playButtons = document.getElementsByClassName('play-btn');
                for (let i = 0; i < playButtons.length; i++) {
                    const button = playButtons[i];
                    const previewUrl = button.getAttribute('data-preview-url');
                    button.addEventListener('click', () => {
                        if (currentAudio && !currentAudio.paused) {
                            currentAudio.pause(); // pause the current audio if there is any
                            button.classList.remove('pause-btn');
                            button.classList.add('play-btn');
                            return;
                        }

                        const audio = new Audio(previewUrl);
                        currentAudio = audio;

                        // update the icon to be a pause button
                        button.innerHTML = '<i class="fa fa-pause"></i>';
                        button.classList.remove('play-btn');
                        button.classList.add('pause-btn');

                        // update the progress bar as the audio is playing
                        const progressBar = button.parentNode.querySelector('.progress-bar');
                        audio.addEventListener('timeupdate', () => {
                            const progress = (audio.currentTime / audio.duration) * 100;
                            progressBar.style.width = progress + '%';
                        });

                        // update the duration text
                        const duration = button.parentNode.querySelector('.duration');
                        audio.addEventListener('loadedmetadata', () => {
                            duration.textContent = convertSecondsToMinutesAndSeconds(audio.duration);
                        });

                        audio.addEventListener('ended', () => {
                            button.innerHTML = '<i class="fa fa-play"></i>'; // update the icon back to play button
                            button.classList.remove('pause-btn');
                            button.classList.add('play-btn');
                            progressBar.style.width = '0%'; // reset the progress bar
                        });

                        audio.play();
                    });

                }


            });
        });

});
function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

