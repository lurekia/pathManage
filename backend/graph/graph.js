class MinHeap { // 小根堆
    constructor() {
        this.heap = [];
        // type: {
        //     index: int,
        //     cost: int,
        // }
    }

    // 获取父节点索引
    parent(u) {
        return Math.floor((u - 1) / 2);
    }

    // 获取左子节点索引
    lChild(u) {
        return 2 * u + 1;
    }

    // 获取右子节点索引
    rChild(u) {
        return 2 * u + 2;
    }

    // 交换两个元素
    swap(a, b) {
        const temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
    }

    // 向上调整堆，确保小根堆性质
    heapifyUp() {
        let currentIndex = this.heap.length - 1;

        while (
            currentIndex > 0 &&
            this.heap[currentIndex].cost < this.heap[this.parent(currentIndex)].cost
        ) {
            const parentIndex = this.parent(currentIndex);
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    // 向下调整堆，确保小根堆性质
    heapifyDown() {
        let currentIndex = 0;

        while (this.lChild(currentIndex) < this.heap.length) {
            const leftChildIndex = this.lChild(currentIndex);
            const rightChildIndex = this.rChild(currentIndex);
            let smallerChildIndex = leftChildIndex;

            if (
                rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex].cost < this.heap[leftChildIndex].cost
            ) {
                smallerChildIndex = rightChildIndex;
            }

            if (this.heap[currentIndex].cost < this.heap[smallerChildIndex].cost) {
                break;
            }

            this.swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
        }
    }

    // 插入元素
    push(value) {
        this.heap.push(value);
        this.heapifyUp();
    }

    // 删除堆顶元素（最小元素）
    pop() {
        if (this.heap.length === 0) {
            return null;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const minValue = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();

        return minValue;
    }

    // 获取堆顶元素（最小元素）
    top() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    // 获取堆的大小
    size() {
        return this.heap.length;
    }

    // 判断堆是否为空
    empty() {
        return this.heap.length === 0;
    }
}

export class Graph {
    constructor(nodes, edges) { // nodes 节点信息，edges 边信息
        this.nodes = [];
        nodes.forEach(node => this.addNode(node))
        this.edges = [];
        edges.forEach(edge => this.addEdge(edge))
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
        this.nodes.push({ ...node, firstArc: -1 });
    }

    addEdge(edge) {
        let sourceIndex = this.findNode(edge.source);
        let targetIndex = this.findNode(edge.target);
        // console.log('起点标号：',sourceIndex);
        let edge1 = {
            id: edge.id,
            to: targetIndex,
            data: edge.data,
            next: this.nodes[sourceIndex].firstArc,
        }
        this.nodes[sourceIndex].firstArc = this.edges.length;
        this.edges.push(edge1);

        let edge2 = {
            id: edge.id,
            to: sourceIndex,
            data: edge.data,
            next: this.nodes[targetIndex].firstArc,
        }
        this.nodes[targetIndex].firstArc = this.edges.length;
        this.edges.push(edge2);
    }

    SPFA_cost(startNodeId) {
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
                const v = this.edges[arc].to;
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
        // console.log(dist, pre);
        return { dist, pre };
    }

    SPFA_dist(startNodeId) {
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
                const v = this.edges[arc].to;
                const cost = this.edges[arc].data.dist;

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
        return { dist, pre };
    }

    SPFA_time(startNodeId) {
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
                const v = this.edges[arc].to;
                const cost = this.edges[arc].data.time;

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
        return { dist, pre };
    }

    AStar(startNodeId, targetNodeId, k) {
        let startIndex = this.findNode(startNodeId);
        let targetIndex = this.findNode(targetNodeId);
        const Infinity = 9999999.0;
        const data = this.SPFA_time(targetNodeId) // 获得估价函数
        const gx = data.dist
        // console.log(gx);
        let costs = [] // 前k短花费
        let paths = [] // 前k短路径

        const dist = new Array(this.nodes.length).fill(Infinity); // 最短距离
        const visit = new Array(this.nodes.length).fill(0) // 是否在队列中
        const pre = new Array(this.nodes.length).fill(-1) // 记录路径

        const q = new MinHeap();

        let count = 0; // 出队个数
        // 初始节点距离为0
        dist[startIndex] = 0;

        let temp = {
            index: startIndex,
            cost: dist[startIndex] + gx[startIndex],
            dist: dist[startIndex],
            path: [startIndex]
        }
        // 将起始节点放入队列
        q.push(temp);
        // 状态更新

        while (!q.empty()) {
            // 从队列中取出距离最小的节点
            const u = q.top().index;
            const val = q.top().cost;
            const distance = q.top().dist;
            const path = JSON.parse(JSON.stringify(q.top().path))
            q.pop();

            if (u == targetIndex) {
                costs.push(distance);
                paths.push(path);
                count++;
                if (count == k) {
                    break;
                }
            }

            // 更新相邻节点的距离  
            let arc = this.nodes[u].firstArc;
            while (arc != -1) {
                const v = this.edges[arc].to;
                const cost = this.edges[arc].data.time;
                path.push(v);
                // console.log(path);
                const temp2 = {
                    index: v,
                    cost: val + cost,
                    dist: distance + cost,
                    path: JSON.parse(JSON.stringify(path))
                }
                q.push(temp2);
                arc = this.edges[arc].next;
                path.pop();
            }
        }
        return { costs, paths }
    }
}



export class MultiGraph {
    constructor(nodes, edges, k) { // nodes 节点信息，edges 边信息
        this.k = k;
        this.nodes = [];
        this.edges = [];
        this.n = nodes.length;
        for (let i = 0; i <= k; i++) {
            for (let j = 0; j < this.n; j++) {
                this.addNode(nodes[j])
            }
        }

        for (let i = 0; i < edges.length; i++) {
            let sourceIndex = this.findNode(edges[i].source);
            let targetIndex = this.findNode(edges[i].target);
            for (let j = 0; j <= k; j++) {
                // 本层
                this.addEdge(sourceIndex + j * this.n, targetIndex + j * this.n, edges[i]);
                this.addEdge(targetIndex + j * this.n, sourceIndex + j * this.n, edges[i]);
                if (j == k)
                    break;
                // 使用优惠票
                const newEdge = {
                    id: edges[i].id,
                    source: edges[i].source,
                    target: edges[i].target,
                    data: {
                        cost: 0,
                    }
                };
                // 下层
                this.addEdge(sourceIndex + j * this.n, targetIndex + (j + 1) * this.n, newEdge);
                this.addEdge(targetIndex + j * this.n, sourceIndex + (j + 1) * this.n, newEdge);
            }
        }

    }

    findNode(id) {
        for (let i = 0; i < this.n; i++) {
            if (this.nodes[i].id == id) {
                return i;
            }
        }
        return 0;
    }

    addNode(node) {
        this.nodes.push({ ...node, firstArc: -1 });
    }

    addEdge(s, t, edge) {
        // console.log('起点标号：',sourceIndex);
        let edge1 = {
            id: edge.id,
            to: t,
            data: edge.data,
            next: this.nodes[s].firstArc,
        }

        this.nodes[s].firstArc = this.edges.length;
        this.edges.push(edge1);
    }

    SPFA(s, t) { // 起点终点
        const Infinity = 9999999;
        const dist = new Array(this.nodes.length).fill(Infinity); // 最短距离
        const visit = new Array(this.nodes.length).fill(0) // 是否在队列中
        const pre = new Array(this.nodes.length).fill(-1) // 是否在队列中

        const queue = [];
        // 初始节点距离为0
        dist[s] = 0;
        // 将起始节点放入队列
        queue.push(s);
        // 状态更新
        visit[s] = 1;

        while (queue.length > 0) {
            // 从队列中取出距离最小的节点
            const u = queue.shift();
            visit[u] = 0; // 出队列
            // 更新相邻节点的距离
            let arc = this.nodes[u].firstArc;
            while (arc != -1) {
                const v = this.edges[arc].to;
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
        return { dist, pre };
    }

}