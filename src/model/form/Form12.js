/*
 * 患者信息-个人史 + 过敏史
 * 
 * @author: Ricky
 */

es.Models.Form12 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
			smoke: null,
			drink: null,
			hasFood: null,
			hasDrug: null,
			hasOther: null,
			food: [
				{name: null, value: "", txt: null}
			],
			drug: [
				{name: null, value: "", txt: null, type: 0}
			],
			other: [
				{name: null, value: "", txt: null}
			]
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getPersonHistory.do-请求", args);
        
        util.ajax.run({
            url: "crf/getPersonHistory.do",
            data: args,
            success: function(response) {
                console.log("crf/getPersonHistory.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
                
                $.each(response.data.food, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.drug, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.other, function(index, val) {
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
