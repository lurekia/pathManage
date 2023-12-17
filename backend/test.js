// import { data } from './data/graphData.js'
import { Graph, MultiGraph } from './graph/graph.js'

const nodes = [
    {
        id: '0',
    },
    {
        id: '1',
    },
    {
        id: '2',
    },
    {
        id: '3',
    },
    {
        id: '4',
    }
]

const edges = [
    {
        id: '0',
        source: '0',
        target: '1',
        data: {
            cost: 5,
        }
    },
    {
        id: '1',
        source: '0',
        target: '3',
        data: {
            cost: 5,
        }
    },
    {
        id: '2',
        source: '0',
        target: '4',
        data: {
            cost: 5,
        }
    },
    {
        id: '3',
        source: '2',
        target: '4',
        data: {
            cost: 5,
        }
    },
    {
        id: '4',
        source: '2',
        target: '3',
        data: {
            cost: 3,
        }
    },
    {
        id: '5',
        source: '2',
        target: '1',
        data: {
            cost: 4,
        }
    },
]


// const G = new MultiGraph(nodes, edges, 1); // 1张优惠票

// const { dist, pre } = G.SPFA(0, 4);

// let ans = 9999999
// for (let i = 0; i <= G.k; i++)
//     if (dist[4 + G.n * i] < ans)
//         ans = dist[4 + G.n * i];

// console.log(ans, pre);
// console.log(G.nodes,G.edges);

const G = new Graph(nodes, edges);
// const { dist, pre } = G.SPFA_cost('0', '2')
const {costs, paths} = G.AStar('0', '2', 3)

console.log(costs, paths);





