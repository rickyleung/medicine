/*
 * 名字空间(es: evaluation system)
 * 
 * @author: Ricky
 */

var es = {
    Views: {}, //View构造函数
    
    Models: {}, //Model构造函数
    
    Router: null, //Router构造函数
    
    router: null, //Router唯一实例
    
    widgets: {}, //小部件View实例
    
    main: null, //当前View实例
    
    init: function() {
        //创建Head
        es.widgets.head = new es.Views.Head();
        //创建Nav
        es.widgets.nav = new es.Views.Nav();
        //创建Foot
        es.widgets.foot = new es.Views.Foot();
        //创建Router
        es.router = new es.Router();
        
        //开始监听hash
        Backbone.history.start();
    }
};
