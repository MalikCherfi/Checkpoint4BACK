const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PrismaClient } = require("@prisma/client");

const { project, competence } = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../portfolioBack/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/project", (req, res) => {
  project
    .findMany()
    .then((project) => {
      res.status(200).send(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving houses from database");
    });
});

app.get("/project/:id", (req, res) => {
  const { id } = req.params;
  project
    .findUnique({ where: { id: parseInt(id, 10) } })
    .then((project) => {
      res.status(200).send(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving houses from database");
    });
});

const cpUpload = upload.fields([
  { name: "image.principal", maxCount: 1 },
  { name: "image.secondary", maxCount: 10 },
]);

app.post("/upload", cpUpload, (req, res) => {
  console.log(req.files["image.principal"][0].filename);
  res.send([
    { principal: req.files["image.principal"][0].filename },
    { secondary: req.files["image.secondary"].map((e) => e.filename) },
  ]);
});

app.post("/project", (req, res) => {
  const description = req.body;
  console.log(description);
  project
    .create({ data: { ...description } })
    .then((createdProject) => {
      res.status(201).json(createdProject);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the house");
    });
});

app.delete("/project/:id", (req, res) => {
  const { id } = req.params;
  project
    .delete({ where: { id: parseInt(id, 10) } })
    .then(() => {
      res.status(201).send("Activity deleted with success");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting the activity");
    });
});

app.get("/competence", (req, res) => {
  competence
    .findMany()
    .then((competence) => {
      res.status(200).send(competence);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving houses from database");
    });
});

app.post("/competence", (req, res) => {
  const description = req.body;
  competence
    .create({ data: { ...description } })
    .then((createdCompetence) => {
      res.status(200).send(createdCompetence);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving houses from database");
    });
});

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`server is listening on ${port}`);
  }
});
