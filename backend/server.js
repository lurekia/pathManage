import { data } from './data/graphData.js'
import { Graph } from './graph/graph.js'
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());  

const graphData = data;
const graph = new Graph(graphData.nodes, graphData.edges);

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
    const { dist, pre } = graph.SPFA(sourceId);
    
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


const port = 11000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




