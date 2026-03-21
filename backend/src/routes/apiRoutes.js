const router = require("express").Router();
const projectController = require("../controllers/projectController");
const userController = require("../controllers/userController");

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
router.get("/profile", userController.getProfile);


module.exports = router;