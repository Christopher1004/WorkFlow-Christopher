const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Perfil',
        view: 'profile/profile',
    })
})
module.exports = router