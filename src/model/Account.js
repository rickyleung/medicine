/*
 * 账户管理
 * 
 * @author: Ricky
 */

es.Models.Account = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        if (args.type == 1) { //账户管理
            console.log("account/getUserList.do-请求", args);
            
            util.ajax.run({
                url: "account/getUserList.do",
                data: args,
                success: function(response) {
                    console.log("account/getUserList.do-响应", response);
                    
                    me.set({data: response});
                },
                mock: MOCK,
                mockData: {
                    success: true,
                    total: 100,
                    data: [
                        {
                            id: 1,
                            userName: "userName",
                            displayName: "displayName",
                            adminUserName: "adminUserName",
                            roleName: "roleName",
                            organizationName: "organizationName",
                            contact: "contact"
                        },
                        {
                            id: 2,
                            userName: "userName",
                            displayName: "displayName",
                            adminUserName: "adminUserName",
                            roleName: "roleName",
                            organizationName: "organizationName",
                            contact: "contact"
                        }
                    ]
                }
            });
        } else { //中心管理
            console.log("account/getOrganizationList.do-请求", args);
            
            util.ajax.run({
                url: "account/getOrganizationList.do",
                data: args,
                success: function(response) {
                    console.log("account/getOrganizationList.do-响应", response);
                    
                    me.set({data: response});
                },
                mock: MOCK,
                mockData: {
                    success: true,
                    total: 100,
                    data: [
                        {id: 1, name: "name", code: "code", instanceNumber: "instanceNumber", adminUserName: "adminUserName"},
                        {id: 2, name: "name", code: "code", instanceNumber: "instanceNumber", adminUserName: "adminUserName"}
                    ]
                }
            });
        }
    }
});
