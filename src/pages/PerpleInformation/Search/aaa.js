let showSearch = [
  {
    id: 1,
    label: '汉族',
    value: 1,
  },
  {
    id: 2,
    label: '壮族',
    value: 2,
  },
  {
    id: 3,
    label: '满族',
    value: 3,
  },
  {
    id: 4,
    label: '回族',
    value: 4,
  },
  {
    id: 5,
    label: '苗族',
    value: 5,
  },
  {
    id: 6,
    label: '维吾尔族',
    value: 6,
  },
  {
    id: 7,
    label: '土家族',
    value: 7,
  },
  {
    id: 8,
    label: '彝族',
    value: 8,
  },
  {
    id: 9,
    label: '蒙古族',
    value: 9,
  },
  {
    id: 10,
    label: '藏族',
    value: 10,
  },
  {
    id: 11,
    label: '布依族',
    value: 11,
  },
  {
    id: 12,
    label: '侗族',
    value: 12,
  },
  {
    id: 13,
    label: '瑶族',
    value: 13,
  },
  {
    id: 14,
    label: '朝鲜族',
    value: 14,
  },
  {
    id: 15,
    label: '白族',
    value: 15,
  },
  {
    id: 16,
    label: '哈尼族',
    value: 16,
  },
  {
    id: 17,
    label: '哈萨克族',
    value: 17,
  },
  {
    id: 18,
    label: '黎族',
    value: 18,
  },
  {
    id: 19,
    label: '傣族',
    value: 19,
  },
  {
    id: 20,
    label: '畲族',
    value: 20,
  },
  {
    id: 21,
    label: '傈僳族',
    value: 21,
  },
  {
    id: 22,
    label: '仡佬族',
    value: 22,
  },
  {
    id: 23,
    label: '东乡族',
    value: 23,
  },
  {
    id: 24,
    label: '高山族',
    value: 24,
  },
  {
    id: 25,
    label: '拉祜族',
    value: 25,
  },
  {
    id: 26,
    label: '水族',
    value: 26,
  },
  {
    id: 27,
    label: '佤族',
    value: 27,
  },
  {
    id: 28,
    label: '纳西族',
    value: 28,
  },
  {
    id: 29,
    label: '羌族',
    value: 29,
  },
  {
    id: 30,
    label: '土族',
    value: 30,
  },
  {
    id: 31,
    label: '仫佬族',
    value: 31,
  },
  {
    id: 32,
    label: '锡伯族',
    value: 32,
  },
  {
    id: 33,
    label: '柯尔克孜族',
    value: 33,
  },
  {
    id: 34,
    label: '达斡尔族',
    value: 34,
  },
  {
    id: 35,
    label: '景颇族',
    value: 35,
  },
  {
    id: 36,
    label: '毛南族',
    value: 36,
  },
  {
    id: 37,
    label: '撒拉族',
    value: 37,
  },
  {
    id: 38,
    label: '布朗族',
    value: 38,
  },
  {
    id: 39,
    label: '塔吉克族',
    value: 39,
  },
  {
    id: 40,
    label: '阿昌族',
    value: 40,
  },
  {
    id: 41,
    label: '普米族',
    value: 41,
  },
  {
    id: 42,
    label: '鄂温克族',
    value: 42,
  },
  {
    id: 43,
    label: '怒族',
    value: 43,
  },
  {
    id: 44,
    label: '京族',
    value: 44,
  },
  {
    id: 45,
    label: '基诺族',
    value: 45,
  },
  {
    id: 46,
    label: '德昂族',
    value: 46,
  },
  {
    id: 47,
    label: '保安族',
    value: 47,
  },
  {
    id: 48,
    label: '俄罗斯族',
    value: 48,
  },
  {
    id: 49,
    label: '裕固族',
    value: 49,
  },
  {
    id: 50,
    label: '乌孜别克族',
    value: 50,
  },
  {
    id: 51,
    label: '门巴族',
    value: 51,
  },
  {
    id: 52,
    label: '鄂伦春族',
    value: 52,
  },
  {
    id: 53,
    label: '独龙族',
    value: 53,
  },
  {
    id: 54,
    label: '塔塔尔族',
    value: 54,
  },
  {
    id: 55,
    label: '赫哲族',
    value: 55,
  },
  {
    id: 56,
    label: '珞巴族',
    value: 56,
  },
];

const data = showSearch.map((item) => {
  return {
    ...item,
    value: item.label,
  };
});

console.log('data', data);
