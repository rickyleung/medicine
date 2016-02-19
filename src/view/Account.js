/*
 * 账户管理
 * 
 * @author: Ricky
 */

es.Views.Account = Backbone.View.extend({
    el: "#Main",
    
    events: {
        "click .tabbar a": "switchList",
        "click .new-account": "openNewAccount",
        "click .new-center": "openNewCenter",
        "click .edit-account": "openEditAccount",
        "click .edit-center": "openEditCenter"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderGrid, this);
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("account");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/account.html").done(function() {
            me.$el.mustache("tpl-account", {
                center: Auth.DM ? [1] : []
            });
            me.$(".data").append($.Mustache.render("tpl-page"));
            
            me.initCtrl();
            
            //初始查询
            me.args = {pageSize: 20};
            me.getArgs();
            me.queryFirstPage();
        });
    },
    
    /*
     * 初始化控件
     */
    initCtrl: function() {
        esui.init(this.el, {
            PageSize: PAGE_SIZE,
            AdminUser: DEFAULT_OPTION,
            Role: DEFAULT_OPTION,
            Organization: DEFAULT_OPTION,
            EAdminUser: DEFAULT_OPTION,
            ERole: DEFAULT_OPTION,
            EOrganization: DEFAULT_OPTION,
            Superviser: DEFAULT_OPTION,
            ESuperviser: DEFAULT_OPTION
        });
        
        var me = this;
        esui.get("PageSize").onchange = function(value, item) {
            me.args.pageSize = value;
            me.queryFirstPage();
        };
        esui.get("PageNo").onchange = function(page) {
            me.args.pageNo = page + 1;
            me.query(me.args);
        };
        
        esui.get("DelAccount").onclick = this.delAccount;
        esui.get("NewAccountOK").onclick = this.newAccount;
        esui.get("EditAccountOK").onclick = this.editAccount;
        
        if (Auth.DM) {
            esui.get("DelCenter").onclick = this.delCenter;
            esui.get("NewCenterOK").onclick = this.newCenter;
            esui.get("EditCenterOK").onclick = this.editCenter;
        }
    },
    
    /*
     * 获取参数
     */
    getArgs: function() {
        this.args.type = parseInt(this.$(".tabbar .active").attr("type"), 10);
    },
    
    /*
     * 查询第一页
     */
    queryFirstPage: function() {
        this.args.pageNo = 1;
        this.pageRendered = false;
        this.query(this.args);
    },
    
    /*
     * 发起请求
     */
    query: function(args) {
        this.model.getData(args);
    },
    
    /*
     * 切换Tab
     */
    switchList: function(e) {
        var me = $(e.target);
        if (me.hasClass("active")) {
            return;
        }
        
        //设置激活样式
        this.$(".tabbar a").removeClass("active");
        me.addClass("active");
        
        //查询
        this.getArgs();
        this.queryFirstPage();
        
        if (this.args.type == 1) { //账户管理
            this.$(".new-account").show();
            this.$("#ctrlbuttonDelAccount").show();
            this.$(".new-center").hide();
            this.$("#ctrlbuttonDelCenter").hide();
        } else { //中心管理
            this.$(".new-account").hide();
            this.$("#ctrlbuttonDelAccount").hide();
            this.$(".new-center").show();
            this.$("#ctrlbuttonDelCenter").show();
        }
    },
    
    /*
     * 渲染列表
     */
    renderGrid: function(model, data) {
        if (data.total == 0) {
            this.$(".no-result").show();
            this.$(".data").hide();
        } else {
            this.$(".no-result").hide();
            this.$(".data").show();
            
            //表格
            var table = esui.get("Grid");
            table.datasource = data.data;
            if (this.args.type == 1) {
                table.fields = [
                    {field: "userName", title: "账户名称", content: function(item) {
                        return $.Mustache.render("tpl-account-name", {
                            id: item.id,
                            userName: item.userName
                        });
                    }},
                    {field: "displayName", title: "真实姓名", content: function(item) {return item.displayName;}},
                    {field: "adminUserName", title: "直属管理员", content: function(item) {return item.adminUserName;}},
                    {field: "roleName", title: "权限", content: function(item) {return item.roleName;}},
                    {field: "organizationName", title: "中心名称", content: function(item) {return item.organizationName;}},
                    {field: "contact", title: "联系方式", content: function(item) {return item.contact;}}
                ];
            } else {
                table.fields = [
                    {field: "name", title: "中心名称", content: function(item) {
                        return $.Mustache.render("tpl-center-name", {
                            id: item.id,
                            name: item.name
                        });
                    }},
                    {field: "code", title: "中心编码", content: function(item) {return item.code;}},
                    {field: "instanceNumber", title: "合同数", content: function(item) {return item.instanceNumber;}},
                    {field: "adminUserName", title: "监察员", content: function(item) {return item.adminUserName;}}
                ];
            }
            table.render();
            
            //页码
            this.renderPage(data.total);
        }
    },
    
    /*
     * 渲染页码
     */
    renderPage: function(total) {
        if (!this.pageRendered) {
            var pager = esui.get("PageNo");
            pager.total = Math.ceil(total / esui.get("PageSize").value);
            pager.page = 0;
            pager.render();
            this.pageRendered = true;
        }
        this.$(".row-count").text("共 " + total + " 条");
    },
    
    /*
     * 批量删除账户
     */
    delAccount: function() {
        var selected = $(".ui-table-row-selected a");
        if (selected.length == 0) {
            esui.Dialog.alert({
                title: "批量删除",
                content: "请选择要删除的账户。"
            });
        } else {
            esui.Dialog.confirm({
                title: "批量删除",
                content: "确定删除吗？",
                onok: function () {
                    var id = [];
                    $.each(selected, function(index, val) {
                        id.push(parseInt(val.id, 10));
                    });
                    var data = {
                        id: id.join(",")
                    };
                    
                    console.log("account/deleteUser.do-请求", data);
                    
                    util.ajax.run({
                        url: "account/deleteUser.do",
                        data: data,
                        success: function(response) {
                            console.log("account/deleteUser.do-响应", response);
                            
                            es.main.queryFirstPage();
                        },
                        mock: MOCK,
                        mockData: {
                            success: true
                        }
                    });
                }
            });
        }
    },
    
    /*
     * 打开添加账户对话框
     */
    openNewAccount: function() {
        esui.get("UserName").setValue("");
        esui.get("DisplayName").setValue("");
        esui.get("Password").setValue("");
        esui.get("Contact").setValue("");
        
        es.main.getAdminUserList("AdminUser", 0);
        es.main.getRoleList("Role", 0);
        es.main.getOrganizationList("Organization", 0);
        
        esui.get("NewAccountDialog").show();
    },
    
    /*
     * 添加账户
     */
    newAccount: function() {
        var data = {
            userName: $.trim(esui.get("UserName").getValue()),
            displayName: $.trim(esui.get("DisplayName").getValue()),
            password: $.trim(esui.get("Password").getValue()),
            adminUserId: esui.get("AdminUser").value,
            roleId: esui.get("Role").value,
            organizationId: esui.get("Organization").value,
            contact: $.trim(esui.get("Contact").getValue())
        };
        
        console.log("account/saveUser.do-请求:", data);
        
        util.ajax.run({
            url: "account/saveUser.do",
            data: data,
            success: function(response) {
                console.log("account/saveUser.do-响应:", response);
                
                esui.get("NewAccountDialog").hide();
                es.main.queryFirstPage();
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    /*
     * 打开编辑账户对话框
     */
    openEditAccount: function(e) {
        var data = {id: parseInt(e.target.id, 10)};
        es.main.curUserId = data.id;
        
        console.log("account/getUser.do-请求:", data);
        
        util.ajax.run({
            url: "account/getUser.do",
            data: data,
            success: function(response) {
                console.log("account/getUser.do-响应:", response);
                
                var data = response.data;
                esui.get("EUserName").setValue(data.userName);
                esui.get("EDisplayName").setValue(data.displayName);
                esui.get("EPassword").setValue(data.password);
                esui.get("EContact").setValue(data.contact);
                
                es.main.getAdminUserList("EAdminUser", data.adminUserId);
                es.main.getRoleList("ERole", data.roleId);
                es.main.getOrganizationList("EOrganization", data.organizationId);
                
                esui.get("EditAccountDialog").show();
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: {
                    userName: "userName",
                    displayName: "displayName",
                    password: "password",
                    adminUserId: 1,
                    roleId: 1,
                    organizationId: 1,
                    contact: "contact"
                }
            }
        });
    },
    
    /*
     * 编辑账户
     */
    editAccount: function() {
        var data = {
            id: es.main.curUserId,
            userName: $.trim(esui.get("EUserName").getValue()),
            displayName: $.trim(esui.get("EDisplayName").getValue()),
            password: $.trim(esui.get("EPassword").getValue()),
            adminUserId: esui.get("EAdminUser").value,
            roleId: esui.get("ERole").value,
            organizationId: esui.get("EOrganization").value,
            contact: $.trim(esui.get("EContact").getValue())
        };
        
        console.log("account/saveUser.do-请求:", data);
        
        util.ajax.run({
            url: "account/saveUser.do",
            data: data,
            success: function(response) {
                console.log("account/saveUser.do-响应:", response);
                
                esui.get("EditAccountDialog").hide();
                es.main.query(es.main.args);
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    /*
     * 批量删除中心
     */
    delCenter: function() {
        var selected = $(".ui-table-row-selected a");
        if (selected.length == 0) {
            esui.Dialog.alert({
                title: "批量删除",
                content: "请选择要删除的中心。"
            });
        } else {
            esui.Dialog.confirm({
                title: "批量删除",
                content: "确定删除吗？",
                onok: function () {
                    var id = [];
                    $.each(selected, function(index, val) {
                        id.push(parseInt(val.id, 10));
                    });
                    var data = {
                        id: id.join(",")
                    };
                    
                    console.log("account/deleteOrganization.do-请求", data);
                    
                    util.ajax.run({
                        url: "account/deleteOrganization.do",
                        data: data,
                        success: function(response) {
                            console.log("account/deleteOrganization.do-响应", response);
                            
                            es.main.queryFirstPage();
                        },
                        mock: MOCK,
                        mockData: {
                            success: true
                        }
                    });
                }
            });
        }
    },
    
    /*
     * 打开添加中心对话框
     */
    openNewCenter: function() {
        esui.get("Name").setValue("");
        esui.get("Code").setValue("");
        esui.get("InstanceNumber").setValue("");
        
        es.main.getSuperviserList("Superviser", 0);
        
        esui.get("NewCenterDialog").show();
    },
    
    /*
     * 添加中心
     */
    newCenter: function() {
        var data = {
            name: $.trim(esui.get("Name").getValue()),
            code: $.trim(esui.get("Code").getValue()),
            instanceNumber: parseInt($.trim(esui.get("InstanceNumber").getValue()), 10),
            adminUserId: esui.get("Superviser").value
        };
        
        console.log("account/saveOrganization.do-请求:", data);
        
        util.ajax.run({
            url: "account/saveOrganization.do",
            data: data,
            success: function(response) {
                console.log("account/saveOrganization.do-响应:", response);
                
                esui.get("NewCenterDialog").hide();
                es.main.queryFirstPage();
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    /*
     * 打开编辑中心对话框
     */
    openEditCenter: function(e) {
        var data = {id: parseInt(e.target.id, 10)};
        es.main.curCenterId = data.id;
        
        console.log("account/getOrganization.do-请求:", data);
        
        util.ajax.run({
            url: "account/getOrganization.do",
            data: data,
            success: function(response) {
                console.log("account/getOrganization.do-响应:", response);
                
                var data = response.data;
                esui.get("EName").setValue(data.name);
                esui.get("ECode").setValue(data.code);
                esui.get("EInstanceNumber").setValue(data.instanceNumber);
                
                es.main.getSuperviserList("ESuperviser", data.adminUserId);
                
                esui.get("EditCenterDialog").show();
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: {name: "name", code: 333, instanceNumber: 20, adminUserId: 1}
            }
        });
    },
    
    /*
     * 编辑中心
     */
    editCenter: function() {
        var data = {
            id: es.main.curCenterId,
            name: $.trim(esui.get("EName").getValue()),
            code: $.trim(esui.get("ECode").getValue()),
            instanceNumber: parseInt($.trim(esui.get("EInstanceNumber").getValue()), 10),
            adminUserId: esui.get("ESuperviser").value
        };
        
        console.log("account/saveOrganization.do-请求:", data);
        
        util.ajax.run({
            url: "account/saveOrganization.do",
            data: data,
            success: function(response) {
                console.log("account/saveOrganization.do-响应:", response);
                
                esui.get("EditCenterDialog").hide();
                es.main.query(es.main.args);
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    getRoleList: function(id, value) {
        util.ajax.run({
            url: "account/getRoleList.do",
            data: {},
            success: function(response) {
                console.log("account/getRoleList.do-响应:", response);
                
                var roleList = esui.get(id),
                    datasource = [{name: "请选择", value: 0}];
                $.each(response.data, function(index, val) {
                    datasource.push({value: val.id, name: val.description});
                });
                roleList.datasource = datasource;
                roleList.render();
                roleList.setValue(value);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [{id: 1, description: "description1"}, {id: 2, description: "description2"}]
            }
        });
    },
    
    getAdminUserList: function(id, value) {
        util.ajax.run({
            url: "account/getAdminList.do",
            data: {},
            success: function(response) {
                console.log("account/getAdminList.do-响应:", response);
                
                var adminUserList = esui.get(id),
                    datasource = [{name: "请选择", value: 0}];
                $.each(response.data, function(index, val) {
                    datasource.push({value: val.id, name: val.description});
                });
                adminUserList.datasource = datasource;
                adminUserList.render();
                adminUserList.setValue(value);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [{id: 1, description: "description1"}, {id: 2, description: "description2"}]
            }
        });
    },
    
    getOrganizationList: function(id, value) {
        util.ajax.run({
            url: "account/getOrganizationList.do",
            data: {},
            success: function(response) {
                console.log("account/getOrganizationList.do-响应:", response);
                
                var organizationList = esui.get(id),
                    datasource = [{name: "请选择", value: 0}];
                $.each(response.data, function(index, val) {
                    datasource.push({value: val.id, name: val.name});
                });
                organizationList.datasource = datasource;
                organizationList.render();
                organizationList.setValue(value);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [{id: 1, name: "name1"}, {id: 2, name: "name2"}]
            }
        });
    },
    
    getSuperviserList: function(id, value) {
        util.ajax.run({
            url: "account/getCRMList.do",
            data: {},
            success: function(response) {
                console.log("account/getCRMList.do-响应:", response);
                
                var superviserList = esui.get(id),
                    datasource = [{name: "请选择", value: 0}];
                $.each(response.data, function(index, val) {
                    datasource.push({value: val.id, name: val.description});
                });
                superviserList.datasource = datasource;
                superviserList.render();
                superviserList.setValue(value);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [{id: 1, description: "description1"}, {id: 2, description: "description2"}]
            }
        });
    }
});
