const express = require('express')
const Todo = require('../models/todo')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/todo', auth, async(req, res) => {
    const todo = new Todo({...req.body, owner:req.user._id})
    try {
        await todo.save()
        res.status(201).send(todo)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/todo', auth, async(req, res) => {
    try {
        const todo = await Todo.find({owner: req.user._id})
        if (todo.length < 1) {
            return res.send({response:"You have no todo to display"})
        }

        res.send(todo)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.patch('/todo/:id', auth, async(req, res) => {
    const possibleUpdates = ['name', 'description', 'status']
    const todoUpdateRequest = Object.keys(req.body)
    const isUpdateValid = todoUpdateRequest.every(update => possibleUpdates.includes(update))

    if (!isUpdateValid) {
        return res.status(404).send({error:"Invalid Update Field"})
    }

    try {
        const todo = await Todo.findOneAndUpdate({_id:req.params.id, owner:req.user._id}, req.body, {new:true, runValidators:true})
        res.status(201).send(todo)
        if (!todo) {
            return res.status(400).send()
        }
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/todo/:id', auth, async(req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        res.send(todo)
    } catch (e) {
        res.status(600).send(e)
    }
})

module.exports = router