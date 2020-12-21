const express = require("express")
const router = new express.Router()
const items = require('../fakeDb')
const ExpressError = require('../expressError')

router.get('/', function(req, res){
    res.json({items})
})

router.get('/:name', function(req, res){
    snack = items.find(item => item.name === req.params.name)
    if (!snack){
        throw new ExpressError("Snack not found", 404)
    }
    return res.json(snack)
})

router.post('/', function(req, res, next){
    try{
        if(!req.body.name) throw new ExpressError("Name is Required", 400)
        if(!req.body.price) throw new ExpressError("Price is Required", 400)
        const newItem = {name: req.body.name, price: req.body.price}
        items.push(newItem)
        return res.status(201).json({added: newItem})
    } catch(e){
        return next(e)
    }
})

router.patch('/:name', function(req, res){
    snack = items.find(item => item.name === req.params.name)
    if (!snack){
        throw new ExpressError("Snack not found", 404)
    }
    snack.name = req.body.name
    snack.price = req.body.price
    res.json({updated: snack})

})

router.delete('/:name', function(req, res){
    snack = items.find(item => item.name === req.params.name)
    if (!snack){
        throw new ExpressError("Snack not found", 404)
    }
    items.splice(snack, 1)
    res.json({message: "Deleted"})
})

module.exports = router;