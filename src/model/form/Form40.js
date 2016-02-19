/*
 * 合并用药
 * 
 * @author: Ricky
 */

es.Models.Form40 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
            hasDrug: null,
			drug: []
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getDrugCombinationInfo.do-请求", args);
        
        util.ajax.run({
            url: "crf/getDrugCombinationInfo.do",
            data: args,
            success: function(response) {
                console.log("crf/getDrugCombinationInfo.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
                
                $.each(response.data.drug, function(index, val) {
                    val.no = index + 1;
                });
                
                me.set({data: response});
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: null
            }
        });
    }
});
