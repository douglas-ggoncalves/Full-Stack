var express = require("express")
var router = express.Router();
var UserController = require("../controllers/UserController");
var ReplicController = require("../controllers/ReplicController");
var TarefaAgendadaController = require("../controllers/TarefaAgendadaController");
var WikiController = require("../controllers/WikiController");
var WppConnectBot = require("../controllers/WppConnectBot");
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
var CMEDController = require("../controllers/CMEDController")
var VersoesController = require("../controllers/VersoesController")
var NotasVersoesController = require("../controllers/NotasVersoesController")
var VersoesModulosController = require("../controllers/VersoesModulosController")

router.post('/login', UserController.login);
router.get('/user', UserAuth, UserController.getUsers);
router.post('/user', UserController.create);
router.patch('/user', UserController.edit);
router.patch('/userPhoto', UserController.editPhoto);
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
router.post('/nappGetRequestData', NappController.requestsData);
router.patch('/nappUpdateRequestData', NappController.requestsUpdateData);
router.post('/nappStore', NappController.create);
router.post('/nappData', NappController.createDataNapp);
router.post('/nappRequestData', NappController.requestDataNapp);
router.patch('/napp', NappController.editStore);
router.post('/createWppConnect', WppConnectBot.wppConnect);
router.post('/sendText', WppConnectBot.wppConnect);
router.get('/task', UserAuth, TarefaAgendadaController.getData);
router.post('/task', TarefaAgendadaController.searchComands);
router.get('/cmedPreco/:codBarrasPrincipal/:codBarrasAUX', CMEDController.getPreco);
router.get('/cmedPreco/:codUf', CMEDController.getListPreco);
router.get('/cmedLista/:data', CMEDController.getDataUltimaAtualizacao);
router.post('/CMED', CMEDController.postData);
router.post('/setDataStore', NappController.setDataStore);
router.get("/versoes", VersoesController.get)
router.get("/versoes/:id", VersoesController.getByID)
router.post("/versoes", VersoesController.create)
router.put("/versoes/:id", VersoesController.putEdit)
router.patch("/versoes/:id", VersoesController.edit)

router.get("/notasVersoes", NotasVersoesController.get)
router.post("/notasVersoes", NotasVersoesController.create)
router.patch("/notasVersoes/:id", NotasVersoesController.edit)
router.delete("/notasVersoes/:id", NotasVersoesController.delete)

router.get("/versoesModulos", VersoesModulosController.get)
router.post("/versoesModulos", VersoesModulosController.create)
router.patch("/versoesModulos/:id", VersoesModulosController.edit)
router.delete("/versoesModulos/:id", VersoesModulosController.delete)

module.exports = router;