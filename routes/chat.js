const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('base', {
        title: 'Chat',
        view: 'chat/chat',
    })
})
module.exports = router