const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Criar Projetos',
        view: 'projects/create_project/create_project',
    })
})
module.exports = router