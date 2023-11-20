//配置参照 https://prettier.io/docs/en/options.html
module.exports = {
  width: 200, // 每行最大 200 字符
  bracketSameLine: false,
  bracketSpacing: true, // 大括号内的首尾需要空格
  tabWidth: 2, // 使用 2 个空格缩进
  useTabs: false, // 不使用缩进符，而使用空格
  semi: true, // 行尾需要有分号
  singleQuote: false, // 使用单引号
  quoteProps: "as-needed", // 对象的 key 仅在必要时用引号
  jsxSingleQuote: false, // jsx 不使用单引号，而使用双引号
  trailingComma: "all", // 末尾需要有逗号
  jsxBracketSameLine: false, // jsx 标签的反尖括号需要换行
  arrowParens: "always", // 单参数的箭头函数参数不需要括号
  requirePragma: false, // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  proseWrap: "preserve", // 当超出print width（上面有这个参数）时就折行
  htmlWhitespaceSensitivity: "ignore", // 根据显示样式决定 html 要不要折行
  endOfLine: "auto", // 保持现有的行尾
  singleAttributePerLine: true, // 单个属性换行
  vueIndentScriptAndStyle: false, // 在文件中不要缩进脚本和样式标记
};
