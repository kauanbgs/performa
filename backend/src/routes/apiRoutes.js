const router = require("express").Router();
const projectController = require("../controllers/projectController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

//      CONTROLLER PROJECT     //
router.post("/project", projectController.createProject);
router.get("/project", projectController.readProject);

router.post("/export", projectController.exportProject);

//      CONTROLLER USER     //
router.post("/user", userController.createUser);
router.get("/user", userController.readUser);
router.put("/user", userController.updateUser);
router.delete("/user", userController.deleteUser);
router.post("/login", userController.loginUser);
router.get("/profile", auth, userController.getProfile);


module.exports = router;