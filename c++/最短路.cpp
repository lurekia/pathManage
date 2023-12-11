#include<bits/stdc++.h>
using namespace std;
#define Z 200000
int read()
{
	int s=0,f=1;
	char ch=getchar();
	while(ch<'0' || ch>'9')
	{
		if(ch=='-')
			f=-1;
		ch=getchar();
	}
	while(ch>='0'&&ch<='9')
	{
		s=s*10+ch-'0';
		ch=getchar();
	}
	return s*f;
}
struct node{
	int to;
	int val;
	node(int st,int sv)
	{
		to=st;
		val=sv;
	}
	node()
	{
	}
	bool operator < (const node &other)const
	{
		return val>other.val;
	}
};
vector <node> E[Z];
int dist[Z];
bool vis[Z];
priority_queue <node> q;
void dij(int s)
{
	memset(dist,0x3f,sizeof(dist));
	dist[s]=0;
	q.push(node(s,0));
	while(!q.empty())
	{
		int u=q.top().to;
		q.pop();
		if(vis[u])
			continue;
		vis[u]=true;
		for(int j=0;j<E[u].size();j++)
		{
			int v=E[u][j].to;
			int val=E[u][j].val;
			if(dist[v] > dist[u]+val)
			{
				dist[v]=dist[u]+val;
				q.push(node(v,dist[v]));
			}
		}
		
	}
}
int n,m,s;
void init()
{
	n=read();
	m=read();
	s=read();
	for(int j=1;j<=m;j++)
	{
		int a=read();
		int b=read();
		int c=read();
		E[a].push_back(node(b,c));
	}
}
void solution()
{
	init();
	dij(s);
	for(int j=1;j<=n;j++)
		printf("%d ",dist[j]);
}

int main()
{
	solution();
	return 0;
}