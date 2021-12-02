<!--
 * @ Author: 梁洪刚
 * @ Description: 树穿梭框
-->

<template>
  <div class="el-transfer">
    <!-- left -->
    <transfer-panel
      ref="leftPanel"
      v-bind="$props"
      :treeData="treeDataLeft"
      :title="titles[0]"
      :default-checked="leftDefaultChecked"
      :default-expanded-keys="expandedKeys_left"
      panel-at="left"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer" />
    </transfer-panel>

    <!-- mid -->
    <div class="el-transfer__buttons">
      <el-button
        :disabled="checked_left.length === 0"
        class="el-transfer__button"
        @click.native="addToRight"
      >
        <span v-if="buttonTexts[1] !== undefined">
          {{ buttonTexts[1] }}
        </span>
        <i class="h-icon-angle_right" />
      </el-button>
      <el-button
        :disabled="checked_right.length === 0"
        class="el-transfer__button"
        @click.native="addToLeft"
      >
        <i class="h-icon-angle_left" />
        <span v-if="buttonTexts[0] !== undefined">
          {{ buttonTexts[0] }}
        </span>
      </el-button>
    </div>

    <!-- right -->
    <transfer-panel
      ref="rightPanel"
      v-bind="{ ...$props, ...$data }"
      :treeData="treeDataRight"
      :title="titles[1]"
      :default-checked="rightDefaultChecked"
      :default-expanded-keys="expandedKeys_right"
      panel-at="right"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer" />
    </transfer-panel>
  </div>
</template>

<script>
import TransferPanel from "./transfer-panel.vue"

export default {
  components: {
    TransferPanel
  },

  props: {
    defaultRightCode: {
      type: Array,
      default () {
        return []
      }
    },
    treeData: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    buttonTexts: {
      type: Array,
      default () {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ""
    },
    filterMethod: {
      type: Function,
      default: null
    },
    leftDefaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    renderContent: {
      type: Function,
      default: null
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    footerFormat: {
      type: [Object, Boolean],
      default () {
        return {}
      }
    },
    filterable: {
      type: Boolean,
      default: null
    },
    props: {
      type: Object,
      default () {
        return {
          label: "label",
          key: "key",
          disabled: "disabled"
        }
      }
    },
    ownKey: {
      type: String,
      default: "deptCode"
    },
    searchPlaceholder: {
      type: String,
      default: ""
    },
    searchMethod: {
      type: Function,
      default: null
    },
    beforeAddToRight: {
      type: Function,
      default: () => new Promise((resolve) => resolve())
    },
    beforeAddToLeft: {
      type: Function,
      default: () => new Promise((resolve) => resolve())
    }
  },

  data () {
    return {
      checked_left: [],
      checked_right: [],
      halfChecked_left: [],
      halfChecked_right: [],

      treeCode_left: [],
      treeCode_right: [],

      expandedKeys_left: [],
      expandedKeys_right: [],

      outputData: []
    }
  },

  computed: {
    treeDataLeft () {
      return this.getTreeData(this.treeCode_left)
      // return []
    },

    treeDataRight () {
      return this.getTreeData(this.treeCode_right)
    }
  },

  watch: {
    treeData: {
      handler () {
        const paths = this.findAllPaths(this.treeData, this.defaultRightCode)
        // left
        this.addCode(this.treeData, this.treeCode_left)
        this.treeCode_left = this.treeCode_left.filter(
          (code) => !this.defaultRightCode.includes(code)
        )
        // right
        this.treeCode_right = [...this.defaultRightCode, ...paths]
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // # utils
    // 访问器
    forEachTreeNode (tree, callback) {
      if (!tree && typeof tree !== "object") return

      const loop = (treeArr = [], parent, path = []) => {
        if (parent) path.push(parent[this.ownKey])
        treeArr.forEach((item, idx, children) => {
          callback(item, idx, children, path)
          if (item.children) loop(item.children, item, [...path])
        })
      }
      // 数组 or 对象
      tree.length
        ? loop(tree, null)
        : (callback(tree, null, null, null), loop(tree.children, tree))
    },

    // 过滤器
    filterTreeNode (_tree, callback) {
      if (!_tree && typeof _tree !== "object") return

      let tree = JSON.parse(JSON.stringify(_tree))

      const loop = (treeObj) => {
        treeObj.children = (treeObj.children || []).filter(callback)
        treeObj.children.forEach((obj) => loop(obj))
      }
      // 数组 or 对象
      tree = tree.length ? { children: tree } : tree

      loop(tree)

      return tree.children
    },

    // 寻找所有父级路径 集合
    findAllPaths (_tree, codes) {
      const allPath = []
      this.forEachTreeNode(_tree, (item, idx, children, path) => {
        if (codes.includes(item[this.ownKey])) {
          allPath.push(...path)
        }
      })
      return Array.from(new Set(allPath))
    },

    // 递归 并根据所选则的树 新增code
    addCode (checkedTree, codeArr) {
      this.forEachTreeNode(checkedTree, (item) => {
        codeArr.push(item[this.ownKey])
      })
    },

    // 递归 并获取所需data (left or right)
    getTreeData (targetCode) {
      const treeData = this.filterTreeNode(this.treeData, (item) =>
        targetCode.includes(item[this.ownKey])
      )

      return treeData
    },

    // 移动code
    moveCode (source, target, codeArr, halfCodeArr) {
      target.push(...codeArr)
      target.push(...halfCodeArr)
      const codeAfterMove = source.filter((item) => !codeArr.includes(item))
      source.length = 0
      source.push(...codeAfterMove)
    },

    // # use for components
    onSourceCheckedChange (checkedNodes, { checkedKeys, halfCheckedKeys }) {
      this.checked_left = [...checkedKeys]
      this.halfChecked_left = [...halfCheckedKeys]
    },

    onTargetCheckedChange (checkedNodes, { checkedKeys, halfCheckedKeys }) {
      this.checked_right = [...checkedKeys]
      this.halfChecked_right = [...halfCheckedKeys]
    },

    addToRight () {
      this.outputData = this.checked_left
      this.$emit("change", this.outputData)

      const expandedCodes = [this.checked_left[0]]

      this.moveCode(
        this.treeCode_left,
        this.treeCode_right,
        this.checked_left,
        this.halfChecked_left
      )
      this.checked_left = []

      this.$nextTick(() => {
        this.expandedKeys_right = expandedCodes
        this.expandedKeys_left = expandedCodes
      })
    },

    addToLeft () {
      this.outputData = this.outputData.filter(
        (data) => !this.checked_right.includes(data[this.ownKey])
      )

      this.$emit("change", this.outputData)

      this.moveCode(
        this.treeCode_right,
        this.treeCode_left,
        this.checked_right,
        this.halfChecked_right
      )
      this.checked_right = []
    },

    // # methods
    getRightData () {
      return this.treeDataRight
    }
  }
}
</script>

<style lang="less" scoped>
.el-transfer {
  min-height: 420px;
  height: 100%;
}
</style>
