import { AppError } from "../errors";
import { query } from "../db";

export const getModels = async (): Promise<Model[]> => {
  const sql = `
    SELECT
      *
    FROM
      model
  `;
  const res = await query(sql);
  return res.rows;
};

export const createModel = async (createModel: Model) => {
  const { id, name, description, tokenizer, context_length, modality } =
    createModel;

  await query(
    "INSERT INTO model (id, name, description, context_length, tokenizer, modality) VALUES ($1, $2, $3, $4, $5, $6)",
    [id, name, description, context_length, tokenizer, modality]
  );
};

export const updateModel = async (updateModel: Model) => {
  const { id, name, description, context_length, tokenizer, modality } =
    updateModel;

  const model = await getModel(id);

  if (!model) {
    throw new AppError();
  }

  await query(
    "UPDATE model SET name = $1, description = $2, context_length = $3, tokenizer = $4, modality = $5 WHERE id = $6",
    [name, description, context_length, tokenizer, modality, id]
  );
};

export const deleteModel = async (id: string) => {
  const model = await getModel(id);

  if (!model) {
    throw new AppError();
  }

  await query("DELETE FROM model WHERE id = $1", [id]);
};

export const getModel = async (id: string): Promise<Model | undefined> => {
  const res = await query("SELECT * FROM model WHERE id = $1", [id]);

  return res.rows[0];
};
