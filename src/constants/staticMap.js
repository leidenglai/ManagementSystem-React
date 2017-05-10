// 货币
exports.CurrenciesData = [
  { key: "0", short: "EUR", name: "欧元" },
  { key: "1", short: "USD", name: "美元" }
];

// 语言
exports.LanguageData = [
  { key: "0", lang: "zh", short: "zh_CN", name: "中文" },
  { key: "1", lang: "en", short: "en_US", name: "英语" },
  { key: "2", lang: "es", short: "es_ES", name: "西语" },
  { key: "3", lang: "tr", short: "tr_TR", name: "土语" },
  { key: "4", lang: "ru", short: "ru_RU", name: "俄语" }
];

// 订单状态
exports.OrderStatus = {
  0: { type: 0, name: "未支付" },
  2: { type: 2, name: "已下单" },
  6: { type: 6, name: "已取消" }
};
