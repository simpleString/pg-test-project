import "dotenv/config";

import express from "express";
import { AppError } from "./errors";
import { validateData } from "./middlewares/validationMiddleware";
import {
  createModel,
  deleteModel,
  getModel,
  getModels,
  updateModel,
} from "./repos/model";
import { initDb } from "./db";
import { modelSchema } from "./schemas/modelSchema";

const app = express();

app.use(express.json());

app.get("/api/models", async (_, res) => {
  try {
    const models = await getModels();
    res.json({ data: models });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/models", validateData(modelSchema), async (req, res) => {
  try {
    const newModelData = req.body as Model;
    await createModel(newModelData);
    res.status(201).json({ data: "OK" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/api/models/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Id not valid number" });
    }

    const model = await getModel(id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.json({ data: model });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.put("/api/models/:id", validateData(modelSchema), async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Id not valid number" });
    }
    const updateModelData = req.body as Model;

    await updateModel({ ...updateModelData, id });

    res.json({ data: "OK" });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.status(500).json({ error });
  }
});

app.delete("/api/models/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Id not valid number" });
    }
    await deleteModel(id);

    res.status(200).json({ data: "OK" });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.status(500).json({ error });
  }
});

app.listen(3000, async () => {
  console.log("server is running on port 3000");
  await initDb();
});
