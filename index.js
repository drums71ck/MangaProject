const express = require('express');
const mongodb = require('mongodb');
const ejs = require('ejs');
const morgan = require("morgan");

const app = express();
const port = 3000;
const mongoURI = 'mongodb://127.0.0.1:27017';
const dbName = 'mangadb';
const collectionName = 'mangas';
app.use(morgan('tiny'))
app.set('view engine', 'ejs');

// pagina de inicio 
app.get('/', async (req, res) => {
  try {
    const client = await mongodb.MongoClient.connect(mongoURI);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find().toArray();
    res.render('index', { data });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Gargar los datos del manga en base del nombre
app.get('/manga/:titulo', async(req, res) => {
  // Obtener el titulo del manga de la URL
  var mangaTitulo = decodeURIComponent(req.params.titulo);

  try {
    const client = await mongodb.MongoClient.connect(mongoURI);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const manga = await collection.findOne({ titulo: mangaTitulo });
    res.render('manga', { manga });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



// archivos fijos
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
