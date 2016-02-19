/*
 * 用药情况
 * 
 * @author: Ricky
 */

es.Models.Form30 = Backbone.Model.extend({
    defaults: {
        data: null,
        def: {
			history: null,
			adr: null,
			adrtxt: null,
			batchNumber: null,
			dose: null,
			startDate: T.date.format(new Date(), "yyyy-MM-dd"),
			startH: null,
			startM: null,
			endDate: T.date.format(new Date(), "yyyy-MM-dd"),
			endH: null,
			endM: null,
			solventDose: null,
			solvent: null,
			solventName: null,
			solventPercent: null,
			prepareTime: null,
			prepareTimeUd: false,
			location: null,
			way: null,
			way1Speed: null,
			way1Time: null,
			way2Speed: null,
			way3Name: null,
			way3Speed: null,
			way3Unit: null,
			
			sameBottle: null,
			bottle: [
				{name: null, dose: null, unit: null}
			],
			
			sameGroup: null,
			useSolvent: null,
			gpSolvent: null,
			gpSolvent1Dose: null,
			gpSolvent2Dose: null,
			gpSolvent3Name: null,
			gpSolvent3Percent: null,
			gpSolvent3Dose: null,
			prevGroup: null,
			prevGroupName: null,
			nextGroup: null,
			nextGroupName: null,
			
			hasInjection: null,
			injection: [
				{name: null, dose: null, unit: null}
			],
			
			hasBan: null,
			ban: null,
			banColor: null,
			bantxt: null,
			banDrug: [
				{name: null, dose: null, unit: null}
			],
			
			hasFood: null,
			food: "",
			foodtxt: null
		}
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("crf/getDrugUseInfo.do-请求", args);
        
        util.ajax.run({
            url: "crf/getDrugUseInfo.do",
            data: args,
            success: function(response) {
                console.log("crf/getDrugUseInfo.do-响应", response);
                if (response.data == null) {
                    response.data = me.get("def");
                    me.first = true;
                } else {
                    me.first = false;
                }
                
                $.each(response.data.bottle, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.injection, function(index, val) {
                    val.no = index + 1;
                });
                $.each(response.data.banDrug, function(index, val) {
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
