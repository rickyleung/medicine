/*
 * 实验检查-心电图
 * 
 * @author: Ricky
 */

es.Models.Form53 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
			done: null,
			examDate: T.date.format(new Date(), "yyyy-MM-dd"),
			normal: null,
			description: null
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getECGExam.do-请求", args);
        
        util.ajax.run({
            url: "crf/getECGExam.do",
            data: args,
            success: function(response) {
                console.log("crf/getECGExam.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
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
