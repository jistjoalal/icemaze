// algo graveyard

const dfs = (at, end, verts, seen = new Set()) => {
  seen.add(at);

  // cancel branch if longer than best path found
  if ([...seen].length > m) return [];

  // path found!
  if (at == end) {
    // console.log([...seen]);
    // track min path length
    const l = [...seen].length;
    if (l < m) m = l;
    return [[...seen]];
  }

  // recurse along edges
  return optEdges(at, end, verts, seen).reduce(
    (a, e) => [...a, ...dfs(e, end, verts, new Set([...seen, e]), m)],
    []
  );
};

const bidirBFS = (s, e, v) => {
  const q = [new Set([s])];
  const p = [new Set([e])];
  const r = [];
  const w = backwards(v);

  while (q.length && p.length) {
    const seenQ = q.shift();
    const arrQ = [...seenQ];
    const seenP = p.shift();
    const arrP = [...seenP];
    s = arrQ.slice(-1)[0];
    e = arrP.slice(-1)[0];

    const i = intersect(seenQ, seenP);
    const l = i.length;
    if (l > m) continue;
    if (i) {
      r.push(i);
      if (l < m) m = l;
    }

    const edgeS = edges(s, v, seenQ);
    for (let edge of edgeS) {
      const newSet = new Set([...seenQ, edge]);
      q.push(newSet);
    }
    const edgeE = edges(e, w, seenP);
    for (let edge of edgeE) {
      const newSet = new Set([...seenP, edge]);
      p.push(newSet);
    }
  }
  return r;
};

// returns edges sorted by distance to end (DESC)
// - this makes map6 and map7 solvable but 8 is still ???
const optEdges = (at, end, verts, seen) => {
  return edges(at, verts, seen).sort((a, b) => dif(end, a) - dif(end, b));
};

// returns tile distance b/w two tiles (for optEdges)
const dif = (a, b) => {
  const [ay, ax] = a.split`,`.map(Number);
  const [by, bx] = b.split`,`.map(Number);
  return Math.abs(ay - by) + Math.abs(ax - bx);
};
