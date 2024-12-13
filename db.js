const mysql = require("mysql2/promise");

const db = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "r@/!?@~l@m001",
      database: "indore_navigation",
    });
    return connection;
  } catch (err) {
    console.log("Could not connect to database!", err);
    throw err;
  }
};

const graphbuilder = async () => {
  let connection;
  try {
    connection = await db();
    const [connections] = await connection.query(`
          SELECT source_room, destination_room, distance
          FROM connections;
        `);

    const graph = {};

    connections.forEach(({ source_room, destination_room, distance }) => {
      if (!graph[source_room]) graph[source_room] = {};
      if (!graph[destination_room]) graph[destination_room] = {};

      graph[source_room][destination_room] = distance;
      graph[destination_room][source_room] = distance;
    });

    console.log("Graph:", graph);
    return graph;
  } catch (error) {
    console.error("Error building graph:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = { db, graphbuilder };
