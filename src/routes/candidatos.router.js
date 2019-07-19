const express = require('express');
const router = express.Router();

const {
    Candidato,
    CandidatoCurso,
    CandidatoExperiencia
} = require('../models')


const candidatoController = require('./controllers/candidato.controller')

const CrudController = require('./controllers/crud.controller')
const cursoController = new CrudController()
cursoController.setModel(CandidatoCurso)

const experienciaController = new CrudController()
experienciaController.setModel(CandidatoExperiencia)

const verifyAccessTokenMiddleware = require('./middlewares/verifyAccessToken.middleware')
const verifyAdminMiddleware = require('./middlewares/verifyAdmin.middleware')
const verifyCandidatoMiddleware = require('./middlewares/verifyCandidato.middleware')
const uploadModdleware = require('./middlewares/upload.middleware')

const verifyAdmin = [verifyAccessTokenMiddleware, verifyAdminMiddleware]
const verifyOwner = [verifyAccessTokenMiddleware, verifyCandidatoMiddleware]

/**
 * PESSOA
 */
router.get('/:id', verifyOwner, candidatoController.get.bind(candidatoController))
router.get('/', verifyAdmin, candidatoController.find.bind(candidatoController))
router.post('/', verifyAccessTokenMiddleware, candidatoController.create.bind(candidatoController));
router.patch('/:id', verifyOwner, uploadModdleware.single('foto'), candidatoController.update.bind(candidatoController));
router.delete('/:id', verifyAdmin, candidatoController.delete.bind(candidatoController));

/**
 * CURSOS
 */
router.get('/:candidatoId/cursos/:id', verifyOwner, cursoController.get.bind(cursoController))
router.post('/:candidatoId/cursos/', verifyOwner, cursoController.create.bind(cursoController));
router.patch('/:candidatoId/cursos/:id', verifyOwner, cursoController.update.bind(cursoController));
router.delete('/:candidatoId/cursos/:id', verifyOwner, cursoController.delete.bind(cursoController));

/**
 * Experiencia
 */
router.get('/:candidatoId/experiencias/:id', verifyOwner, experienciaController.get.bind(experienciaController))
router.post('/:candidatoId/experiencias/', verifyOwner, experienciaController.create.bind(experienciaController));
router.patch('/:candidatoId/experiencias/:id', verifyOwner, experienciaController.update.bind(experienciaController));
router.delete('/:candidatoId/experiencias/:id', verifyOwner, experienciaController.delete.bind(experienciaController));

module.exports = router;