const router = require("express").Router();
const projectController = require("../controllers/projectController");

//      CONTROLLER PROJECT     //
router.post("/project", projectController.createProject);
router.get("/project", projectController.readProject);

router.post("/export", projectController.exportProject);

module.exports = router;