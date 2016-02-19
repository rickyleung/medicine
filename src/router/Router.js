/*
 * 名字空间(es: evaluation system)
 * 
 * @author: Ricky
 */

es.Router = Backbone.Router.extend({
    routes: {
        ""                    : "index",
        "index/*query"        : "index",
        "crf/update/*query"   : "crf",
        "crf/updateadr/*query": "crf",
        "crf/doubt/*query"    : "crf",
        "crf/doubtadr/*query" : "crf",
        "list/*query"         : "list",
        "supervise/*query"    : "supervise",
        "dict/*query"         : "dict",
        "upload/*query"       : "upload",
        "stat/*query"         : "stat",
        "data/*query"         : "data",
        "account/*query"      : "account"
    },
    
    /*
     * 初始化
     */
    initialize: function() {},
    
    /*
     * 开始路由
     * @param {String} title 网页标题
     * @param {String} name  模块名称
     * @param {String} query 参数
     */
    startRout: function(title, name, query) {
        //销毁当前View
        es.main && es.main.destroy && es.main.destroy();
        
        //设置标题
        document.title = "痰热清上市后再评价的真实世界研究信息系统 - " + title;
        
        //创建新View
        es.main = new es.Views[name]({
            model: new es.Models[name]
        });
        
        //渲染
        es.main.render(typeof query == "undefined" ? "" : query);
    },
    
    index: function(query) {
        this.startRout("首页", "Index", query);
    },
    
    crf: function(query) {
        this.startRout("CRF", "CRF", query);
    },
    
    list: function(query) {
        this.startRout("观察表", "List", query);
    },
    
    supervise: function(query) {
        this.startRout("数据监察", "Supervise", query);
    },
    
    dict: function(query) {
        this.startRout("数据字典", "Dict", query);
    },
    
    upload: function(query) {
        this.startRout("图片上传", "Upload", query);
    },
    
    stat: function(query) {
        this.startRout("全局统计", "Stat", query);
    },
    
    data: function(query) {
        this.startRout("数据管理", "Data", query);
    },
    
    account: function(query) {
        this.startRout("账户管理", "Account", query);
    }
});
