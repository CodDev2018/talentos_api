var express = require('express');
var router = express.Router();
const UserController = require('./controllers/user.controller')

/* GET users listing. */
router.get('/:id', UserController.get)
router.get('/', UserController.find)
router.post('/', UserController.create)
router.patch('/:id', UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router;