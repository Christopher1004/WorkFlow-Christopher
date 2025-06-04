const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Freelancers',
        view: 'freelancers/freelancers',
    })
})
module.exports = router