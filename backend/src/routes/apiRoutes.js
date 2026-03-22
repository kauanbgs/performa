const router = require("express").Router();
const projectController = require("../controllers/projectController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

//      CONTROLLER PROJECT     //
router.post("/project", auth, projectController.createProject);
router.get("/projects/user/:id", auth, projectController.readProjectsByUserId);
router.get("/project/:id", auth, projectController.readProject);
router.put("/project/:id", auth, projectController.updateProject);
router.post("/export", auth, projectController.exportProject);

//      CONTROLLER USER     //
router.post("/user", userController.createUser);
router.get("/user", userController.readUser);
router.put("/user", userController.updateUser);
router.delete("/user", userController.deleteUser);
router.post("/login", userController.loginUser);
router.get("/profile", auth, userController.getProfile);


module.exports = router;