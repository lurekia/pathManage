export class Graph {
    constructor(nodes, edges) { // nodes 节点信息，edges 边信息
        this.nodes = [];
        nodes.forEach(node => this.addNode(node))
        this.edges = [];
        this.edgeNum = 0;
        edges.forEach(edge => this.addEdge(edge))
        // console.log(this.nodes);

        // console.log(this.edges);
    }

    findNode(id) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id == id) {
                return i;
            }
        }
        return 0;
    }

    addNode(node) {
        this.nodes.push({ ...node, firstArc: -1});
    }

    addEdge(edge) {
        let sourceIndex = this.findNode(edge.source);
        let targetIndex = this.findNode(edge.target);
        // console.log('起点标号：',sourceIndex);
        let edge1 = {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            data: edge.data,
            next: this.nodes[sourceIndex].firstArc,
        }
        let edge2 = {
            id: edge.id,
            source: edge.target,
            target: edge.source,
            data: edge.data,
            next: this.nodes[targetIndex].firstArc,
        }
        this.nodes[sourceIndex].firstArc = this.edgeNum;
        this.edges.push(edge1);
        this.edgeNum++;

        this.nodes[targetIndex].firstArc = this.edgeNum;
        this.edges.push(edge2);
        this.edgeNum++;
    }

    SPFA(startNodeId) { 
        const Infinity = 9999999;
        const dist = new Array(this.nodes.length).fill(Infinity); // 最短距离
        const visit = new Array(this.nodes.length).fill(0) // 是否在队列中
        const pre = new Array(this.nodes.length).fill(-1) // 是否在队列中

        const queue = [];

        let startIndex = this.findNode(startNodeId);
        // 初始节点距离为0
        dist[startIndex] = 0;
        // 将起始节点放入队列
        queue.push(startIndex);
        // 状态更新
        visit[startIndex] = 1;

        while (queue.length > 0) {
            // 从队列中取出距离最小的节点
            const u = queue.shift();
            visit[u] = 0; // 出队列
            // 更新相邻节点的距离
            let arc = this.nodes[u].firstArc;
            while (arc != -1) {
                const v = this.findNode(this.edges[arc].target);
                const cost = this.edges[arc].data.cost;

                if (dist[u] + cost < dist[v]) {
                    dist[v] = dist[u] + cost;
                    pre[v] = u;
                    if (!visit[v]) {
                        queue.push(v);
                        visit[v] = 1;
                    }
                }
                arc = this.edges[arc].next;
            }
        }
        return {dist, pre};
    }
}

