const prisma = require("../connect")

module.exports = class projectController {
  static async createProject(req, res) {
    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `INSERT INTO project (title) VALUES (?)`
    value = [title]
    try {
        prisma.query(query, value, function(err, results)){
        if (err) {
          console.log(err);
        }
        return res.status(200).json("OK!")
        }} catch {
            console.log(err)
            return res.status(500).json("NAO OK")
    }
}
}