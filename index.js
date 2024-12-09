const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://nirjan:V8iVREF0amDvbylZ@cluster0.lqyancf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("visamaster");
    const visas = database.collection("visas");
    const visaApplications = database.collection("visa-applications");

    app.post("/visas", async (req, res) => {
      const visa = req.body;

      const result = await visas.insertOne(visa);
      res.send(result);
    });

    app.get("/visas", async (req, res) => {
      const { visa_type } = req.query;

      let query = {};

      if (visa_type) {
        query.visa_type = visa_type;
      }

      const allVisas = await visas.find(query).toArray();
      res.send(allVisas);
    });

    app.get("/visas/:email", async (req, res) => {
      const email = req.params.email;
      const visasByEmail = await visas.find({ addedBy: email }).toArray();
      res.send(visasByEmail);
    });

    app.get("/visas/id/:id", async (req, res) => {
      const id = req.params.id;
      const visaById = await visas.findOne({ _id: new ObjectId(id) });
      res.send(visaById);
    });

    app.delete("/visas/id/:id", async (req, res) => {
      const id = req.params.id;
      const result = await visas.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/visa-applications", async (req, res) => {
      const application = req.body;
      const result = await visaApplications.insertOne(application);
      res.send(result);
    });

    app.get("/visa-applications", async (req, res) => {
      const applications = await visaApplications.find().toArray();
      res.send(applications);
    });

    app.get("/visa-applications/:email", async (req, res) => {
      const email = req.params.email;
      const applicationsByEmail = await visaApplications
        .find({ email })
        .toArray();
      res.send(applicationsByEmail);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
