const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Resultados',
        view: 'search/searchpage',
    })
})
module.exports = router