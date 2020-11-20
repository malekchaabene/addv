const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/AuthController');
const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');
// Midlleware
const auth = require('../middleware/auth');

// Home
router.get('/', (req, res) => res.json({ hello: "World" }));


//// User Controller Routes
router.post('/api/login', AuthController.signIn);
router.post('/api/signup', AuthController.signUp);


//// Home Controller Routes
router.get('/api/home', auth, HomeController.home);
router.post('/api/book', auth, HomeController.bookdetails);
router.get('/book/:img', HomeController.bookAvatar);


//// User Controller Routes
router.get('/avatar/:img', UserController.userAvatar);
router.get('/api/fav', auth, UserController.favories);
router.post('/api/search', auth, UserController.searchbook);
router.get('/api/myorders', auth, UserController.myorders);
router.get('/api/orders', auth, UserController.orders);
router.get('/api/top', auth, UserController.topreaders);
router.post('/api/fav', auth, UserController.addFavorie);
router.post('/api/refav', auth, UserController.removeFavorie);
router.post('/api/rate', auth, UserController.addRating);
router.get('/api/readpdf/:doc/:user', HomeController.bookPdfChapter);

router.post('/api/avatar', auth, UserController.uploadAvatar);
router.post('/api/user', auth, UserController.editUser);

router.get('/api/currentread', auth, UserController.currentRead);
router.post('/api/complete/:id', auth, UserController.completeChapter);
router.post('/api/finich/:id', auth, UserController.completeBook);

router.get('/api/finish', auth, UserController.finishBook);


module.exports = router;