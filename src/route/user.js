const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async(req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})

router.get('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
    
        res.send({user, token})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.body.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send();
    }
    
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/users/:id', async(req, res) => {
    const posibleUpdates = ['name', 'password']
    const userUpdateRequest = Object.keys(req.body)
    const isUpdateValid = userUpdateRequest.every(update => posibleUpdates.includes(update));

    if (!isUpdateValid) {
        return res.status(400).send({error:'Invalid Update parameter'})
    }

    try {
        const user = await User.findOneAndUpdate({_id:req.params.id}, req.body, {new:true, runValidators:true})
        if (!user) {
            return res.status(400).send()
        }
        res.status(201).send(user)
    } catch (e) {
        
    }
})

router.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findOneAndDelete({_id:req.params.id})
        if (!user) {
            return res.status(500).send({error:"No user with such parameter found"})    
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router