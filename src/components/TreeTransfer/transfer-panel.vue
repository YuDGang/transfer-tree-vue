<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      {{ title }}
    </p>

    <div
      :class="['el-transfer-panel__body', filterable ? 'is-filterable' : '']"
    >
      <el-input
        v-if="filterable && !isSearch"
        v-model="query"
        class="el-transfer-panel__filter"
        size="small"
      />
      <el-input
        v-else-if="isSearch"
        v-model="searchQuery"
        class="el-transfer-panel__filter"
        size="small"
      />
      <el-scrollbar
        :wrap-class="
          filterable
            ? 'el-transfer-scrollbar-filterable__wrap'
            : 'el-transfer-scrollbar__wrap'
        "
        view-class="el-transfer-scrollbar__view"
        is-small
      >
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="deptCode"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultExpandedKeys"
          :props="props"
          @check="onTreeCheck"
        />
      </el-scrollbar>
      <!-- 搜索无果 -->
      <p
        v-show="hasNoMatch"
        class="el-transfer-panel__empty"
      >
        暂无数据
      </p>
      <p
        v-show="data.length === 0 && !hasNoMatch"
        class="el-transfer-panel__empty"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ElTransferPanel",

  components: {},

  componentName: "ElTransferPanel",

  props: {
    data: {
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
    renderContent: {
      type: Function,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    filterable: {
      type: Boolean,
      default: null
    },
    filterPlaceholder: {
      type: String,
      default: ""
    },
    footerFormat: {
      type: [Object, Boolean],
      default: null
    },
    filterMethod: {
      type: Function,
      default: null
    },
    defaultChecked: {
      type: Array,
      default: null
    },
    props: {
      type: Object,
      default: null
    },
    panelAt: {
      type: String,
      default: null
    },
    searchPlaceholder: {
      type: String,
      default: ""
    },
    searchMethod: {
      type: Function,
      default: null
    },
    defaultExpandedKeys: Array
  },

  data () {
    return {
      allChecked: [],
      isIndeterminate: false,
      hasNoMatch: false,
      query: "",
      searchQuery: ""
    }
  },

  computed: {
    isSearch () {
      return this.panelAt === "left" && typeof this.searchMethod === "function"
    }
  },

  methods: {
    onTreeCheck (checked, checkedInfo, isChecked) {
      this.$emit("checked-change", checked, checkedInfo, isChecked)
    },

    filterNode (val, data) {
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.el-transfer-panel {
  width: calc(~"50% - 90px");
  height: 100%;
  min-height: 440px;
  &__body {
    height: 100%;
  }

  .el-transfer-panel__body.is-filterable .el-scrollbar {
    height: 390px;
  }

  // /deep/.el-checkbox__inner {
  //   position: absolute;
  //   top: 2px;
  //   width: 16px !important;
  //   height: 16px !important;
  // }
}
</style>
