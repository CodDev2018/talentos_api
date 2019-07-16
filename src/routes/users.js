var express = require('express');
var router = express.Router();
const UserController = require('./controllers/user.controller')

/* GET users listing. */
router.get('/:id', UserController.get.bind(UserController))
router.get('/', UserController.find.bind(UserController))
router.post('/', UserController.create.bind(UserController))
router.patch('/:id', UserController.update.bind(UserController))
router.delete('/:id', UserController.delete.bind(UserController))

module.exports = router;