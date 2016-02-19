/*
 * 数据字典
 * 
 * @author: Ricky
 */

es.Models.Dict = Backbone.Model.extend({
    defaults: {
        dict: null,
        item: null,
        base: null
    },
    
    getDict: function() {
        var me = this;
        me.set({dict : null}, {silent : true});
        
        util.ajax.run({
            url: "dict/getSnapshot.do",
            data: {},
            success: function(response) {
                console.log("dict/getSnapshot.do-响应", response);
                
                me.set({dict: me.formatDict(response)});
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [
                    {id: 1, name: "药品名称字典", untreated: 10},
                    {id: 2, name: "科室名称字典", untreated: 0},
                    {id: 3, name: "用药类别字典", untreated: 0}
                ]
            }
        });
    },
    
    formatDict: function(response) {
        $.each(response.data, function(index, val) {
            if (val.untreated != 0) {
                val.name = val.name + " (" + val.untreated + "个未处理)";
            }
        });
        
        return response;
    },
    
    getItem: function(args) {
        var me = this;
        me.set({item : null}, {silent : true});
        
        console.log("dict/getItemList.do-请求", args);
        
        util.ajax.run({
            url: "dict/getItemList.do",
            data: args,
            success: function(response) {
                console.log("dict/getItemList.do-响应", response);
                
                me.set({item: response});
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [
                    {id: 11, name: "心肌梗塞", abbr: "xjgs", baseItemName: "心肌梗塞", baseItemId: 1, baseItemAbbr: "xjgs"},
                    {id: 12, name: "心肌梗死", abbr: "xjgs", baseItemName: "", baseItemId: null, baseItemAbbr: ""},
                    {id: 13, name: "心梗", abbr: "xg", baseItemName: "", baseItemId: null, baseItemAbbr: ""}
                ]
            }
        });
    }
});
