const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Propostas',
        view: 'proposals/proposals',
    })
})
module.exports = router