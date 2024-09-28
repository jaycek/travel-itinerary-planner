const express = require('express')
const router=express.Router()

//For file handling -fs module
const fs = require('fs')

//utility function for reading from JSON file

const loadItineraries = ()=>{
    try{
        const dataBuffer = fs.readFileSync('itineraries.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
        
    }catch(error){
        console.log(error)
        return []
    }
}

//utility function for writing into JSON file

const saveItineraries = (itineraries)=>{

    try{
        const dataJSON = JSON.stringify(itineraries,null,2)
        fs.writeFileSync('itineraries.json',dataJSON) 
    }catch(error){
        console.log(error)
    }

}

//Loads all itineraries
// localhost:3000/itineraries/
router.get('/',(req,res)=>{
    const itineraries = loadItineraries()
    res.send(itineraries)
})

// Add a new itinerary
router.post('/',(req,res)=>{
    //fetch existing itineraries

    try{

        const itineraries = loadItineraries()
        const newItinerary = {
            id:itineraries.length +1,
            destination:req.body.destination,
            startDate:req.body.startDate,
            endDate:req.body.endDate,
            activities:req.body.activities||[]
        }
        itineraries.push(newItinerary)
        saveItineraries(itineraries)
        res.status(201).send(newItinerary)
    }catch(error){
        res.status(400).send(error)
    }

})

//update by id
router.patch('/:id',(req,res)=>{

    try{
        const itineraries = loadItineraries()
        const itinerary = itineraries.find(i=>i.id === parseInt(req.params.id))
        if(!itinerary){
            return res.status(404).send({error:'Itinerary not found'})
        }
        itinerary.destination = req.body.destination || itinerary.destination
        itinerary.startDate = req.body.startDate || itinerary.startDate
        itinerary.endDate = req.body.endDate || itinerary.endDate
        itinerary.activities = req.body.activities || itinerary.activities
        saveItineraries(itineraries)
        res.status(200).send(itinerary)

    }catch(error){
        res.status(400).send(error)
    }
})

//delete by id

router.delete('/:id',(req,res)=>{
    try{
        let itineraries = loadItineraries()
        const index = itineraries.findIndex(i=>i.id===parseInt(req.params.id))
        if(index === -1){
            return res.status(404).send({error:'Itinerary not found'})
        }

        itineraries.splice(index,1)
        saveItineraries(itineraries)
        res.send({message:'Itinerary deleted'})

    }catch(error){
        res.status(400).send(error)
    }
})
module.exports = router;