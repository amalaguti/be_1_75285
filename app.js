const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const petsRouter = require('./routes/pets.router.js');
app.use('/api/pets', petsRouter);



app.get('/', (req, res) => {
  res.send('Hello World !!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
