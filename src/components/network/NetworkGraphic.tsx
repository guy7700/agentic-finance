import { cn } from '@/lib/cn';

/**
 * Connected nodes: the Network as a picture (Tal's review, 26 Nov 2026). A fixed, seeded
 * layout so the server and every visitor draw the same graph; links glow in turn, and keep
 * still for visitors who ask for less motion. Decorative: hidden from screen readers.
 */

// Deterministic pseudo-random numbers, so the drawing never changes between builds.
function rand(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Node = { x: number; y: number; r: number; hub?: boolean };

function graph(seed: number) {
  const next = rand(seed);
  const nodes: Node[] = [{ x: 300, y: 300, r: 9, hub: true }];
  // Five group hubs on an inner ring, then members around each.
  const hubs: number[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    nodes.push({ x: 300 + Math.cos(a) * 150, y: 300 + Math.sin(a) * 150, r: 6, hub: true });
    hubs.push(nodes.length - 1);
  }
  const links: [number, number][] = hubs.map((h) => [0, h]);
  hubs.forEach((h, i) => {
    const base = (i / 5) * Math.PI * 2 - Math.PI / 2;
    for (let k = 0; k < 7; k++) {
      const a = base + (next() - 0.5) * 1.15;
      const d = 205 + next() * 85;
      nodes.push({ x: 300 + Math.cos(a) * d, y: 300 + Math.sin(a) * d, r: 2 + next() * 2.4 });
      links.push([h, nodes.length - 1]);
    }
    links.push([h, hubs[(i + 1) % 5]]);
  });
  // A few cross-links between members: introductions across groups.
  const members = nodes.map((_, i) => i).filter((i) => !nodes[i].hub);
  for (let k = 0; k < 14; k++) {
    const a = members[Math.floor(next() * members.length)];
    const b = members[Math.floor(next() * members.length)];
    if (a !== b) links.push([a, b]);
  }
  return { nodes, links, hubs };
}

export function NetworkGraphic({ className, seed = 7, labels }: { className?: string; seed?: number; labels?: string[] }) {
  const { nodes, links, hubs } = graph(seed);
  return (
    <svg viewBox="0 0 600 600" aria-hidden className={cn('pointer-events-none select-none', className)} fill="none">
      <defs>
        <radialGradient id={`ng-glow-${seed}`}>
          <stop offset="0%" stopColor="rgb(209 182 121)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(209 182 121)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="120" fill={`url(#ng-glow-${seed})`} />
      <g stroke="rgb(209 182 121)" strokeWidth="0.8">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            strokeOpacity={nodes[a].hub && nodes[b].hub ? 0.55 : 0.22}
            className="af-net-link"
            style={{ animationDelay: `${(i % 12) * 0.6}s` }}
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.hub ? 'rgb(230 207 156)' : 'rgb(237 230 211)'} fillOpacity={n.hub ? 1 : 0.55} />
      ))}
      {labels
        ? hubs.map((h, i) =>
            labels[i] ? (
              <text
                key={h}
                x={nodes[h].x}
                y={nodes[h].y + (nodes[h].y < 300 ? -16 : 26)}
                textAnchor="middle"
                className="fill-paper font-mono text-[13px] uppercase tracking-[0.12em]"
              >
                {labels[i]}
              </text>
            ) : null,
          )
        : null}
    </svg>
  );
}
