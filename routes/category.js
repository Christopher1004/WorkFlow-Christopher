const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Category',
        view: 'category/category',
    })
})
module.exports = router