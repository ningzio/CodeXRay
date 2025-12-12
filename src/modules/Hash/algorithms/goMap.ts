import type { AlgorithmGenerator, GraphData, GraphNode, GraphEdge } from "../../../types";

const BUCKET_SIZE = 4; // Using 4 for visualization clarity, though Go uses 8
const LOAD_FACTOR_THRESHOLD = 6.5; // Go's load factor threshold

type MapBucket = {
    id: string;
    tophash: (number | null)[];
    keys: (string | null)[]; // Simulating generic keys as strings for vis
    values: (string | null)[];
    overflow: MapBucket | null;
    index: number; // Logical index in the array
    isOverflow: boolean;
};

type GoMapState = {
    B: number; // log_2 of buckets
    count: number;
    buckets: MapBucket[];
    oldbuckets: MapBucket[] | null;
    nevacuate: number; // Progress counter for evacuation
};

// --- Helper Functions ---

// Simple hash function for demo
const getHash = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const getTopHash = (hash: number): number => {
    // Top 8 bits (simplified)
    return (hash >> 24) & 0xFF; // Use higher bits
    // For visualization, maybe just use a smaller range or modulo
    // return hash % 255;
};

const createBucket = (index: number, isOverflow: boolean = false): MapBucket => ({
    id: isOverflow ? `overflow-${Math.random().toString(36).substr(2, 5)}` : `bucket-${index}`,
    tophash: Array(BUCKET_SIZE).fill(null),
    keys: Array(BUCKET_SIZE).fill(null),
    values: Array(BUCKET_SIZE).fill(null),
    overflow: null,
    index,
    isOverflow
});

// Initialize State
const initializeMap = (B: number = 2): GoMapState => {
    const numBuckets = 1 << B;
    const buckets: MapBucket[] = [];
    for (let i = 0; i < numBuckets; i++) {
        buckets.push(createBucket(i));
    }
    return {
        B,
        count: 0,
        buckets,
        oldbuckets: null,
        nevacuate: 0
    };
};

// Convert internal state to GraphData for visualization
const toGraphData = (map: GoMapState, highlights: string[] = []): GraphData => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const bucketHeight = 160; // Approximate
    const gapX = 150;
    const gapY = 50;

    // Render Buckets
    map.buckets.forEach((bucket, i) => {
        let current: MapBucket | null = bucket;
        let chainDepth = 0;

        while (current) {
            const x = i * gapX + 50; // Start X
            const y = 100 + chainDepth * (bucketHeight + gapY);

            // Construct Label: "Index | Tophash | Key:Value"
            // We'll use a special format that the Visualizer can parse
            // "MAP_BUCKET:Index:IsOverflow|TH1:K1:V1|TH2:K2:V2..."

            const header = `MAP:${current.index}:${current.isOverflow ? 'OVF' : 'MAIN'}`;
            const slots = current.keys.map((k, idx) => {
                const th = current!.tophash[idx];
                const v = current!.values[idx];
                if (k === null) return "EMPTY";
                return `${th}:${k}:${v}`;
            }).join('|');

            nodes.push({
                id: current.id,
                label: `${header}|${slots}`,
                x,
                y,
                status: highlights.includes(current.id) ? 'visiting' : 'unvisited'
            });

            // Link to previous in chain if not head
            if (chainDepth > 0) {
                 // The edges array is additive, we need to know the parent ID.
            }

            current = current.overflow;
            chainDepth++;
        }

        // Add edges for the chain
        current = bucket;
        while (current && current.overflow) {
            edges.push({
                id: `e-${current.id}-${current.overflow.id}`,
                source: current.id,
                target: current.overflow.id,
                status: 'default'
            });
            current = current.overflow;
        }
    });

    // Handle Old Buckets (if resizing)
    if (map.oldbuckets) {
        map.oldbuckets.forEach((bucket, i) => {
             let current: MapBucket | null = bucket;
             let chainDepth = 0;
             while (current) {
                 const x = i * gapX + 50;
                 const y = -150 + chainDepth * (bucketHeight + 20); // Higher up

                 const header = `MAP:${current.index}:OLD`;
                 const slots = current.keys.map((k, idx) => {
                     if (k === null) return "EMPTY";
                     return `${current!.tophash[idx]}:${k}:${current!.values[idx]}`;
                 }).join('|');

                 nodes.push({
                     id: current.id, // ID must remain stable!
                     label: `${header}|${slots}`,
                     x,
                     y,
                     status: 'visited' // distinct style
                 });

                 current = current.overflow;
                 chainDepth++;
             }

             // Edges for old buckets
             current = bucket;
             while (current && current.overflow) {
                edges.push({
                    id: `e-${current.id}-${current.overflow.id}`,
                    source: current.id,
                    target: current.overflow.id,
                    status: 'default'
                });
                current = current.overflow;
            }
        });
    }

    return { nodes, edges, directed: true };
};

// --- Generator ---

export const goMapAlgorithm: AlgorithmGenerator<GraphData> = function* (initialData: GraphData, operation?: { type: 'insert' | 'delete' | 'search', value: { key: string, value: string } }) {
    let mapState: GoMapState;

    const metaNode = initialData.nodes.find(n => n.id === 'meta-state');
    if (metaNode && metaNode.label) {
         try {
             mapState = JSON.parse(metaNode.label);
         } catch {
             mapState = initializeMap();
         }
    } else {
        mapState = initializeMap();
    }

    const mainBuckets = initialData.nodes.filter(n => n.label?.includes('MAIN'));
    mainBuckets.sort((a, b) => {
        const idxA = parseInt(a.label!.split('|')[0].split(':')[1]);
        const idxB = parseInt(b.label!.split('|')[0].split(':')[1]);
        return idxA - idxB;
    });

    if (mainBuckets.length > 0) {
        const B = Math.log2(mainBuckets.length);
        mapState = {
            B,
            count: 0,
            buckets: new Array(1 << B).fill(null),
            oldbuckets: null,
            nevacuate: 0
        };

        const parseSlot = (s: string) => {
            if (s === 'EMPTY') return { k: null, v: null, th: null };
            const parts = s.split(':');
            return { th: parseInt(parts[0]), k: parts[1], v: parts[2] };
        };

        mainBuckets.forEach((node) => {
             const parts = node.label!.split('|');
             const header = parts[0].split(':');
             const idx = parseInt(header[1]);

             const bucket = createBucket(idx);
             bucket.id = node.id;

             for(let i=1; i<parts.length; i++) {
                 const slot = parseSlot(parts[i]);
                 bucket.tophash[i-1] = slot.th;
                 bucket.keys[i-1] = slot.k;
                 bucket.values[i-1] = slot.v;
                 if (slot.k !== null) mapState.count++;
             }

             mapState.buckets[idx] = bucket;

             let currentBucket = bucket;
             let nextEdge = initialData.edges.find(e => e.source === currentBucket.id);
             while(nextEdge) {
                 const targetNode = initialData.nodes.find(n => n.id === nextEdge!.target);
                 if (targetNode) {
                      const ovfParts = targetNode.label!.split('|');
                      const ovfBucket = createBucket(idx, true);
                      ovfBucket.id = targetNode.id;
                      for(let i=1; i<ovfParts.length; i++) {
                         const slot = parseSlot(ovfParts[i]);
                         ovfBucket.tophash[i-1] = slot.th;
                         ovfBucket.keys[i-1] = slot.k;
                         ovfBucket.values[i-1] = slot.v;
                         if (slot.k !== null) mapState.count++;
                      }
                      currentBucket.overflow = ovfBucket;
                      currentBucket = ovfBucket;
                      nextEdge = initialData.edges.find(e => e.source === currentBucket.id);
                 } else {
                     break;
                 }
             }
        });
    } else {
        mapState = initializeMap(2); // Default B=2 (4 buckets)
    }

    // --- Operations ---

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function* insert(key: string, value: string): Generator<any, any, any> {
        const hash = getHash(key);
        const bucketMask = (1 << mapState.B) - 1;
        const index = hash & bucketMask;
        const tophash = getTopHash(hash);

        yield {
            log: `Key "${key}" Hash=${hash}, Mask=${bucketMask}, Index=${index}, TopHash=${tophash}`,
            codeLabel: 'calc_hash',
            highlights: []
        };

        const bucket = mapState.buckets[index];
        let current: MapBucket | null = bucket;
        let found = false;

        yield { log: `Checking Bucket ${index}...`, codeLabel: 'search_bucket', highlights: [bucket.id] };

        while (current) {
            yield { log: `Scanning bucket ${current.id}...`, codeLabel: 'search_bucket', highlights: [current.id] };

            for (let i = 0; i < BUCKET_SIZE; i++) {
                if (current.tophash[i] === tophash) {
                    yield { log: `TopHash match at slot ${i}`, codeLabel: 'check_tophash', highlights: [current.id] };
                    if (current.keys[i] === key) {
                        yield { log: `Key match! Updating value.`, codeLabel: 'check_key', highlights: [current.id] };
                        current.values[i] = value;
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
            current = current.overflow;
        }

        if (found) return;

        yield { log: `Key not found. Finding empty slot...`, codeLabel: 'find_empty' };
        current = bucket;
        let inserted = false;

        while (current) {
             for (let i = 0; i < BUCKET_SIZE; i++) {
                 if (current.keys[i] === null) {
                     yield { log: `Found empty slot at ${i}`, codeLabel: 'insert_slot', highlights: [current.id] };
                     current.keys[i] = key;
                     current.values[i] = value;
                     current.tophash[i] = tophash;
                     mapState.count++;
                     inserted = true;
                     break;
                 }
             }
             if (inserted) break;

             if (!current.overflow) {
                 yield { log: `Bucket full. Creating overflow bucket.`, codeLabel: 'new_overflow', highlights: [current.id] };
                 const newBucket = createBucket(index, true);
                 current.overflow = newBucket;
             }
             current = current.overflow;
        }

        const loadFactor = mapState.count / (1 << mapState.B);
        if (loadFactor > LOAD_FACTOR_THRESHOLD) {
             yield { log: `Load Factor ${loadFactor.toFixed(2)} > ${LOAD_FACTOR_THRESHOLD}. Resizing...` };
             const oldBuckets = mapState.buckets;
             mapState.B++;
             mapState.buckets = new Array(1 << mapState.B).fill(null).map((_, i) => createBucket(i));
             mapState.count = 0;

             for(const b of oldBuckets) {
                 let curr: MapBucket | null = b;
                 while(curr) {
                     for(let i=0; i<BUCKET_SIZE; i++) {
                         if (curr.keys[i] !== null) {
                             const k = curr.keys[i]!;
                             const v = curr.values[i]!;
                             const h = getHash(k);
                             const idx = h & ((1 << mapState.B) - 1);
                             const top = getTopHash(h);

                             let target = mapState.buckets[idx];
                             while(true) {
                                 let spotFound = false;
                                 for(let j=0; j<BUCKET_SIZE; j++) {
                                     if (target.keys[j] === null) {
                                         target.keys[j] = k;
                                         target.values[j] = v;
                                         target.tophash[j] = top;
                                         mapState.count++;
                                         spotFound = true;
                                         break;
                                     }
                                 }
                                 if (spotFound) break;
                                 if (!target.overflow) target.overflow = createBucket(idx, true);
                                 target = target.overflow;
                             }
                         }
                     }
                     curr = curr.overflow;
                 }
             }
             yield { log: `Resized to 2^${mapState.B} buckets.`, state: toGraphData(mapState) };
        }
    }

    if (!operation) {
        yield {
            state: toGraphData(mapState),
            log: "Map initialized.",
            codeLabel: 'init_buckets'
        };
        return;
    }

    if (operation.type === 'insert') {
        const gen = insert(operation.value.key, operation.value.value);
        let res = gen.next();
        while(!res.done) {
            yield {
                state: toGraphData(mapState, res.value.highlights),
                log: res.value.log,
                codeLabel: res.value.codeLabel,
                highlightIndices: []
            };
            res = gen.next();
        }
        yield { state: toGraphData(mapState), log: `Inserted ${operation.value.key}` };
    }
};
