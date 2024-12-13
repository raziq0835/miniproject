const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db, graphbuilder } = require("./db");
const extractJSON = require("./extractJSON");
const app = express();
const dijkstra = require("./dijkstra");

app.use(cors());
app.use(bodyParser.json());

let graph = null;

(async () => {
  try {
    graph = await graphbuilder();
    console.log("Graph initialized:", graph);
  } catch (error) {
    console.error("Error initializing graph:", error);
  }
})();

app.get("/", async (req, res) => {
  if (!graph) {
    return res.status(500).send("Graph not initialized.");
  }

  const start = parseInt(req.query.start, 10) || 3;
  const end = parseInt(req.query.end, 10) || 5;

  try {
    const { path, distance } = dijkstra(graph, start, end);

    let stringArray = [];
    let dirArray = [];

    const connection = await db();

    for (let i = 0; i < path.length - 1; i++) {
      const [rows] = await connection.query(
        `SELECT instruction,direction FROM connections WHERE source_room = ? AND destination_room = ?`,
        [path[i], path[i + 1]]
      );

      if (rows.length > 0) {
        stringArray.push(rows[0].instruction);
        dirArray.push(rows[0].direction);
      } else {
        stringArray.push(
          `No instruction found for ${path[i]} to ${path[i + 1]}`
        );
        dirArray.push(0);
      }
    }

    await connection.end();

    res.send({
      instructions: stringArray,
      directions: dirArray,
      distance,
    });
  } catch (err) {
    console.error("Error running Dijkstra:", err);
    res.status(500).send("Error calculating shortest path.");
  }
});

app.get("/rooms/", async (req, res) => {
  const connection = await db();

  const [result] = await connection.query(`select * from rooms`);
  console.log(result);
  res.send(result);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
