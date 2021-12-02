<template>
  <div id="app">
    <h3>Tree Transfer</h3>
    <tree-transfer
      ref="treeTransfer"
      :defaultRightCode="codes"
      :treeData="tree"
      :titles="['待选择', '已选择']"
      filterable
      :props="{
        label: 'label',
        key: 'deptCode',
      }"
      ownKey="deptCode"
      @change="onTransferChange"
    />
  </div>
</template>

<script>
import TreeTransfer from "./components/TreeTransfer/index.vue"
import constants from "./constants"

export default {
  name: "App",

  components: {
    TreeTransfer
  },

  data () {
    return {
      tree: [],
      codes: [
        "-dep2-idx0-ran0.0976371218823473",
        "-dep2-idx1-ran0.8893879805690843"
      ]
    }
  },

  created () {
    this.greTree()
  },

  methods: {
    onTransferChange (val) {
      console.log("val: ", val)
    },

    greTree () {
      // 节点
      const greNode = (labelId, depth, rank) => {
        const suf = labelId + "-dep" + depth + "-" + rank
        return {
          deptCode: suf,
          depth: depth,
          label: "label" + suf,
          children: []
        }
      }

      // 数组
      const greChild = (childNum, labelId, depth) => {
        return Array(childNum)
          .fill(0)
          .map((item, rank) => greNode(labelId, depth, rank))
      }

      // 递归
      const greTree = ({ maxDepth, childNum }, depth, targetArr, labelId) => {
        if (depth >= maxDepth) return
        depth++
        targetArr.push(...greChild(childNum, labelId, depth))
        targetArr.forEach((item) =>
          greTree({ maxDepth, childNum }, depth, item.children, labelId)
        )
      }

      // 初始
      const greWholeTree = ({ maxDepth = 1, childNum = 1 }) => {
        const depth = 1
        const targetArr = Array(childNum)
          .fill(0)
          .map((item, idx) => greNode(idx, depth, idx))

        targetArr.forEach((item, idx) =>
          greTree({ maxDepth, childNum }, depth, item.children, idx)
        )

        return targetArr
      }

      const treeArr = greWholeTree({
        maxDepth: 4,
        childNum: 5
      })
      this.tree = treeArr
    }
  }
}
</script>
