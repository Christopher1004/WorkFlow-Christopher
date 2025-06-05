const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('register/contractor/contrainfo', {
        title: 'Primeiros Passos',
        layout: false
    })
})
module.exports = router