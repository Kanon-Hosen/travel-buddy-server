const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()

const port = process.env.PORT || 4000;

// * Mongobd connect:::::::::::::::::::::

const dbConnect = () => {
    
}

app.get('/', (req, res) => {
    res.send('Server started successfully');
})

app.listen(port, () => {
    console.log('Server started on port', port)
})