/*
 * 常量配置
 * 
 * @author: Ricky
 */

var DEBUG = true;

var MOCK = true;

var TIME_TYPE = {
    datasource: [
        {name: "全部", value: 1},
        {name: "自定义", value: 2}
    ],
    value: 1
};

var QUERY_RANGE = {
    range: {
        begin: new Date(2014, 0, 1),
        end: new Date()
    },
    valueAsObject: {
        begin: new Date(2014, 0, 1),
        end: new Date()
    }
};

var BIRTHDAY_RANGE = {
    begin: new Date(1900, 0, 1),
    end: new Date()
};

var CRF_RANGE = {
    begin: new Date(2012, 4, 1),
    end: new Date()
};

var PROGRESS_TYPE = {
    datasource: [
        {name: "不限制", value: 0},
        {name: "大于等于", value: 1},
        {name: "小于等于", value: 2}
    ],
    value: 0
};

var DEFAULT_OPTION = {
    datasource: [{name: "请选择", value: 0}],
    value: 0
};

var PAGE_SIZE = {
    datasource: [
        {name: "20", value: 20},
        {name: "50", value: 50},
        {name: "100", value: 100}
    ],
    value: 20
};

var NATION = [
    {value: 0, name: "请选择"},
    {value: 1, name: "汉"},
    {value: 2, name: "回族"},
    {value: 3, name: "满族"},
    {value: 4, name: "壮族"},
    {value: 5, name: "其他"}
];

var DRUG_TYPE = {
    datasource: [
        {name: "请选择", value: 0},
        {name: "抗生素类", value: 1},
        {name: "中药注射液", value: 2},
        {name: "其他", value: 3}
    ],
    value: 0
};

var GXB_LEVEL = {
    datasource: [
        {name: "请选择", value: 0},
        {name: "I", value: 1},
        {name: "II", value: 2},
        {name: "III", value: 3},
        {name: "IV", value: 4}
    ],
    value: 0
};

var GXY_LEVEL = {
    datasource: [
        {name: "请选择", value: 0},
        {name: "1级", value: 1},
        {name: "2级", value: 2},
        {name: "3级", value: 3},
        {name: "单纯收缩期", value: 4},
        {name: "不详", value: 5}
    ],
    value: 0
};

var TNB_Type = {
    datasource: [
        {name: "请选择", value: 0},
        {name: "I型", value: 1},
        {name: "II型", value: 2},
        {name: "不详", value: 3}
    ],
    value: 0
};

var CRF_MENU = [
    {
        name: "患者信息",
        children: [
            {name: "基本情况", id: 11},
            {name: "个人史 + 过敏史", id: 12},
            {name: "既往史", id: 13}
        ]
    },
    {name: "病症情况", id: 20},
    {name: "用药情况", id: 30},
    {name: "合并用药", id: 40},
    {
        name: "辅助检查",
        children: [
            {name: "体格检查", id: 51},
            {name: "实验室检查", id: 52},
            {name: "心电图", id: 53}
        ]
    },
    {name: "用药小结", id: 60},
    {name: "ADE", id: 70}
];

var STAT_MENU = [
    {
        name: "总量统计",
        children: [
            {name: "医院统计", id: 1},
            {name: "年龄统计", id: 2},
            {name: "性别统计", id: 3},
            {name: "ADE", id: 4}
        ]
    }
];
