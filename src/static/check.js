function addToPlaylist(button) {
    var row=button.parentNode.parentNode;
    // Extract data from the table row
    var srnum = row.querySelector('td:nth-child(1)').textContent;
    var name = row.querySelector('td:nth-child(2)').textContent;
    var duration = row.querySelector('td:nth-child(3)').textContent;
    var date = row.querySelector('td:nth-child(4)').textContent;

    // Send an HTTP POST request to the server with the extracted data
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/add_song_to_playlist", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ srnum: srnum, name: name, date: date, duration: duration }));
    console.log(JSON.stringify({ srnum: srnum, name: name, date: date, duration: duration }))
  } 