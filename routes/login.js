const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('login-user/login', {
        title: 'Login',
        layout: false
    })
})
module.exports = router