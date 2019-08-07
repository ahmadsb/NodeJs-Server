

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController')

const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);

router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

// router
//     .route('/top-5-cheap')
//     .get(userController.aliasTopUsers,userController.getAllUsers);

// router.route('/user-stats').get(userController.getUserStats);
// router.route('/monthly-plan/:year').get(userController.getUserStats);

router
    .route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        userController.deleteUser);

module.exports = router;