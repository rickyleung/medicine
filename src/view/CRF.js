/*
 * CRF
 * 
 * @author: Ricky
 */

es.Views.CRF = Backbone.View.extend({
    el: "#Main",
    
    events: {
        "click .submit-crf": "onSubmitCRF",
        "click .doubt-crf": "openDoubtCRF",
        "click .check-doubt": "openCheckDoubt"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderInfo, this);
    },
    
    destroy: function() {
        this.menu && this.menu.destroy();
        this.destroyForm();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    destroyForm: function() {
        var form = this.form;
        form && form.destroy();
    },
    
    renderNav: function() {
        es.widgets.nav.clearActive();
    },
    
    render: function(query) {
        this.renderNav();
        
        //状态判断
        var hash = window.location.hash,
            title = "";
        this.crfId = parseInt(query, 10);
        
        if (/^#crf\/update\/\d+$/.test(hash)) {
            title = "填写CRF";
            this.editable = true;
            this.selectADR = false;
            this.submitTxt = "全部提交";
            this.canDoubt = false;
        } else if (/^#crf\/updateadr\/\d+$/.test(hash)) {
            title = "填写CRF";
            this.editable = true;
            this.selectADR = true;
            this.submitTxt = "全部提交";
            this.canDoubt = false;
        } else if (/^#crf\/doubt\/\d+$/.test(hash)) {
            title = "质疑CRF";
            this.editable = false;
            this.selectADR = false;
            this.submitTxt = "审核通过";
            this.canDoubt = true;
        } else if(/^#crf\/doubtadr\/\d+$/.test(hash)) {
            title = "质疑CRF";
            this.editable = false;
            this.selectADR = true;
            this.submitTxt = "审核通过";
            this.canDoubt = true;
        }
        
        var me = this;
        $.Mustache.load("asset/tpl/crf.html").done(function() {
            me.$el.mustache("tpl-crf", {title: title});
            
            //获取基本信息
            me.model.getData({id: me.crfId});
        });
    },
    
    renderInfo: function(model, data) {
        this.$("h1").append($.Mustache.render("tpl-crf-title", {
            no: data.no,
            abbr: data.abbr,
            submitTxt: this.submitTxt,
            doubtBtn: this.canDoubt ? [1] : []
        }));
        this.$(".progressbar .progress").text("完成度：" + data.progress);
        this.$(".progressbar .bar").css({width: data.progress});
        this.progress = data.progress;
        
        //右侧表单view实例
        this.form = null;
        
        //创建菜单
        var me = this;
        this.menu = new Tree({
            container: ".sidenav",
            data: CRF_MENU,
            defaultId: this.selectADR ? 70 : 11,
            onClick: this.onMenuClick,
            onLoad: function() {
                me.addDoubt(data.doubt);
            }
        });
    },
    
    /*
     * 添加质疑数
     */
    addDoubt: function(doubt) {
        for (var i in doubt) {
            if (doubt[i] !== 0) {
                this.$(".sidenav a[id=TreeNode" + i + "]").append('<span title="' + doubt[i] + '项质疑">' + doubt[i] + '</span>');
            }
        }
    },
    
    /*
     * 更新完成度
     */
    updateProgress: function(progress) {
        this.$(".progressbar .progress").text("完成度：" + progress);
        this.$(".progressbar .bar").css({width: progress});
        this.progress = progress;
    },
    
    /*
     * 切换表单
     */
    onMenuClick: function(id, target) {
        //target.find("span").fadeOut(3000);
        
        var me = es.main;
        me.destroyForm();
        
        var formName = "Form" + id;
        me.form = new es.Views[formName]({
            model: new es.Models[formName]
        });
    },
    
    /*
     * 提交验证
     */
    onSubmitCRF: function() {
        var me = this;
        if (this.progress != "100%") {
            esui.Dialog.confirm({
                title: me.submitTxt,
                content: "CRF未填写完整，是否确定" + me.submitTxt + "？",
                onok: function () {
                    me.submitCRF();
                }
            });
        } else {
            me.submitCRF();
        }
    },
    
    /*
     * 全部提交
     */
    submitCRF: function() {
        var data = {id: this.crfId},
            me = this;
        
        console.log("crf/saveTotalCRF.do-请求", data);
        
        util.ajax.run({
            url: "crf/saveTotalCRF.do",
            data: data,
            success: function(response) {
                console.log("crf/saveTotalCRF.do-响应", response);
                
                setTimeout(function() {
                    esui.Dialog.alert({
                        title: me.submitTxt,
                        content: me.submitTxt + "成功！"
                    });
                }, 500);
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    getMenuId: function() {
        var menu;
        if (this.$(".menu-item-active").length != 0) {
            menu = this.$(".sidenav .menu-item-active");
        } else {
            menu = this.$(".sidenav .active");
        }
        return parseInt(menu.attr("id").replace("TreeNode", ""), 10);
    },
    
    /*
     * 打开质疑对话框
     */
    openDoubtCRF: function() {
        esui.init();
        esui.get("Description").setValue("");
        esui.get("DoubtDialog").show();
        
        var data = {
            menu: this.getMenuId()
        };
        
        console.log("supervise/getDoubtDict.do-请求", data);
        
        util.ajax.run({
            url: "supervise/getDoubtDict.do",
            data: data,
            success: function(response) {
                console.log("supervise/getDoubtDict.do-响应", response);
                
                var datasource = [];
                $.each(response.data, function(index, val) {
                    datasource.push({name: val.name, value: val.id});
                });
                var field = esui.get("Field");
                field.datasource = datasource;
                field.render();
                field.setValue(datasource[0].value);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [
                    {name: "出生日期", id: 1},
                    {name: "身高", id: 2}
                ]
            }
        });
    },
    
    /*
     * 提交质疑
     */
    doubtCRF: function() {
        var me = es.main;
        
        var data = {
            id: me.crfId,
            menu: me.getMenuId(),
            fieldId: esui.get("Field").value,
            description: $.trim(esui.get("Description").getValue())
        };
        
        console.log("supervise/saveDoubtColumn.do-请求", data);
        
        util.ajax.run({
            url: "supervise/saveDoubtColumn.do",
            data: data,
            success: function(response) {
                console.log("supervise/saveDoubtColumn.do-响应", response);
                
                esui.get("DoubtDialog").hide();
                
                setTimeout(function() {
                    esui.Dialog.alert({
                        title: "提交质疑",
                        content: "提交成功！"
                    });
                }, 500);
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    /*
     * 查看质疑
     */
    openCheckDoubt: function() {
        var data = {
            id: this.crfId,
            menu: this.getMenuId()
        };
        
        console.log("supervise/getDoubtRecord.do-请求", data);
        
        util.ajax.run({
            url: "supervise/getDoubtRecord.do",
            data: data,
            success: function(response) {
                console.log("supervise/getDoubtRecord.do-响应", response);
                
                es.main.renderDoubtList(response.data);
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: [
                    {
                        doubtId: 1,
                        doubter: "doubter",
                        doubtField: "身高",
                        description: "非人类",
                        doubtDate: "2014-01-03 00:00:00"
                    },
                    {
                        doubtId: 2,
                        doubter: "doubter",
                        doubtField: "身高",
                        description: "非人类",
                        doubtDate: "2014-01-03 00:00:00"
                    }
                ]
            }
        });
    },
    
    renderDoubtList: function(data) {
        var table = esui.get("Doubtlist");
        
        if (data == null || data.length == 0) {
            $(table.main).hide();
            $(".no-doubt").show();
        } else {
            $(table.main).show();
            $(".no-doubt").hide();
            
            table.datasource = data;
            table.fields = [
                {
                    field: "doubter",
                    title: "质疑人",
                    content: function(item) {return item.doubter;}
                },
                {
                    field: "doubtField",
                    title: "质疑字段",
                    content: function(item) {return item.doubtField;}
                },
                {
                    field: "description",
                    title: "说明",
                    content: function(item) {return item.description;}
                },
                {
                    field: "doubtDate",
                    title: "质疑时间",
                    content: function(item) {return item.doubtDate;}
                },
                {
                    field: "op",
                    title: "操作",
                    content: function(item) {
                    	if (item.flag == 0){
                    		return '<a href="javascript:void(0)" class="fix" onclick="es.main.fixDoubt(' + item.doubtId + ', this)">解决</a>';
                    	}else{
                    		return '已解决';
                    	}
                    }
                }
            ];
            
            table.render();
        }
        
        esui.get("CheckDoubtDialog").show();
    },
    
    fixDoubt: function(id, el) {
        var data = {
            id: this.crfId,
            menu: this.getMenuId(),
            doubtId: id
        };
        
        console.log("supervise/commitDoubtColumn-请求", data);
        
        util.ajax.run({
            url: "supervise/commitDoubtColumn.do",
            data: data,
            success: function(response) {
                console.log("supervise/commitDoubtColumn-响应", response);
                
                $(el).after("已解决").remove();
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    }
});
