const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('register/freelancer/freelancer',{
        title: 'Login Freelancer',
        layout: false

    })
})
module.exports = router