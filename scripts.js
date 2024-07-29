document.getElementById('add-song').addEventListener('click', function() {
    const container = document.getElementById('songs-container');
    const index = container.children.length + 1;
    const songInput = document.createElement('div');
    songInput.classList.add('song-input');
    songInput.innerHTML = `
        <label for="song-${index}">Song:</label>
        <input type="text" id="song-${index}" name="song" required>
        <label for="count-${index}">Times:</label>
        <input type="number" id="count-${index}" name="count" required>
    `;
    container.appendChild(songInput);
});

document.getElementById('playlist-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const playlistName = document.getElementById('playlist-name').value;
    const songs = Array.from(document.querySelectorAll('.song-input')).map(input => ({
        song: input.querySelector('input[name="song"]').value,
        count: input.querySelector('input[name="count"]').value
    }));

    // At this point, you need to call Spotify's API to create the playlist
    // You will need to authenticate with Spotify and use their API to create the playlist
    // For now, we'll just log the playlist name and songs to the console

    console.log({ playlistName, songs });
});
