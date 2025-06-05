const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('register/confirmação',{
        title: 'Confirmar Email',
        layout: false

    })
})
module.exports = router