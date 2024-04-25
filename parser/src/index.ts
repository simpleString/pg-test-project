import "dotenv/config";

import { Client } from "pg";
import { CronJob } from "cron";

const url = "https://openrouter.ai/api/v1/models";

function expand(rowCount: number, columnCount: number, startAt = 1) {
  var index = startAt;
  return Array(rowCount)
    .fill(0)
    .map(
      (v) =>
        `(${Array(columnCount)
          .fill(0)
          .map((v) => `$${index++}`)
          .join(", ")})`
    )
    .join(", ");
}

const start = async () => {
  console.log("Start updating");
  const client = new Client();

  await client.connect();

  const data = await fetch(url);

  if (!data.ok) throw new Error("Something went wrong");

  const models = (await data.json()).data as any[];

  const preparedDataIds: string[] = [];

  const preparedData = models.map((model) => {
    const { id, context_length, description, name } = model;
    const { modality, tokenizer } = model.architecture;

    const preparedId = id.split("/");

    preparedDataIds.push(preparedId[1]);

    return [
      preparedId[1],
      name,
      description,
      context_length,
      tokenizer,
      modality,
    ];
  });

  await client.query(
    "DELETE FROM model WHERE id IN " + expand(1, preparedData.length),
    preparedDataIds
  );

  await client.query(
    "INSERT INTO model (id, name, description, context_length, tokenizer, modality) VALUES " +
      expand(preparedData.length, 6),
    preparedData.flat()
  );

  await client.end();
  console.log("Data updated");
};

const job = new CronJob("0 0 * * *", start);

job.start();
