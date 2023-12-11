import * as d3 from "d3";
const fontSize = 10;
const symbolSize = 40;
const padding = 10;
export class Topo {
    constructor(svg, option) {
      this.data = option.data;
      this.edges = option.edges;
      this.svg = d3.select(svg);
    }

    //初始化节点位置
    initPosition () {
      let width = this.svg.attr('width');
      let height = this.svg.attr('height');
      let points = this.getVertices(this.data.length);
      this.data.forEach((item, i) => {
        item.x = points[i].x + width / 4;
        item.y = points[i].y + height / 9;
      })
    }

    //根据节点的个数，生成矩形阵列(即配置节点的摆放位置),返回的points为节点的定位坐标[{x:..,y:...},...]
    getVertices (n) {
      if (typeof n !== 'number') return;
      var i = 0;
      var j = 0;
      var k = 0
      var points = [];
      while (k < n) {
        points.push({
          x: 100 + 300 * i,
          y: 100 + 300 * j,
        });
        if (i < 2) {
          i++;
        } else {
          i = 0
          j++
        }
        k++
      }
      return points;
    }

    // 计算两点的中心点(用于确认摆放在连接线上的文字的位置)
    getCenter (x1, y1, x2, y2) {
      return [(x1 + x2) / 2, (y1 + y2) / 2]
    }

    // 计算两点角度
    getAngle (x1, y1, x2, y2) {
      var x = Math.abs(x1 - x2);
      var y = Math.abs(y1 - y2);
      var z = Math.sqrt(x * x + y * y);
      return Math.round((Math.asin(y / z) / Math.PI * 180));
    }

    // 初始化缩放器
    initZoom () {
      let self = this;
      let zoom = d3.zoom()
        .scaleExtent([0.7, 3])
        .on('zoom', function () {
          self.onZoom(this)
        });
      this.svg.call(zoom)
    }

    // 初始化图标库
    initDefineSymbol () {
      // defs用于预定义一个元素使其能够在SVG图像中重复使用，我们defs标签中的g元素必须在<g>元素上设置一个ID，通过ID来引用它。
      let defs = this.container.append('svg:defs');
      // 向defs中添加箭头图标
      defs
        .selectAll('marker')
        .data(this.edges)
        .enter()
        .append('svg:marker')
        .attr('id', (link, i) => 'marker-' + i)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', symbolSize / 2 + padding * 1.5)
        .attr('refY', 0)
        .attr('markerWidth', 14)
        .attr('markerHeight', 14)
        .attr('orient', 'auto')
        .attr('stroke-width', 2)
        .append('svg:path')
        .attr('d', 'M2,0 L0,-3 L9,0 L0,3 M2,0 L0,-3')
            .attr('class', 'arrow')
        
        
    }

    //初始化链接线
    initLink () {
      this.drawLinkLine();
      this.drawLinkText();
    }

    //初始化节点
    initNode () {
      var self = this;
      //节点容器
      this.nodes = this.container.selectAll(".node")
        .data(this.data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
          // 给每一个节点添加拖拽事件
          .on("drag", function (d) {
            self.onDrag(this, d)
          })
        )
        // 给每一个节点添加点击事件
        .on('click', function () {
          that.dialogVisible = true
        })
      //节点背景默认背景层
      this.nodes.append('circle')
        .attr('r', symbolSize / 1.5 + padding)
            .attr('class', 'node-bg').attr("opacity", "1");
        this.nodes.append("circle")
            .attr("r", symbolSize / 2)
            .attr("fill", '#fff')
            .attr('class', function (d) {
              return 'health' + d.health;
            })
            .attr('stroke-width', '5px')
      //节点标题
      this.drawNodeTitle();
    }
    //画节点标题
    drawNodeTitle () {
      //节点标题
      this.nodes.append("text")
        .attr('class', 'node-title')
        .text(function (d) {
          return d.name;
        })
        .attr("dy", symbolSize)
      // 处理节点图标中的百分比
    }

    // 画节点链接线
    drawLinkLine () {
      let data = this.data;
      if (this.lineGroup) {
        this.lineGroup.selectAll('.link')
          .attr(
            'd', link => genLinkPath(link),
          )
      } else {
        this.lineGroup = this.container.append('g')
        this.lineGroup.selectAll('.link')
          .data(this.edges)
          .enter()
          .append('path')
          .attr('class', 'link')
          .attr(
            'marker-end', (link, i) => 'url(#' + 'marker-' + i + ')'
          ).attr(
            'd', link => genLinkPath(link),
          ).attr(
            'id', (link, i) => 'link-' + i
          )
      }

      // 确认连接线的路径
      function genLinkPath (d) {
        let sx = data[d.source].x;
        let tx = data[d.target].x;
        let sy = data[d.source].y;
        let ty = data[d.target].y;
        return 'M' + sx + ',' + sy +
          ' L' + tx + ',' + ty
      }
    }

    //画节点链接线文字
    drawLinkText () {
      let data = this.data;
      let self = this;
      if (this.lineTextGroup) {
        this.lineTexts
          .attr('transform', getTransform)
      } else {
        this.lineTextGroup = this.container.append('g')

        this.lineTexts = this.lineTextGroup
          .selectAll('.linetext')
          .data(this.edges)
          .enter()
          .append('text')
          .attr('dy', -2)
          .attr('transform', getTransform)
          .on('click', () => { alert() })

        this.lineTexts
          .append('tspan')
          .text((d) => this.data[d.source].upwardText);

        this.lineTexts
          .append('tspan')
          .text((d) => this.data[d.source].underText)
          .attr('dy', '1em')
          .attr('dx', function () {
            return -this.getBBox().width / 2
          })
      }

      function getTransform (link) {
        let s = data[link.source];
        let t = data[link.target];
        let p = self.getCenter(s.x, s.y, t.x, t.y);
        let angle = self.getAngle(s.x, s.y, t.x, t.y);
        if (s.x > t.x && s.y < t.y || s.x < t.x && s.y > t.y) {
          angle = -angle
        }
        return 'translate(' + p[0] + ',' + p[1] + ') rotate(' + angle + ')'
      }
    }

    // 更新视图(图标位置和连接线)
    update () {
      this.drawLinkLine();
      this.drawLinkText();
    }

    //拖拽方法
    onDrag (ele, d) {
      console.log("触发拖拽onDrag",ele)
      d.x = d3.event.x;
      d.y = d3.event.y;
      d3.select(ele)
        .attr('transform', "translate(" + d3.event.x + "," + d3.event.y + ")")
      this.update();
    }

    //缩放方法
    onZoom (ele) {
      this.width = this.svg.attr('width');
      var transform = d3.zoomTransform(ele);
      this.scale = transform.k;
      // this.scale>1则为放大, <1为缩小
      this.container.attr('transform', "translate(" + transform.x + "," + transform.y + ")scale(" + transform.k + ")")
    }

    //主渲染方法
    render () {
      this.scale = 1;
      // 操作svg画布
      this.container = this.svg.append('g')
        .attr('transform', 'scale(' + this.scale + ')')

      // 执行类中定义的方法
      // 1.获取所有节点位置数据
      this.initPosition();
      // 2.初始化图标数据
      this.initDefineSymbol();
      // 3.初始化连接线的信息
      this.initLink();
      // 4.初始化节点
      this.initNode();
      // 5.初始化缩放
      this.initZoom();
    }
  }
