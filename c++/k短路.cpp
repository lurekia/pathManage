#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <bits/stdc++.h>
using namespace std;
#define MAXNODE 64  //最大顶点数，顶点是字母，存储的是从大写字母A开始的64个字符
#define MAXEDGE 100 //最大边数
class EdgeNode
{ //图用邻接表存储，这是邻接表中的边表节点，类中成员均为pulic,便于访问和修改
public:
    EdgeNode(char to = 'Z', int weight = 1) : to(to), weight(weight) { next = NULL; }
    EdgeNode(const EdgeNode &en)
    {
        this->to = en.to;
        this->weight = en.weight;
        this->next = en.next;
    }
    EdgeNode &operator=(const EdgeNode &en)
    {
        this->to = en.to;
        this->weight = en.weight;
        this->next = en.next;
    }
    ~EdgeNode() {}
    char to;
    int weight;
    EdgeNode *next;
};
class VertexNode
{ //邻接表中的顶点表节点，所有成员均为public
public:
    VertexNode(char name = 'Z', EdgeNode *firstEdge = NULL) : name(name), firstEdge(firstEdge) {}
    char name;
    EdgeNode *firstEdge;
    ~VertexNode() {}
};
VertexNode vn[MAXNODE], vnr[MAXNODE]; //正图、反图，用正向和反向的邻接表表示
int dis[MAXNODE];                     //每个节点的dis值
int createGraph(int n, int m, int flag)
{ //构造图
    char from, to;
    int weight;
    for (int i = 0; i < m; i++)
    {
        cin >> from >> to >> weight;
        if (flag == 0)
        { //构造无向图，无向图中正图和反图是一样的

            if (vn[from - 65].name == 'Z')
                vn[from - 65].name = from;
            if (vn[to - 65].name == 'Z')
                vn[to - 65].name = to;
            EdgeNode *edge_new = new EdgeNode(to, weight);
            EdgeNode *p = vn[from - 65].firstEdge;
            if (vn[from - 65].firstEdge == NULL)
            {
                vn[from - 65].firstEdge = edge_new;
            }
            else
            {
                while (p->next != NULL)
                    p = p->next;
                p->next = edge_new; //一个边有两个边表节点， 添加第一个边表节点
            }
            EdgeNode *edge_new2 = new EdgeNode(from, weight);
            p = vn[to - 65].firstEdge;
            if (vn[to - 65].firstEdge == NULL)
                vn[to - 65].firstEdge = edge_new2;
            else
            {
                while (p->next != NULL)
                    p = p->next;
                p->next = edge_new2; //一条边有两个边表节点，添加第二个边表节点
            }
        }
        else
        { //有向图

            if (vn[from - 65].name == 'Z')
                vn[from - 65].name = from;
            if (vn[to - 65].name == 'Z')
                vn[to - 65].name = to; //这个点没有出边，这个点保存在数组里

            EdgeNode *edge_new = new EdgeNode(to, weight);
            EdgeNode *p = vn[from - 65].firstEdge;
            if (vn[from - 65].firstEdge == NULL)
                vn[from - 65].firstEdge = edge_new;
            else
            {
                while (p->next != NULL)
                    p = p->next;
                p->next = edge_new; //添加正图中的边表节点
            }

            if (vnr[to - 65].name == 'Z')
                vnr[to - 65].name = to;
            if (vnr[from - 65].name == 'Z')
                vnr[from - 65].name = from; //这个点没有出边，这个点要保>存在数组里

            EdgeNode *edge_new2 = new EdgeNode(from, weight);
            p = vnr[to - 65].firstEdge;
            if (vnr[to - 65].firstEdge == NULL)
                vnr[to - 65].firstEdge = edge_new2;
            else
            {
                while (p->next != NULL)
                    p = p->next;
                p->next = edge_new2; //添加反图中的边表节点
            }
        }
    }
    if (flag == 0)
        for (int i = 0; i < MAXNODE; i++) //无向图的复制
            vnr[i] = vn[i];

    return 1;
}

bool dijkstra(char from, char to) // dijkstra 求解dis值
{
    // V为顶点集，S为已求得最短距离的点的集合，T为余下点的集合，初始时，S={},T=V,T用带pair的vector实现，当T为空时，代表所有点均以到达集合S中，算法结束，当一个节点从集合T中迁移至S中时，这个顶点对应的距离值便是此节点到起点的最短距离值。

    long max = 1e8;
    char parent[MAXNODE]; //更新时记录每个节点的父节点，只有这个距离更新，此节点的父>节点才会更新
    for (int i = 0; i < MAXNODE; i++)
        parent[i] = 'Z';
    vector<pair<int, char>> queue; //不是优先级队列,第一个代表距离，第二个代表节点
    for (int i = 0; i < MAXNODE; i++)
    {
        if (vnr[i].name != 'Z')
        {
            if (vnr[i].name == to)
                queue.push_back(make_pair(0, vnr[i].name)); //起点的距离值为0
            else
                queue.push_back(make_pair(max, vnr[i].name)); //初始化其他点的距离>为max
        }
    }

    vector<pair<int, char>>::iterator it = queue.begin();
    while (!queue.empty())
    {
        sort(queue.begin(), queue.end()); //对剩余节点进行排序
        vector<pair<int, char>>::iterator tmp = queue.begin();
        if (dis[queue.begin()->second - 65] > queue.begin()->first)
            dis[queue.begin()->second - 65] = queue.begin()->first; //队首的距离值为最短的，而且要出队
        EdgeNode *p = vnr[tmp->second - 65].firstEdge;
        int d = tmp->first; //存储此节点出队的距离值
        while (p != NULL)
        {

            for (it = queue.begin() + 1; it != queue.end(); it++)
            {
                if (p->to == it->second) //在T中找到要更新的点
                {
                    if (d + p->weight < it->first)
                    { //需要更新,相等的话则不再更新,相等代表距离一样，但经过的顶点更多
                        it->first = d + p->weight;
                        parent[it->second - 65] = tmp->second; //更>新父节点
                    }

                    break;
                }
            }
            p = p->next;
        }
        queue.erase(queue.begin()); //删除起始节点
    }
    Edg
}
bool Astar(char from, char to, int k) // A star 求解K短路
{
    if (vn[from - 65].name == 'Z')
    {
        cout << "node doesn't exist" << endl;
        return 0;
    }
    int count = 0;                 //终点出现次数
    int i = 1, loc = 1;            //步数
    int fx[100], gx[100], hx[100]; // A star中的函数值,即扩展的节点序列，暂定100
    char node[100];                //存储节个序列中实际对应的每个节点
    int parent[100];               //每个序列的父节点
    for (int i = 0; i < 100; i++)
    {
        fx[i] = 0;
        gx[i] = 0;
        hx[i] = 0;
        node[i] = 'Z';
        parent[i] = 0;
    }
    //添加父节点
    priority_queue<pair<pair<int, int>, int>, vector<pair<pair<int, int>, int>>, greater<pair<pair<int, int>, int>>> q; //优先级队列，第一个int存储的是fx值，第二个存储的是gx值，第三个存储的是扩展的节点序列，满足当fx值相等时，则选择fx较小的
    gx[1] = 0;
    hx[1] = dis[from - 65];
    node[1] = from; //先将起点入队
    fx[1] = gx[1] + hx[1];
    parent[0] = -1; //便于沿着父节点数组一直找到起点
    parent[1] = 0;
    q.push(make_pair(make_pair(fx[1], gx[1]), 1));
    while (!q.empty())
    {
        pair<pair<int, int>, int> tmp = q.top();
        q.pop();
        if (node[tmp.second] == to)
        {                     //找到终点
            vector<char> vec; //用vector存储此条路径
            int now = tmp.second;
            while (parent[now] != -1)
            {
                vec.push_back(node[now]); //节点存入vector
                now = parent[now];        //找到父节点
            }
            EdgeNode *p = vn[node[tmp.second] - 65].firstEdge;
            while (p != NULL) //将子女节点入队
            {
                ++loc;
                gx[loc] = gx[tmp.second] + p->weight;
                node[loc] = p->to;
                parent[loc] = tmp.second;
                hx[loc] = dis[p->to - 65];
                fx[loc] = gx[loc] + hx[loc];
                q.push(make_pair(make_pair(fx[loc], gx[loc]), loc));
                p = p->next;
            }

            count++;
            if (count == k)
            {
                vector<char>::iterator it = vec.end() - 1;
                cout << "k=" << k << endl;
                for (it; it >= vec.begin(); it--)
                    cout << *it << "  ";        //输出节点序列
                cout << fx[tmp.second] << endl; //输出总的fx值
                break;                          //找到第K短路，退出
            }
        }
        else
        { //将当前节点的子女节点入队
            EdgeNode *p = vn[node[tmp.second] - 65].firstEdge;
            while (p != NULL)
            {
                ++loc;
                gx[loc] = gx[tmp.second] + p->weight;
                node[loc] = p->to;
                parent[loc] = tmp.second;
                hx[loc] = dis[p->to - 65];
                fx[loc] = gx[loc] + hx[loc];
                q.push(make_pair(make_pair(fx[loc], gx[loc]), loc));
                p = p->next;
            }
        }
    }
    return 1;
}

int main(void)
{
    memset(dis, 10000, sizeof(dis));
    int n, m;
    int flag = 0;          // 0代表无向图，1代表有向图
    cin >> n >> m >> flag; //输入顶点数、边数、属性
    createGraph(n, m, flag);
    char from, to;
    int k;
    cin >> from >> to >> k; //输入起点、终点和K
    dijkstra(from, to);
    Astar(from, to, k);
    exit(0);
}