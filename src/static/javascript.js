const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// below two are for results

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
    fetch(url).then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Check if there are any search results
            if (data.resultCount === 0) {
                searchResults.innerHTML =
                  ' <p style="font-size: 100px;color: red;">No results found !</p> '
                return;
            }

            // Loop through the search results and extract the relevant information
            let resultsHtml = '';
            let totalDuration = 0; // to keep track of the total duration of all tracks

            const str = `
            <table>
                <tr>
                    <th style="text-align: center;">
                
                        Title
                    </th>
                    <th>
                        Explicit
                    </th>
                    <th>
                        Duration
                    </th>
                    <th>
                        Play
                    </th>
                </tr>
            `
            resultsHtml += str;
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
                    <tr>
                        <td>
                            <img  src="${albumPoster}" alt="poster">
                        <p>${trackName} - ${artistName}</p>
                        </td>
                        <td>
                        <p>${explicit ? 'Yes' : 'No'}</p>
                        </td>
                        <td>
                        <p>${convertSecondsToMinutesAndSeconds(trackDuration)}</p>
                        <span class="duration"></span>
                        </td>
                        <td>
                            <audio controls>
                                <source src="${previewUrl}" type="audio/mpeg">
                                Your browser does not support the audio tag.
                            </audio>
                        </td>
                    </tr>

                `
                resultsHtml += resultHtml; // Add the HTML for the result to the resultsHtml string
            });
            
            resultsHtml+='</table>';
            // Display the search results on the webpage
            searchResults.innerHTML = resultsHtml;

            // Display the total duration of all tracks
            const totalDurationText = document.createElement('p');
            totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
            searchResults.prepend(totalDurationText);

          

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

                let resultsHtml = ''
                let totalDuration = 0 // to keep track of the total duration of all tracks

                const str = `
                <table>
                    <tr>
                        <th>
                            Title
                        </th>
                        <th>
                            Explicit
                        </th>
                        <th>
                            Duration
                        </th>
                        <th>
                            Play
                        </th>
                    </tr>
                `
                resultsHtml += str

                filteredResults.forEach((result, i) => {
                  const artistName = result.artistName
                  const trackName = result.trackName
                  const albumPoster = result.artworkUrl100
                  const previewUrl = result.previewUrl
                  const trackDuration = result.trackTimeMillis / 1000
                  const explicit = result.trackExplicitness === 'explicit' // check if the track is explicit

                  totalDuration += trackDuration

                  // Create HTML for the search result
                  const resultHtml = `
                    <tr>
                        <td>
                            <img  src="${albumPoster}" alt="poster">
                        <p>${trackName} - ${artistName}</p>
                        </td>
                        <td>
                        <p>${explicit ? 'Yes' : 'No'}</p>
                        </td>
                        <td>
                        <p>${convertSecondsToMinutesAndSeconds(
                          trackDuration
                        )}</p>
                        <span class="duration"></span>
                        </td>
                        <td>
                            <audio controls>
                                <source src="${previewUrl}" type="audio/mpeg">
                                Your browser does not support the audio tag.
                            </audio>
                        </td>
                    </tr>

                `
                  resultsHtml += resultHtml // Add the HTML for the result to the resultsHtml string
                  // Same as before
                });

                resultsHtml += '</table>'
                searchResults.innerHTML = resultsHtml;

                // Update the total duration text
                const totalDurationText = document.createElement('p');
                totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
                searchResults.prepend(totalDurationText);

                
            });

            removeFiltersBtn.addEventListener('click', () => {
                // Reset the filter input fields
                document.getElementById('duration-input').value = '';
                document.getElementById('explicit-input').value = 'all';

                // Reset the search results to the original results
               
                 let resultsHtml = ''
                 let totalDuration = 0 // to keep track of the total duration of all tracks

                 const str = `
                <table>
                    <tr>
                        <th>
                            Title
                        </th>
                        <th>
                            Explicit
                        </th>
                        <th>
                            Duration
                        </th>
                        <th>
                            Play
                        </th>
                    </tr>
                `
                resultsHtml += str

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
                        <tr>
                            <td>
                                <img  src="${albumPoster}" alt="poster">
                            <p>${trackName} - ${artistName}</p>
                            </td>
                            <td>
                            <p>${explicit ? 'Yes' : 'No'}</p>
                            </td>
                            <td>
                            <p>${convertSecondsToMinutesAndSeconds(
                              trackDuration
                            )}</p>
                            <span class="duration"></span>
                            </td>
                            <td>
                                <audio controls>
                                    <source src="${previewUrl}" type="audio/mpeg">
                                    Your browser does not support the audio tag.
                                </audio>
                            </td>
                        </tr>

                    `
                    resultsHtml += resultHtml; // Add the HTML for the result to the resultsHtml string

                    // Same as before
                });
                resultsHtml += '</table>';
                searchResults.innerHTML = resultsHtml;

                // Update the total duration text
                const totalDurationText = document.createElement('p');
                totalDurationText.textContent = `Total duration: ${convertSecondsToMinutesAndSeconds(totalDuration)}`;
                searchResults.prepend(totalDurationText);


            });
        });

});

function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

