var express = require("express")
var router = express.Router();
var UserController = require("../controllers/UserController");
var ReplicController = require("../controllers/ReplicController");
var WikiController = require("../controllers/WikiController");
var StoreController = require("../controllers/StoreController");
var ItemController = require("../controllers/ItemController");
var StageController = require("../controllers/StageController");
var AdminAuth = require("../middleware/AdminAuth")
var Implantation = require("../controllers/ImplantationController")
var Network = require ("../controllers/NetworkController")

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
router.post('/post', WikiController.create);
router.get('/posts', WikiController.getPosts);
router.get('/post', WikiController.getPost);
router.delete('/post/:slug', WikiController.deletePost);
router.patch('/post', WikiController.editPost);
router.delete('/store/:id', ReplicController.delete);
router.patch('/store', ReplicController.patchStores);
router.put('/store', ReplicController.edit);
router.post('/validate', AdminAuth, UserController.validate);
router.get('/stores', AdminAuth, StoreController.getStores);
router.get("/networks", AdminAuth, Network.getNetworks)
router.patch('/network', Network.editNetwork);
router.post('/stage', StageController.create);
router.get('/stages', StageController.getStages);
router.post('/items', ItemController.create);
router.post('/implantation', Implantation.create);
router.get('/implants', Implantation.getImplants);
router.get('/userImplants', Implantation.getUsersImplants);
router.patch('/userImplants', Implantation.editUsers);
router.patch('/implants', Implantation.editImplant);
router.post('/network', Network.create);
router.post('/store', StoreController.create);
router.get("/items", ItemController.getItems)



module.exports = router;