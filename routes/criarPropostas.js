const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Criar Proposta',
        view: 'proposals/create/proposals_create',
    })
})
module.exports = router