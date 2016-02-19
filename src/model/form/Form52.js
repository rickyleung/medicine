/*
 * 实验检查-实验室检查
 * 
 * @author: Ricky
 */

es.Models.Form52 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
			done: null,
			examDate: T.date.format(new Date(), "yyyy-MM-dd"),
			sample: null,
			sampletxt: null,
			result: "",
			resulttxt1: "",
			resulttxt2: "",
			resulttxt3: "",
			data1: [],
			data2: [],
			data3: [],
			data4: []
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getDrugUseExam.do-请求", args);
        
        util.ajax.run({
            url: "crf/getDrugUseExam.do",
            data: args,
            success: function(response) {
                console.log("crf/getDrugUseExam.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
                $.each(response.data.data1, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.data2, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.data3, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.data4, function(index, val) {
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
