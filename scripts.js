document.getElementById('addSong').addEventListener('click', () => {
    const songContainer = document.getElementById('songs');
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
  
    const songName = document.createElement('input');
    songName.type = 'text';
    songName.placeholder = 'Song Name';
  
    const songTimes = document.createElement('input');
    songTimes.type = 'number';
    songTimes.placeholder = 'Times';
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      songContainer.removeChild(songItem);
    });
  
    songItem.appendChild(songName);
    songItem.appendChild(songTimes);
    songItem.appendChild(deleteButton);
    songContainer.appendChild(songItem);
  });
  
  document.getElementById('createPlaylist').addEventListener('click', () => {
    const playlistName = document.getElementById('playlistName').value;
    const songs = Array.from(document.querySelectorAll('.song-item')).map(item => ({
      name: item.children[0].value,
      times: item.children[1].value,
    }));
  
    fetch('/create-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistName, songs }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Playlist created:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  