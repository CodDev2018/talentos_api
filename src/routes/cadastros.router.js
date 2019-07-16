var express = require('express');
var router = express.Router();

const Models = require('../models')
const errorRes = require('./responses/error.response')
const CRUD = require('./controllers/crud.controller')
const allowModels = ['Estado']

const solveMethod = async (req, res, next, method) => {
  if (!allowModels.includes(req.params.model)) {
    return errorRes(res, 404, 'Essa entidade não pode ser acessada por aqui.')
  }

  const model = Models[req.params.model]

  if (!model) {
    return errorRes(res, 404, 'Essa entidade não foi mapeada.')
  }

  const crud = new CRUD()
  crud.setModel(model)
  return await crud[method](req, res, next)
}

const verifyAccessToken = require('./middlewares/verifyAccessToken.middleware')
const verifyAdminMiddleware = require('./middlewares/verifyAdmin.middleware')
const verifyRead = [verifyAccessToken]
const verifyAdmin = [verifyAccessToken, verifyAdminMiddleware]

/* GET home page. */
router.get('/:model', verifyRead, async (req, res, next) => solveMethod(req, res, next, 'find'));
router.get('/:model/:id', verifyRead, async (req, res, next) => solveMethod(req, res, next, 'get'));
router.post('/:model', verifyAdmin, async (req, res, next) => solveMethod(req, res, next, 'create'));
router.patch('/:model/:id', verifyAdmin, async (req, res, next) => solveMethod(req, res, next, 'update'));
router.delete('/:model/:id', verifyAdmin, async (req, res, next) => solveMethod(req, res, next, 'delete'));

module.exports = router;