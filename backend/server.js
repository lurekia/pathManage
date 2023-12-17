import { data } from './data/graphData.js'
import { Graph, MultiGraph } from './graph/graph.js'
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());

const graphData = data;
const graph = new Graph(graphData.nodes, graphData.edges);
const n = graphData.nodes.length

const findEdge = (id1, id2) => {
    for (let i = 0; i < data.edges.length; i++) {
        if (data.edges[i].source == id1 && data.edges[i].target == id2) {
            return i;
        }
        if (data.edges[i].target == id1 && data.edges[i].source == id2) {
            return i;
        }
    }
    return 0;
}

// 定义路由
app.get('/', (req, res) => {
    res.send('Hello User!');
});

// 获取图信息
app.get('/graph/info', (req, res) => {
    const resData = {
        msg: '返回图信息',
        data: {
            nodes: graphData.nodes,
            edges: graphData.edges
        }
    }
    // console.log(resData.data.nodes);


    res.json(resData);
});
// 求解最短路
app.get('/graph/path_cost', (req, res) => {
    // 使用 req.params 获取 URL 中的参数
    const sourceId = req.query.sourceId;
    const targetId = req.query.targetId;
    const { dist, pre } = graph.SPFA_cost(sourceId);

    const source = graph.findNode(sourceId);
    const target = graph.findNode(targetId);
    // console.log(dist, pre, source, target);
    const path = [];
    let newNode = target;
    while (newNode != source) {
        let id = findEdge(data.nodes[pre[newNode]].id, data.nodes[newNode].id);
        id = data.edges[id].id;
        path.push(id);
        newNode = pre[newNode];
    }
    const resData = {
        msg: '返回图信息',
        data: {
            dist: dist[target],
            path
        }
    }


    res.json(resData);
});

// 求解最短路
app.get('/graph/path_time', (req, res) => {
    // 使用 req.params 获取 URL 中的参数
    const sourceId = req.query.sourceId;
    const targetId = req.query.targetId;
    const { dist, pre } = graph.SPFA_time(sourceId);

    const source = graph.findNode(sourceId);
    const target = graph.findNode(targetId);
    // console.log(dist, pre, source, target);
    const path = [];
    let newNode = target;
    while (newNode != source) {
        let id = findEdge(data.nodes[pre[newNode]].id, data.nodes[newNode].id);
        id = data.edges[id].id;
        path.push(id);
        newNode = pre[newNode];
    }
    const resData = {
        msg: '返回图信息',
        data: {
            dist: dist[target],
            path
        }
    }


    res.json(resData);
});
// 前3时间最短路
app.get('/graph/path_ktime', (req, res) => {
    // 使用 req.params 获取 URL 中的参数
    const sourceId = req.query.sourceId;
    const targetId = req.query.targetId;
    const { costs, paths } = graph.AStar(sourceId, targetId, 3);

    const ans = [];
    for (let i = 0; i < paths.length; i++) {
        const ans1 = [];
        for (let j = 0; j < paths[i].length - 1; j++) {
            let id = findEdge(data.nodes[paths[i][j]].id, data.nodes[paths[i][j+1]].id);
            id = data.edges[id].id;
            ans1.push(id);
        }
        ans.push(ans1);
    }
    const resData = {
        msg: '返回图信息',
        data: {
            costs,
            paths: ans
        }
    }


    res.json(resData);
});

// 求解最短路
app.get('/graph/path_dist', (req, res) => {
    // 使用 req.params 获取 URL 中的参数
    const sourceId = req.query.sourceId;
    const targetId = req.query.targetId;
    const { dist, pre } = graph.SPFA_dist(sourceId);

    const source = graph.findNode(sourceId);
    const target = graph.findNode(targetId);
    // console.log(dist, pre, source, target);
    const path = [];
    let newNode = target;
    while (newNode != source) {
        let id = findEdge(data.nodes[pre[newNode]].id, data.nodes[newNode].id);
        id = data.edges[id].id;
        path.push(id);
        newNode = pre[newNode];
    }
    const resData = {
        msg: '返回图信息',
        data: {
            dist: dist[target],
            path
        }
    }
    res.json(resData);
});

// 求解优惠政策最短路
app.get('/graph/path_multi_cost', (req, res) => {
    // 使用 req.params 获取 URL 中的参数
    const sourceId = req.query.sourceId;
    const targetId = req.query.targetId;
    const sourceIndex = graph.findNode(sourceId);
    const targetIndex = graph.findNode(targetId);
    const k = req.query.k;

    const mgraph = new MultiGraph(graphData.nodes, graphData.edges, k);
    const { dist, pre } = mgraph.SPFA(sourceIndex, targetIndex);
    console.log(dist, pre, sourceIndex, targetIndex);
    const path = []; // 普通路径
    const path_less = []; // 优惠路径 
    let newNode = targetIndex + k*n;
    while (newNode != sourceIndex) {
        let id = findEdge(data.nodes[pre[newNode]%n].id, data.nodes[newNode%n].id);
        id = data.edges[id].id;
        path.push(id);
        if (Math.floor(pre[newNode] / n) != Math.floor(newNode / n)) {
            path_less.push(id);
        }
        newNode = pre[newNode];
    }
    const resData = {
        msg: '返回图信息',
        data: {
            dist: dist[targetIndex + n*k],
            path,
            path_less
        }
    }
    res.json(resData);
});

const port = 11000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




