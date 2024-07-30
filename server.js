const express = require('express');
const axios = require('axios');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Session setup
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new SpotifyStrategy(
    {
      clientID: '85eed00a3ba941ffb7e13a9a815d3a61',
      clientSecret: 'f703a0615fef45c8b88250cd3dc32422',
      callbackURL: 'http://localhost:3000/auth/spotify/callback',
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      return done(null, { accessToken, profile });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'playlist-modify-public', 'playlist-modify-private'] }));

app.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Successful authentication, redirect home.
});

app.post('/create-playlist', (req, res) => {
  const { playlistName, songs } = req.body;
  const accessToken = req.user.accessToken;

  axios.post(
    'https://api.spotify.com/v1/users/me/playlists',
    {
      name: playlistName,
      description: 'Created with Spotify Playlist Creator',
      public: false,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then(response => {
      const playlistId = response.data.id;

      const songPromises = songs.map(song => {
        return axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(song.name)}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(searchResponse => {
          const trackUri = searchResponse.data.tracks.items[0].uri;
          const trackUris = Array(song.times).fill(trackUri);

          return axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              uris: trackUris,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        });
      });

      Promise.all(songPromises)
        .then(() => res.json({ message: 'Playlist created successfully!' }))
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Error adding songs to playlist.' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error creating playlist.' });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
