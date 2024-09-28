const express = require('express')
const itinerariesRouter = require('./routes/itineraryRoute')

const app = express()

const PORT=3000;

app.use(express.json())

app.use('/itineraries',itinerariesRouter)

app.get('/',(req,res)=>{
    res.send('From Travel Itinerary API')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})