/**
 * Helpers
 */

// converts string map to matrix
const grid = m =>
  m.split`\n`
    .map(r => r.split``)
    // v not needed on codewars v
    .filter(r => r.length);

// returns tile distance along path of coords
const dist = path => path.reduce((a, c, i) => a + dif(c, path[i - 1]), 0);

const dif = (a, b) => {
  if (!a || !b) return 0;
  const [ay, ax] = a.split`,`;
  const [by, bx] = b.split`,`;
  return Math.abs(by - ay) + Math.abs(bx - ax);
};

// returns coords of f in g
const find = (g, v, f) => {
  return Object.keys(v).filter(c => {
    const [y, x] = c.split`,`;
    return g[y][x] == f;
  })[0];
};

/**
 * Adjacency Table
 */

// returns hash table adjacency table for graph
const vertices = g => {
  let tiles = {};
  g.forEach((row, y) => {
    row.forEach((sq, x) => {
      if (sq != "#") {
        tiles[y + "," + x] = slides(g, [y, x]);
      }
    });
  });
  return tiles;
};

// returns coords of sliding direction d from [y, x] over grid g
const slide = (g, [y, x], d, o) => {
  const vy = d == "u" ? -1 : d == "d" ? 1 : 0;
  const vx = d == "l" ? -1 : d == "r" ? 1 : 0;
  while (g[y] && g[y][x] && g[y][x] != "#") {
    (y += vy), (x += vx);
    o = g[y] && g[y][x] && ["x", "E"].includes(g[y][x]);
    if (o) break;
  }
  return [y - (o ? 0 : vy), x - (o ? 0 : vx)].join`,`;
};

// returns list of coords slidable from coord c over grid g (any dir)
const slides = (g, c) =>
  [..."udrl"].map(d => slide(g, c, d)).filter(v => c != v);

/**
 * Controls
 */

// converts list of coords to gameboy controls
const controls = path =>
  path.reduce(
    (a, c, i) => (i < path.length - 1 ? [...a, direction(c, path[i + 1])] : a),
    []
  );

// returns gameboy control to go from c to d
const direction = (c, d) => {
  const [cx, cy] = c.split`,`.map(Number);
  const [dx, dy] = d.split`,`.map(Number);
  return cx < dx ? "d" : cx > dx ? "u" : cy < dy ? "r" : "l";
};

/**
 * Path Finding
 */

// returns all paths from at to end
const paths = (at, end, verts) => {
  let m = Infinity;

  const bfs = (at, end, verts) => {
    const queue = [new Set([at])];
    const paths = [];
    const vis = new Array();

    while (queue.length) {
      const seen = queue.shift();
      const arr = [...seen];
      at = arr.slice(-1)[0];

      // optimization / pruning
      if (arr.length > m) continue;
      vis[at] = true;

      // path found
      if (at == end) {
        paths.push(arr);

        // track best path length
        const l = arr.length;
        if (l < m) m = l;
      }

      // explore edges
      const es = verts[at].filter(v => !seen.has(v));
      for (let e of es) {
        const newSet = new Set([...arr, e]);
        // only interested in nodes we haven't visited
        // because o/w we have a shorter path to that node
        if (!vis[e]) {
          queue.push(newSet);
        }
      }
    }
    return paths;
  };

  return bfs(at, end, verts);
};

/**
 * Solution
 */

const IceMazeSolver = m => {
  const g = grid(m);
  const v = vertices(g);
  const start = find(g, v, "S");
  const end = find(g, v, "E");
  const routes = paths(start, end, v);

  // tie break
  const [tb] = routes.sort((a, b) => dist(a) - dist(b));
  return tb ? controls(tb) : null;
};

module.exports = { IceMazeSolver };
