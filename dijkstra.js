class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(node, priority) {
      const element = { node, priority };
      let added = false;
  
      // Insert based on priority
      for (let i = 0; i < this.queue.length; i++) {
        if (priority < this.queue[i].priority) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
  
      if (!added) {
        this.queue.push(element);
      }
    }
  
    dequeue() {
      return this.queue.shift(); // Remove the element with the highest priority
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  



  function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const priorityQueue = new PriorityQueue();
  
    // Initialize distances
    Object.keys(graph).forEach((node) => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;
  
    priorityQueue.enqueue(start, 0);
  
    while (!priorityQueue.isEmpty()) {
      const { node: current } = priorityQueue.dequeue();
  
      if (current === end) break;
      if (visited.has(current)) continue;
  
      visited.add(current);
  
      // Check if current node exists in graph
      const neighbors = graph[current];
      if (!neighbors) {
        console.error(`Node ${current} has no connections in the graph.`);
        continue;
      }
  
      // Update distances for neighbors
      Object.entries(neighbors).forEach(([neighbor, weight]) => {
        const newDist = distances[current] + weight;
  
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = current;
          priorityQueue.enqueue(neighbor, newDist);
        }
      });
    }
  
    // Reconstruct the path
    const path = [];
    let current = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
  
    return { path, distance: distances[end] };
  }
  
  

  module.exports = dijkstra;