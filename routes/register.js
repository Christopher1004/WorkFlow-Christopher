const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('register/register',{
        title: 'Registrar',
        layout: false
    })
})
module.exports = router