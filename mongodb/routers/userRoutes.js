

const express = require('express');
const userController = require('./../controllers/userController')
const router = express.Router();

router
    .route('/top-5-cheap')
    .get(userController.aliasTopUsers,userController.getAllUsers);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;