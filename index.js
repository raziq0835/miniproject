const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {db,graphbuilder} = require('./db');
const app = express();
const dijkstra = require('./dijkstra');

app.use(cors());
app.use(bodyParser.json());

let graph = null;

//  the graph once the server starts
(async () => {
  try {
    graph = await graphbuilder();
    console.log("Graph initialized:", graph);
  } catch (error) {
    console.error("Error initializing graph:", error);
  }
})();





app.get('/', async (req, res) =>  {if (!graph) {
    return res.status(500).send("Graph not initialized.");
  }

  const start = parseInt(req.query.start, 10) || 3;
  const end = parseInt(req.query.end, 10) || 5;

  try {
    

    // Run Dijkstra's algorithm
    const { path, distance } = dijkstra(graph, start, end);

    let stringArray = [];

    // Get the database connection
    const connection = await db();

    for (let i = 0; i < path.length - 1; i++) {
      const [rows] = await connection.query(
        `SELECT instruction FROM connections WHERE source_room = ? AND destination_room = ?`,
        [path[i], path[i + 1]]
      );

      if (rows.length > 0) {
        stringArray.push(rows[0].instruction); // Assuming `instruction` is a single field
      } else {
        stringArray.push(`No instruction found for ${path[i]} to ${path[i + 1]}`);
      }
    }

    // Close the connection
    await connection.end();

    // Send the response
    res.send(stringArray);
    
  } catch (err) {
    console.error("Error running Dijkstra:", err);
    res.status(500).send("Error calculating shortest path.");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});