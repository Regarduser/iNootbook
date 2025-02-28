const express = require('express');
const router = express.Router()
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const {body , validationResult } = require('express-validator');


router.get('/example', (req, res)=>{
    res.json({
        "hello" : "world"
    })
})

// ROTE 1 GET ALL THE NOTES GET "api/auth/getuser" login required

router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try{
        const notes = await Note.find({user : req.user.id});
        res.json(notes)
    }
    catch(error){
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
})

// ROTE 2 ADD A NEW NOTE USING POST "api/auth/getuser" login required

router.post('/addnote', [
    body('title', 'Enter a vaild title').isLength({min : 3}),
    body('description', 'Description must be atleast 5 character').isLength({ min : 5}),
], fetchuser, async (req, res)=>{
    try{
    const { title, description , tag} = req.body
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({errors : errors.array()});
      }
      const note = new Note({
        title, description , tag, user : req.user.id
      })
      const savednote = await note.save()
    res.json(savednote)
    }
    catch(error){
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
})

//ROTE 3 : updating an existing notes POST "auth/note/updatenote" . login required

router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    try{
    const { title, description , tag} = req.body
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({errors : errors.array()});
      }
      const newNote = {};
      if(title){newNote.title = title};
      if(description){newNote.description = description};
      if(tag){newNote.tag = tag};
      
      let note = await Note.findById(req.params.id);
      if(!note){return res.status(404).send("not found")}

      if(note.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
      }
      res.json(note)
      note = await Note.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true} )
      
    }
    catch(error){
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
})
//ROUTE 4 : delete an existing note "api/note/deletenote/:id"
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({errors : errors.array()});
      }
      
      let note = await Note.findById(req.params.id);
      if(!note){return res.status(404).send("not found")}

      if(note.user.toString() !== req.user.id){
            return res.status(401).send("not allowed")
      }
      note = await Note.findByIdAndDelete(req.params.id)
      res.send("note delete successfully")
      
    }
    catch(error){
        res.status(500).json({error : "internal server error", errorm : error.message})
    }
})

module.exports = router