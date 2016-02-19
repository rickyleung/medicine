/*
 * 观察表
 * 
 * @author: Ricky
 */

es.Views.List = Backbone.View.extend({
    el: "#Main",
    
    events: {
        "click .tabbar a": "switchList",
        "click .new-crf": "openNewCRF"
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
        es.widgets.nav.setActive("list");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/list.html").done(function() {
            //填充html
            me.$el.mustache("tpl-list");
            me.$(".data").append($.Mustache.render("tpl-page"));
            me.$(".list-wrap").append($.Mustache.render("tpl-new-crf-dialog"));
            
            //初始化控件
            me.initCtrl();
            
            //获取通知
            me.getNotify();
            
            //初始查询
            me.args = {
                pageSize: 20,
                orderBy: "lastModified",
                desc: true
            };
            me.getArgs();
            me.queryFirstPage();
        });
    },
    
    /*
     * 初始化控件
     */
    initCtrl: function() {
        esui.init(this.el, {
            CreateRangeType: TIME_TYPE,
            LastModifyRangeType: TIME_TYPE,
            DoubtRangeType: TIME_TYPE,
            CreateRange: QUERY_RANGE,
            LastModifyRange: QUERY_RANGE,
            DoubtRange: QUERY_RANGE,
            ProgressType: PROGRESS_TYPE,
            PageSize: PAGE_SIZE
        });
        
        var me = this;
        esui.get("Close").onclick = function() {
            me.$(".notify").remove();
        };
        esui.get("CreateRangeType").onchange = function(value) {
            if (value == 1) {
                $("#ctrlmcalCreateRange").hide();
            } else {
                $("#ctrlmcalCreateRange").show();
            }
        };
        esui.get("LastModifyRangeType").onchange = function(value) {
            if (value == 1) {
                $("#ctrlmcalLastModifyRange").hide();
            } else {
                $("#ctrlmcalLastModifyRange").show();
            }
        };
        esui.get("DoubtRangeType").onchange = function(value) {
            if (value == 1) {
                $("#ctrlmcalDoubtRange").hide();
            } else {
                $("#ctrlmcalDoubtRange").show();
            }
        };
        esui.get("ProgressType").onchange = function(value) {
            if (value == 0) {
                $("#ctrltextProgress").hide();
            } else {
                $("#ctrltextProgress").show();
            }
        };
        esui.get("PageSize").onchange = function(size) {
            me.args.pageSize = size;
            me.queryFirstPage();
        };
        esui.get("PageNo").onchange = function(page) {
            me.args.pageNo = page + 1;
            me.query(me.args);
        };
        esui.get("Query").onclick = function() {
            me.getArgs();
            me.queryFirstPage();
        };
        esui.get("CRF").onclick = function() {
            me.args.crf = true;
            me.queryFirstPage();
        };
        esui.get("ADR").onclick = function() {
            me.args.crf = false;
            me.queryFirstPage();
        };
        esui.get("Grid").onsort = function (field, order) {
            me.args.orderBy = field.field;
            me.args.desc = order == "desc" ? true : false;
            me.queryFirstPage();
        };
        esui.get("DelCRF").onclick = this.delCRF;
        esui.get("SubmitCRF").onclick = this.submitCRF;
        esui.get("NewCRFOK").onclick = this.newCRF;
    },
    
    /*
     * 获取参数
     */
    getArgs: function() {
        this.args.crf = esui.get("CRF").isChecked();
        this.args.type = parseInt(this.$(".tabbar .active").attr("type"), 10);
        this.args.no = $.trim(esui.get("No").getValue());
        this.args.abbr = $.trim(esui.get("Abbr").getValue());
        if (esui.get("CreateRangeType").value == 1) {
            this.args.createDateFrom = null;
            this.args.createDateTo = null;
        } else {
            var date = esui.get("CreateRange").getValue().split(",");
            this.args.createDateFrom = date[0];
            this.args.createDateTo = date[1];
        }
        if (esui.get("LastModifyRangeType").value == 1) {
            this.args.lastModifiedFrom = null;
            this.args.lastModifiedTo = null;
        } else {
            var date = esui.get("LastModifyRange").getValue().split(",");
            this.args.lastModifiedFrom = date[0];
            this.args.lastModifiedTo = date[1];
        }
        this.args.progressType = esui.get("ProgressType").value;
        if (this.args.progressType == 0) {
            this.args.progress = null;
        } else {
            this.args.progress = $.trim(esui.get("Progress").getValue());
        }
        
        this.args.undealed = esui.get("Undealed").isChecked();
        this.args.doubter = $.trim(esui.get("Doubter").getValue());
        if (esui.get("DoubtRangeType").value == 1) {
            this.args.doubtDateFrom = null;
            this.args.doubtDateTo = null;
        } else {
            var date = esui.get("DoubtRange").getValue().split(",");
            this.args.doubtDateFrom = date[0];
            this.args.doubtDateTo = date[1];
        }
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
        
        //已提交待审核
        if (this.args.type == 1) {
            this.$(".time-label").text("提交时间范围：");
        } else {
            this.$(".time-label").text("最后修改时间范围：");
        }
        //被质疑
        if (this.args.type == 2) {
            this.$(".doubt-form").show();
        } else {
            this.$(".doubt-form").hide();
        }
        //已提交待审核 || 审核通过
        if (this.args.type == 1 || this.args.type == 3) {
            this.$("#ctrlbuttonSubmitCRF").hide();
        } else {
            this.$("#ctrlbuttonSubmitCRF").show();
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
            var table = esui.get("Grid"),
                me = this;
            table.datasource = data.data;
            table.fields = [
                {
                    field: "no",
                    title: "观察表编号",
                    sortable: true,
                    content: function(item) {
                        return $.Mustache.render("tpl-list-detail", {
                            id: item.id,
                            no: item.no,
                            rount: me.args.crf ? "update" : "updateadr"
                        });
                    }
                },
                {
                    field: "abbr",
                    title: "姓名缩写",
                    sortable: true,
                    content: function(item) {return item.abbr;}
                },
                {
                    field: "createDate",
                    title: "创建时间",
                    sortable: true,
                    content: function(item) {return item.createDate;}
                },
                {
                    field: "lastModified",
                    title: this.args.type == 1 ? "提交时间" : "最后修改时间",
                    sortable: true,
                    content: function(item) {return item.lastModified;}
                },
                {
                    field: "progress",
                    title: "完成度",
                    sortable: true,
                    content: function(item) {return item.progress;}
                }
            ];
            //被质疑
            if (this.args.type == 2) {
                table.fields.splice(2, 0,
                {
                    field: "doubter",
                    title: "质疑人",
                    sortable: true,
                    content: function(item) {return item.doubter;}
                },
                {
                    field: "doubtNumber",
                    title: "质疑数",
                    sortable: true,
                    content: function(item) {return item.doubtNumber;}
                },
                {
                    field: "doubtDate",
                    title: "质疑时间",
                    sortable: true,
                    content: function(item) {return item.doubtDate;}
                });
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
     * 获取通知
     */
    getNotify: function() {
        var data = {},
            me = this;
            
        console.log("list/notify.do-请求", data);
        
        util.ajax.run({
            url: "list/notify.do",
            data: data,
            success: function(response) {
                console.log("list/notify.do-响应", response);
                
                me.$(".notify").prepend($.Mustache.render("tpl-list-notify", {
                    doubtNumber: response.doubtNumber,
                    toDoNumber: response.toDoNumber
                })).fadeIn(1000);
            },
            mock: MOCK,
            mockData: {
                success: true,
                doubtNumber: 12,
                toDoNumber: 1
            }
        });
    },
    
    /*
     * 打开对话框
     */
    openNewCRF: function() {
        esui.get("NewAbbr").setValue("");
        $("#ctrltextNewAbbr").next().empty();
        esui.get("NewNo").setValue("");
        $("#ctrltextNewNo").next().empty();
        esui.get("NewCRFDialog").show();
    },
    
    /*
     * 新建CRF
     */
    newCRF: function() {
        var data = {
            abbr: $.trim(esui.get("NewAbbr").getValue()),
            no: $.trim(esui.get("NewNo").getValue())
        };
        
        //验证
        var error1 = $("#ctrltextNewAbbr").next(),
            error2 = $("#ctrltextNewNo").next();
        error1.empty();
        error1.empty();
        if (data.abbr === "") {
            error1.html("请填写患者姓名缩写");
            return;
        }
        if (!/^[a-z]+$/i.test(data.abbr)) {
            error1.html("必须为字母");
            return;
        }
        if (data.no === "") {
            error2.html("请填写观察表编号");
            return;
        }
        if (!/^\d{3}-\d{4}$/.test(data.no)) {
            error2.html("格式应为：xxx-xxxx");
            return;
        }
        
        console.log("crf/addCRF.do-请求", data);
        
        util.ajax.run({
            url: "crf/addCRF.do",
            data: data,
            success: function(response) {
                console.log("crf/addCRF.do-响应", response);
                
                esui.get("NewCRFDialog").hide();
                es.router.navigate("crf/update/" + response.id, true);
            },
            mock: MOCK,
            mockData: {
                success: true,
                id: 1,
                no: "333-1234"
            }
        });
    },
    
    /*
     * 批量删除
     */
    delCRF: function() {
        var selected = $(".ui-table-row-selected .detail");
        if (selected.length == 0) {
            esui.Dialog.alert({
                title: "批量删除",
                content: "请选择要删除的观察表。"
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
                        crf: esui.get("CRF").isChecked(),
                        id: id.join(","),
                        type: es.main.args.type
                    };
                    
                    console.log("list/batchDelete.do-请求", data);
                    
                    util.ajax.run({
                        url: "list/batchDelete.do",
                        data: data,
                        success: function(response) {
                            console.log("list/batchDelete.do-响应", response);
                            
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
     * 批量提交
     */
    submitCRF: function() {
        var selected = $(".ui-table-row-selected .detail");
        if (selected.length == 0) {
            esui.Dialog.alert({
                title: "批量提交",
                content: "请选择要提交的观察表。"
            });
        } else {
            var id = [];
            $.each(selected, function(index, val) {
                id.push(parseInt(val.id, 10));
            });
            var data = {
                crf: esui.get("CRF").isChecked(),
                id: id.join(","),
                type: es.main.args.type
            };
            
            console.log("list/batchCommit.do-请求", data);
            
            util.ajax.run({
                url: "list/batchCommit.do",
                data: data,
                success: function(response) {
                    console.log("list/batchCommit.do-响应", response);
                    
                    es.main.queryFirstPage();
                },
                mock: MOCK,
                mockData: {
                    success: true
                }
            });
        }
    }
});
