
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://rp074:jrOMh07F39cAFJc0@inootbook.an4mp.mongodb.net/?retryWrites=true&w=majority&appName=iNootbook"

const connectToMongo = async()=>{
    
        try{
            mongoose.connect(mongoURI)
            console.log("connected moongose successfully")
        }
        catch(error){
            console.error("Error conneting to MongoDB", error)
        }
    
}

module.exports = connectToMongo;