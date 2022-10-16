var express = require("express")
var app = express();
var router = express.Router();
var UserController = require("../controllers/UserController");
var ReplicController = require("../controllers/ReplicController");
var WikiController = require("../controllers/WikiController");
var StoreController = require("../controllers/StoreController");
var AdminAuth = require("../middleware/AdminAuth")

router.post('/login', UserController.login);
router.get('/user', AdminAuth, UserController.getUsers);
router.post('/user', UserController.create);
router.patch('/user', UserController.edit);
router.post('/password', UserController.recoveryPassword);
router.patch('/token', UserController.editPassword);
router.post('/token', UserController.validateToken);
router.delete('/user/:login', UserController.delete);
router.get('/replic', AdminAuth, ReplicController.getData);
router.post('/replic', ReplicController.searchComands);
router.post('/network', ReplicController.postNetworks);
router.post('/store', ReplicController.postStores);
router.post('/post', WikiController.create);
router.get('/posts', WikiController.getPosts);
router.get('/post', WikiController.getPost);
router.delete('/post/:slug', WikiController.deletePost);
router.patch('/post', WikiController.editPost);
router.delete('/store/:id', ReplicController.delete);
router.patch('/store', ReplicController.patchStores);
router.post('/validate', AdminAuth, UserController.validate);

//router.get('/post', WikiController.getPost);
router.get('/stores', AdminAuth, StoreController.getStores);



module.exports = router;