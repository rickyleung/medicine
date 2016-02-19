/*
 * 全局统计
 * 
 * @author: Ricky
 */

es.Models.Stat = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(id) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        var method, mockData, formater;
        switch (id) {
            case 1:
                method = "stat/getHospitalStat.do";
                formater = me.formatHospital;
                mockData = [
                    {name: "北京大学医院", num1: 100, num2: 120, num3: 50, num4: 400, num5: 100},
                    {name: "北京同仁医院", num1: 120, num2: 100, num3: 80, num4: 500, num5: 100},
                    {name: "北京海淀医院", num1: 130, num2: 90, num3: 40, num4: 300, num5: 100}
                ];
                break;
            case 2:
                method = "stat/getAgeStat.do";
                formater = me.formatAge;
                mockData = [
                    {name: "60", number: 100},
                    {name: "70", number: 300}
                ];
                break;
            case 3:
                method = "stat/getSexStat.do";
                formater = me.formatSex;
                mockData = [
                    {name: "男", number: 400},
                    {name: "女", number: 600}
                ];
                break;
            case 4:
                method = "stat/getADEStat.do";
                formater = me.formatADE;
                mockData = [
                    {id: 1, no: "333-1234", age: 50, sex: "男", ethic: "汉族", diagnosis: "", ade: ""},
                    {id: 2, no: "333-1235", age: 60, sex: "女", ethic: "汉族", diagnosis: "", ade: ""}
                ];
        }
        
        util.ajax.run({
            url: method,
            data: {},
            success: function(response) {
                console.log(method, response);
                me.set({data: formater.call(me, response.data)});
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: mockData
            }
        });
    },
    
    formatHospital: function(data) {
        var lineData = {
            categories: [],
            series: [
                {name: "合同", data: []},
                {name: "审核通过", data: []},
                {name: "质疑", data: []},
                {name: "已提交未审核", data: []}//,
                //{name: "草稿", data: []}
            ]
        };
        
        $.each(data, function(index, val) {
            lineData.categories.push(val.name);
            lineData.series[0].data.push(val.num5);
            lineData.series[1].data.push(val.num4);
            lineData.series[2].data.push(val.num3);
            lineData.series[3].data.push(val.num2);
            //lineData.series[4].data.push(val.num1);
        });
        
        return lineData;
    },
    
    formatAge: function(data) {
        return this.formatPie(data);
    },
    
    formatSex: function(data) {
        return this.formatPie(data);
    },
    
    formatPie: function(data) {
        var pieData = [];
        $.each(data, function(index, val) {
            pieData.push([val.name, val.number]);
        });
        return pieData;
    },
    
    formatADE: function(data) {
        return data;
    }
});
