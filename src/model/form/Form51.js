/*
 * 实验检查-体格检查
 * 
 * @author: Ricky
 */

es.Models.Form51 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
			done: null,
			exam: []
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getBodyExam.do-请求", args);
        
        util.ajax.run({
            url: "crf/getBodyExam.do",
            data: args,
            success: function(response) {
                console.log("crf/getBodyExam.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
                $.each(response.data.exam, function(index, val) {
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
