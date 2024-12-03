const mysql = require('mysql2/promise');

// Create a database connection function that returns the connection
const db = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'r@/!?@~l@m001',
            database: 'indore_navigation',
        });
        return connection; // Return the connection to be used in queries
    } catch (err) {
        console.log("Could not connect to database!", err);
        throw err; // Rethrow the error after logging it
    }
};

// Function to build the graph
const graphbuilder = async () => {
    let connection;
    try {
        connection = await db(); // Get the DB connection
        const [connections] = await connection.query(`
          SELECT source_room, destination_room, distance
          FROM connections;
        `);

        // Initialize an empty graph
        const graph = {};

        // Populate the graph with connections
        connections.forEach(({ source_room, destination_room, distance }) => {
            // Ensure both source and destination nodes exist in the graph
            if (!graph[source_room]) graph[source_room] = {};
            if (!graph[destination_room]) graph[destination_room] = {};

            // Add the bidirectional connection
            graph[source_room][destination_room] = distance;
            graph[destination_room][source_room] = distance; // Optional for undirected graph
        });

        console.log("Graph:", graph);
        return graph;

    } catch (error) {
        console.error("Error building graph:", error);
    } finally {
        if (connection) {
            await connection.end(); // Close the connection after use
        }
    }
};

// Export db and graph functions as properties of an object
module.exports = { db, graphbuilder };
