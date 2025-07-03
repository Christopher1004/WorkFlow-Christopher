const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Configurações',
        view: 'settings/settings',
    })
})
module.exports = router