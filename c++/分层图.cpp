#include <bits/stdc++.h>
using namespace std;
#define Z 200000
int read()
{
	int s = 0, f = 1;
	char ch = getchar();
	for (; !isdigit(ch); ch = getchar())
		if (ch == '-')
			f = -1;
	for (; isdigit(ch); ch = getchar())
		s = s * 10 + ch - '0';
	return s * f;
}
struct node
{
	int to, val;
	node(int st, int sv)
	{
		to = st;
		val = sv;
	}
	node()
	{
	}
	bool operator<(const node &a) const
	{
		return val > a.val;
	}
};
vector<node> E[Z];
int n, m, k, s, t;

void init()
{
	n = read();
	m = read();
	k = read();
	s = read();
	t = read();
	for (int j = 1; j <= m; j++)
	{
		int a, b, c;
		a = read();
		b = read();
		c = read();
		for (int i = 0; i <= k; i++)
		{
			E[a + i * n].push_back(node(b + i * n, c));
			E[b + i * n].push_back(node(a + i * n, c));
		}
		for (int i = 1; i <= k; i++)
		{
			E[a + (i - 1) * n].push_back(node(b + i * n, 0));
			E[b + (i - 1) * n].push_back(node(a + i * n, 0));
		}
	}
}
int dist[Z];
bool vis[Z];
void dij(int s)
{
	memset(dist, 0x3f, sizeof(dist));
	priority_queue<node> q;
	dist[s] = 0;
	q.push(node(s, dist[s]));
	while (!q.empty())
	{
		int u = q.top().to;
		q.pop();
		if (vis[u])
			continue;
		vis[u] = true;
		for (int j = 0; j < E[u].size(); j++)
		{
			int v = E[u][j].to;
			int val = E[u][j].val;
			if (dist[v] > dist[u] + val)
			{
				dist[v] = dist[u] + val;
				q.push(node(v, dist[v]));
			}
		}
	}
}
void solution()
{
	init();
	dij(s);
	int ans = 0x3f3f3f3f;
	for (int j = 0; j <= k; j++)
		ans = min(ans, dist[t + n * j]);
	printf("%d\n", ans);
}
int main()
{
	solution();
	return 0;
}