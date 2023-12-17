<template>
  <div class="page">
    <div id="container"></div>
    <div class="opt">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span v-if="isSearching === false">{{ selectedNode.label }}</span>
            <span v-else>推荐结果</span>
          </div>
        </template>
        <div class="text item" v-if="isSearching === false">
          {{ selectedNode.desc }}
        </div>
        <div class="text item" v-else-if="pathOption === '时间'">
          <div class="text item" v-for="(path, index) in paths" :key="index">
            <p>{{ path.desc }}</p>
            <el-button type="primary" @click="showPath(path.data)" size="small"
              >显示</el-button
            >
          </div>
        </div>
        <div class="text item" v-else>{{ rec_text }}</div>
      </el-card>
      <div class="buttons">
        <el-form :inline="true" :model="queryData" class="form">
          <el-form-item label="类型">
            <el-radio-group v-model="pathOption" style="margin-top: -5px">
              <el-radio label="距离" size="large">距离</el-radio>
              <el-radio label="花费" size="large">花费</el-radio>
              <el-radio label="时间" size="large">时间</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="优惠票">
            <el-input-number
              v-model="ticketNum"
              :min="0"
              :max="5"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="起点">
            <el-select
              v-model="queryData.sourceId"
              placeholder="请选择一个起点"
              clearable
            >
              <el-option
                v-for="(node, index) in data.nodes"
                :key="index"
                :label="node.label"
                :value="node.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="终点">
            <el-select
              v-model="queryData.targetId"
              placeholder="请选择一个终点"
              clearable
            >
              <el-option
                v-for="(node, index) in data.nodes"
                :key="index"
                :label="node.label"
                :value="node.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">推荐</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { data } from "../jsondata/topo";
import G6 from "@antv/g6";
import { onMounted, ref, computed } from "vue";
import {
  getGraphInfo,
  getPathByCost,
  getPathByCostWithTicket,
  getPathByTime,
  getPathByDist,
} from "../api/graph.js";
let data = {};
let renderData = {};
const isSearching = ref(true);
const searchReturn = ref("");
const pathOption = ref("距离");
const ticketNum = ref(0);
const rec_text = ref("");
const paths = ref([]);
let graph = null;
const findNodeLabel = (id) => {
  return data.nodes.filter((item) => item.id == id)[0].label;
};
const findEdgeLabel = (id) => {
  const edge = data.edges.filter((item) => item.id == id)[0];
  return [findNodeLabel(edge.source), findNodeLabel(edge.target)];
};

const showPath = (path) => {
  // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      path.forEach((edge) => {
        graph.setItemState(edge, "click", true); // 设置当前边的 click 状态为 true
      });
}

const initG6 = () => {
  const grid = new G6.Grid();
  graph = new G6.Graph({
    container: "container", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 700, // Number，必须，图的宽度
    height: 550, // Number，必须，图的高度
    // fitView: true,
    // fitViewPadding: [20, 40, 50, 20],
    modes: {
      default: [
        "drag-canvas",
        "zoom-canvas",
        "drag-node",
        "click-select",
        {
          type: "edge-tooltip", // 边提示框
          formatText(model) {
            // 边提示框文本内容
            console.log(model);
            let thisEdge = null;
            data.edges.forEach((edge) => {
              if (edge.id == model.id) {
                thisEdge = edge;
              }
            });
            let s = findNodeLabel(thisEdge.source);
            let t = findNodeLabel(thisEdge.target);
            const text =
              "起点: " +
              s +
              "<br/> 终点: " +
              t +
              "<br/> 花费: " +
              thisEdge.data.cost +
              "元<br/> 距离: " +
              thisEdge.data.dist +
              "公里<br/> 时间: " +
              thisEdge.data.time +
              "小时";
            return text;
          },
        },
      ], // 允许拖拽画布、放缩画布、拖拽节点、点选节点
    },
    // layout: {
    //   type: "fruchterman",
    //   gravity: 5,
    //   speed: 5,
    //   // for rendering after each iteration
    //   tick: () => {
    //     graph.refreshPositions();
    //   },
    // },
    defaultNode: {
      size: 40, // 节点大小
      // ...                 // 节点的其他配置
      // 节点样式配置
      style: {
        fill: "steelblue", // 节点填充色
        stroke: "#666", // 节点描边色
        lineWidth: 1, // 节点描边粗细
      },
      // 节点上的标签文本配置
      labelCfg: {
        // 节点上的标签文本样式配置
        style: {
          fill: "#fff", // 节点标签文字颜色
        },
      },
    },
    // 边在默认状态下的样式配置（style）和其他配置
    defaultEdge: {
      // 边样式配置
      style: {
        // endArrow: true,
        opacity: 0.6, // 边透明度
        stroke: "grey", // 边描边颜色
      },
      // 边上的标签文本配置
      labelCfg: {
        style: {
          size: 12,
        },
        autoRotate: true, // 边上的标签文本根据边的方向旋转
      },
    },
    nodeStateStyles: {
      // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
      hover: {
        fill: "lightsteelblue",
      },
      // 鼠标点击节点，即 click 状态为 true 时的样式
      click: {
        stroke: "#000",
        lineWidth: 1,
      },
    },
    // 边不同状态下的样式集合
    edgeStateStyles: {
      // 鼠标点击边，即 click 状态为 true 时的样式
      click: {
        stroke: "pink",
        lineWidth: 3,
      },
    },
  });
  // 鼠标进入节点
  graph.on("node:mouseenter", (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
  });

  // 鼠标离开节点
  graph.on("node:mouseleave", (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
  });
  // 节点上的点击事件
  graph.on("node:click", (event) => {
    const itemId = event.item._cfg.id;
    data.nodes.forEach((node) => {
      if (node.id == itemId) {
        selectedNode.value = node;
      }
    });
    isSearching.value = false;
    console.log(itemId);
    console.log(event.x, event.y);
  });
  // 边上的点击事件
  graph.on("edge:click", (event) => {});

  getGraphInfo().then((res) => {
    // console.log(res.data);
    data = res.data.data;
    console.log(data);
    rendG6();
  });
};

const rendG6 = () => {
  renderData = {
    nodes: [],
    edges: [],
  };
  console.log(data);
  data.nodes.forEach((node) => {
    renderData.nodes.push({
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
    });
  });
  data.edges.forEach((edge) => {
    renderData.edges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      // label: edge.data.cost,
    });
  });
  graph.data(renderData); //数据源到图上
  graph.render(); // 渲染图
};

const queryData = ref({
  sourceId: "",
  targetId: "",
});
const onSubmit = () => {
  let dist = 0;
  if (!queryData.value.sourceId || !queryData.value.targetId) {
    ElMessage("起点，终点不能为空");
    reutrn;
  }
  isSearching.value = true;
  if (pathOption.value == "距离") {
    getPathByDist({
      sourceId: queryData.value.sourceId,
      targetId: queryData.value.targetId,
    }).then((res) => {
      rec_text.value =
        "路径长度为：" + res.data.data.dist + "公里，推荐理由：距离最短。";
      const data = res.data.data.path;
      console.log(data);

      // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      data.forEach((edge) => {
        graph.setItemState(edge, "click", true); // 设置当前边的 click 状态为 true
      });
    });
  }

  if (pathOption.value == "花费") {
    if (ticketNum.value == 0) {
      getPathByCost({
        sourceId: queryData.value.sourceId,
        targetId: queryData.value.targetId,
      }).then((res) => {
        rec_text.value =
          "路径花费为：" + res.data.data.dist + "元，推荐理由：花费最小。";

        const data = res.data.data.path; // 路径

        // console.log(data);

        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = graph.findAllByState("edge", "click");
        clickEdges.forEach((ce) => {
          graph.setItemState(ce, "click", false);
        });
        data.forEach((edge) => {
          graph.setItemState(edge, "click", true); // 设置当前边的 click 状态为 true
        });
      });
    } else {
      getPathByCostWithTicket({
        sourceId: queryData.value.sourceId,
        targetId: queryData.value.targetId,
        k: ticketNum.value,
      }).then((res) => {
        rec_text.value =
          "路径花费为：" + res.data.data.dist + "元，推荐理由：花费最小。";

        const data = res.data.data.path;
        const ticket = res.data.data.path_less;
        rec_text.value += "优惠路线为:";
        ticket.forEach((item) => {
          rec_text.value +=
            findEdgeLabel(item)[0] + "->" + findEdgeLabel(item)[1] + "   ";
        });
        console.log(ticket);
        // console.log(data);

        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = graph.findAllByState("edge", "click");
        clickEdges.forEach((ce) => {
          graph.setItemState(ce, "click", false);
        });
        data.forEach((edge) => {
          graph.setItemState(edge, "click", true); // 设置当前边的 click 状态为 true
        });
      });
    }
  }

  if (pathOption.value == "时间") {
    getPathByTime({
      sourceId: queryData.value.sourceId,
      targetId: queryData.value.targetId,
    }).then((res) => {
      const data = res.data.data;
      console.log(data);
      paths.value = [];
      for (let i = 0; i < data.paths.length; i++) {
        const path = {
          desc: "",
          data: data.paths[i]
        };
        path.desc += "方案" + (i + 1) + "为：";
        let last_loc = findNodeLabel(queryData.value.sourceId);
        path.desc += last_loc;
        // console.log(last_loc);

        for (let j = 0; j < data.paths[i].length; j++) {
          const edgeLabel = findEdgeLabel(data.paths[i][j]);
          if (edgeLabel[0] == last_loc) {
            last_loc = edgeLabel[1];
          } else {
            last_loc = edgeLabel[0];
          }
          path.desc += "->" + last_loc;
        }
        path.desc += "  。预计耗时：" + data.costs[i] + "小时";
        paths.value.push(path);
      }
    });
  }
};

const selectedNode = ref({
  id: "-1",
  label: "",
  desc: "",
});

onMounted(() => {
  initG6();
});
</script>
<style lang="scss" scoped>
#container {
  width: 700px;
  height: 550px;
  // background-color: #ceb8b8;
  border: 1px solid #000;
  border-radius: 20px;
  margin-left: 50px;
  background: url("@/src/static/map.jpg");
  // background-color: rgba(236, 238, 247, 0.7);
}
.page {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin: 0;
  width: 100vw;
  height: 100vh;
}
.opt {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;
  // background-color: pink;
}
.box-card {
  margin-top: 50px;
  width: 300px;
  // height: 250px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.buttons {
  padding: 20px;
  margin-top: 10px;
  width: 300px;
  height: 150px;
  // background-color: pink;
}
.form {
  width: 100%;
  height: 100%;
}
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>
