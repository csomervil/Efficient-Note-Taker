const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const { channel } = require('diagnostics_channel');
const PORT = 3001;
let channels = [];
const randInt = require('./public/random');
// randomNumber = () =>
//   Math.floor((1 + Math.random()) * 0x10000)
//     .toString(16)
//     .substring(1);


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('/api/notes', (req, res) => res.json(noteData));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

// app.get('/notes', (req, res) => {
//   res.json(`${req.method} request received to get reviews`)
// });

app.get('/api/notes', (req, res) => {
  console.log(channels)
  console.log(noteData)

  console.info(`${req.method} request received to get notes`);
  if (channels.length < 1) {
    return res.send(noteData);
  }
  return res.json(channels);
  
});


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  if (channels === []) {
    channels = noteData;
  }
  const { title, text, id } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: randInt(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        channels = JSON.parse(data);
        channels.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(channels, null, 4),
          (writeErr) =>
            writeErr ? console.error(writeErr)
            : console.info('Successfully updated notes!')
        );
      }
    });
    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

// app.post('/notes', (req, res) => {
//   console.log(noteData);
// });

app.delete('/api/notes/:id', (req, res) => {

  const { id } = req.params;
  const deleted = channels.find(channel => channel.id === id);
  if (deleted) {
    channels = channels.filter(channel => channel.id != id);
    console.log("work")
    res.json(deleted);
  } else {
    res.json( { message: "No" })
  }

});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
