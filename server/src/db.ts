import pg from "pg";

const { Pool } = pg;

const pool = new Pool();

export const initDb = async () => {
  try {
    await pool.query(
      `CREATE TABLE model (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        description text,
        context_length integer,
        tokenizer VARCHAR(255),
        modality VARCHAR(255)
      )`
    );
  } catch (error) {
    console.log(error);
  }
};

export const query = async (
  text: string,
  params?: any,
  callback?: (err: Error, result: pg.QueryResult<any>) => void
): Promise<pg.QueryResult<any>> => {
  return pool.query(text, params, callback!) as unknown as Promise<
    pg.QueryResult<any>
  >;
};
