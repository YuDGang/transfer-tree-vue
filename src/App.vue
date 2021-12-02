<template>
  <div id="app">
    <h3>Tree Transfer</h3>
    <tree-transfer
      ref="treeTransfer"
      :rightCode="codes"
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
import TreeTransfer from "./components/TreeTransfer/index.vue";

export default {
	name: "App",

	components: {
		TreeTransfer
	},

	data () {
		return {
			tree: [],
			codes: []
		};
	},

	created () {
		this.greTree();
	},

	methods: {
		onTransferChange (val) {
			console.log("val: ", val);
		},

		greTree () {
			const greTreeNodeChildren = (
				depth = 0,
				childNum = 1
			) => {
				const childrenData = Array(
					childNum
				)
					.fill(0)
					.map((_, idx) => {
						const suf =
							"-dep" +
							depth +
							"-idx" +
							idx.toString();
						return {
							deptCode:
								suf +
								"-ran" +
								Math.random(),
							depth: depth,
							label: "label" + suf,
							children: []
						};
					});

				return childrenData;
			};

			const greWholeTree = (
				{
					depth = 0,
					maxDepth = 1,
					childNum = 1
				},
				targetArr = []
			) => {
				targetArr.push(
					...greTreeNodeChildren(
						depth,
						childNum
					)
				);
				if (depth < maxDepth) {
					depth++;
					targetArr.forEach(item => {
						greWholeTree(
							{
								depth,
								maxDepth,
								childNum
							},
							item.children
						);
					});
				}
				return targetArr;
			};

			const treeArr = greWholeTree({
				maxDepth: 3,
				childNum: 5
			});
      this.tree = treeArr
		}
	}
};
</script>
