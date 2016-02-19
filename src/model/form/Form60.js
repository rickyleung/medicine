/*
 * 用药小结
 * 
 * @author: Ricky
 */

es.Models.Form60 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
            startDate: T.date.format(new Date(), "yyyy-MM-dd"),
            endDate: T.date.format(new Date(), "yyyy-MM-dd"),
            ending: null,
            deathDate: T.date.format(new Date(), "yyyy-MM-dd"),
            deathReason: null,
            hasAdr: null,
            adr: "",
            adr1: "",
            adr2: "",
            adr3: "",
            adr4: "",
            adr5: "",
            adr6: "",
            adrtxt: null,
            hasOtherAdr: null,
            unreasonable: null,
            intervention: null,
            interventiontxt: null,
            treatmentCost: null,
            drugCost: null,
            trqCost: null,
            remark: null
        }
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getDrugSummary.do-请求", args);
        
        util.ajax.run({
            url: "crf/getDrugSummary.do",
            data: args,
            success: function(response) {
                console.log("crf/getDrugSummary.do-响应", response);
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
