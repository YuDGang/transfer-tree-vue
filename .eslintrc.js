module.exports = {
	env: {
		browser: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/essential",
		"plugin:vue/recommended", // 适用于 Vue.js 2.x，使用 recommended 规则。详见：https://eslint.vuejs.org/user-guide/#usage
		"plugin:vue/strongly-recommended",
	],
	// parserOptions: {
	// 	ecmaVersion: 12,
	// },
	// "plugins": [
	//   "vue"
	// ],
	rules: {
		"comma-dangle": 1, // 禁止尾随逗号
		semi: [1, "never"], // 禁止尾随分号
		"no-undef": 2,
		"no-unused-vars": 1, //此规则旨在消除未使用的变量、函数和函数参数。
		"no-sequences": 1, // 禁止使用逗号运算符
		"no-console": 1, // 禁止consoleLog
		"object-curly-spacing": [
			1,
			"always",
		], // 此规则在对象文字、解构赋值和导入/导出说明符的大括号内强制使用一致的间距。
		"space-before-function-paren": 1, // 函数名和空格的间隙
		"vue/attribute-hyphenation": 0, // 在模板中的自定义组件上强制执行属性命名样式
		"vue/no-template-shadow": 0, // 此规则旨在消除V-for指令或作用域中已存在的变量声明
		"vue/require-default-prop": 0, // 此规则要求为每个未标记为必需的prop设置默认值（布尔除外）
	},
};
