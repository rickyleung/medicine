/*
 * 观察表
 * 
 * @author: Ricky
 */

es.Models.List = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        console.log("list/getPatientList.do-请求", args);
        
        util.ajax.run({
            url: "list/getPatientList.do",
            data: args,
            success: function(response) {
                console.log("list/getPatientList.do-响应", response);
                
                me.set({data: response});
            },
            mock: MOCK,
            mockData: {
                success: true,
                total: 100,
                data: [
                    {
                        id: 1,
                        no: "333-0125",
                        abbr: "XM",
                        createDate: "2014-01-01 00:00:00",
                        lastModified : "2014-01-02 00:00:00",
                        progress: "30%",
                        doubter: "doubter",
                        doubtNumber: 10,
                        doubtDate: "2014-01-03 00:00:00"
                    },
                    {
                        id: 2,
                        no: "333-0126",
                        abbr: "XH",
                        createDate: "2014-01-01 00:00:00",
                        lastModified : "2014-01-02 00:00:00",
                        progress: "30%",
                        doubter: "doubter",
                        doubtNumber: 10,
                        doubtDate: "2014-01-03 00:00:00"
                    }
                ]
            }
        });
    }
});
