const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('register/contractor/contratante',{
        title: 'Login Contratante',
        layout: false

    })
})
module.exports = router