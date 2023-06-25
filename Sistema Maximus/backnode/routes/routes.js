var express = require("express")
var router = express.Router();
var UserController = require("../controllers/UserController");
var ReplicController = require("../controllers/ReplicController");
var WikiController = require("../controllers/WikiController");
var StoreController = require("../controllers/StoreController");
var ItemController = require("../controllers/ItemController");
var StageController = require("../controllers/StageController");
var AdminAuth = require("../middleware/AdminAuth")
var UserMaximusAuth = require("../middleware/UserMaximusAuth");
var UserAuth = require("../middleware/UserAuth");
var Implantation = require("../controllers/ImplantationController")
var DashboardController = require("../controllers/DashboardController")
var Network = require ("../controllers/NetworkController")
var NappController = require("../controllers/NappController")

router.post('/login', UserController.login);
router.get('/user', UserAuth, UserController.getUsers);
router.post('/user', UserController.create);
router.patch('/user', UserController.edit);
router.post('/password', UserController.recoveryPassword);
router.patch('/token', UserController.editPassword);
router.post('/token', UserController.validateToken);
router.delete('/user/:login', UserController.delete);
router.get('/replic', UserAuth, ReplicController.getData);
router.post('/replic', ReplicController.searchComands);
router.post('/post', WikiController.create);
router.get('/posts', WikiController.getPosts);
router.get('/post', WikiController.getPost);
router.delete('/post/:slug', WikiController.deletePost);
router.patch('/post', WikiController.editPost);
router.delete('/store/:id', ReplicController.delete);
router.patch('/store', ReplicController.patchStores);
router.put('/store', ReplicController.edit);
router.post('/validate', UserAuth, UserController.validate);
router.get('/stores', UserMaximusAuth, StoreController.getStores);
router.get("/networks", UserMaximusAuth, Network.getNetworks)
router.patch('/network', Network.editNetwork);
router.post('/stage', StageController.create);
router.get('/stages', StageController.getStages);
router.post('/items', ItemController.create);
router.post('/implantation', Implantation.create);
router.get('/implants', Implantation.getImplants);
router.get('/userImplants', Implantation.getUsersImplants);
router.patch('/userImplants', Implantation.editUsers);
router.patch('/userItemImp', Implantation.editUserItemImp);
router.patch('/implants', Implantation.editImplant);
router.post('/network', Network.create);
router.post('/store', StoreController.create);
router.get("/items", ItemController.getItems)
router.post('/dataReplic', DashboardController.create);
router.get('/dataReplic', UserMaximusAuth, DashboardController.getUsers);
router.get('/dataCountReplic', UserMaximusAuth, DashboardController.getCountUsers);
router.get('/napp', NappController.getData);
router.get('/nappDetailed', NappController.getAllDataDetailed);
router.post('/nappStore', NappController.create);
router.post('/nappData', NappController.createDataNapp);
router.patch('/napp', NappController.editStore);

module.exports = router;