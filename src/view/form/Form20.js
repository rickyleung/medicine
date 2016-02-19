/*
 * 病症情况
 * 
 * @author: Ricky
 */

es.Views.Form20 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderForm, this);
        this.model.getData({id: es.main.crfId});
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderForm: function(model, data) {
        //插入质疑对话框
        if (es.main.canDoubt) {
            es.main.$el.append($.Mustache.render("tpl-doubt-dialog"));
        }
        es.main.$el.append($.Mustache.render("tpl-check-doubt-dialog"));
        
        var me = this;
        $.Mustache.load("asset/tpl/form/form20.html").done(function() {
            me.$el.mustache("tpl-form20", {
                data: data.data,
                disabled: es.main.editable ? "" : "disabled:true",
                save: es.main.editable ? [1] : []
            });
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        esui.init();
        
        //赋值
        var me = this;
        
        if (data.disease1 != "") {
            $.each(data.disease1.split(","), function(index, val) {
                esui.get("Disease1_" + val).setChecked(true);
            });
        }
        if (data.disease1.indexOf("4") != -1) {
            this.$(".fy").show();
        }
        switch (data.fy) {
            case 1: esui.get("Fy1").setChecked(true); break;
            case 2: esui.get("Fy2").setChecked(true); break;
            case 3: esui.get("Fy3").setChecked(true); break;
            case 4: esui.get("Fy4").setChecked(true);
        }
        if (data.disease2 != "") {
            $.each(data.disease2.split(","), function(index, val) {
                esui.get("Disease2_" + val).setChecked(true);
            });
        }
        if (data.disease3 != "") {
            $.each(data.disease3.split(","), function(index, val) {
                esui.get("Disease3_" + val).setChecked(true);
            });
        }
        switch (data.zy) {
            case 1: esui.get("ZY1").setChecked(true); break;
            case 2: esui.get("ZY2").setChecked(true); break;
            case 3: esui.get("ZY3").setChecked(true); break;
            case 4: esui.get("ZY4").setChecked(true); break;
            case 5: esui.get("ZY5").setChecked(true); break;
            case 6: esui.get("ZY6").setChecked(true); break;
            case 7: esui.get("ZY7").setChecked(true);
        }
        
        //事件
        esui.get("Disease1_4").onclick = function() {
            me.$(".fy").toggle();
        };
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
    },
        
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           disease1: esui.get("Disease1_1").getGroup().getValue(),
           fy: parseInt(esui.get("Fy1").getGroup().getValue(), 10),
           disease2: esui.get("Disease2_1").getGroup().getValue(),
           disease3: esui.get("Disease3_1").getGroup().getValue(),
           diseasetxt: $.trim(esui.get("CustomDiseaseName").getValue()),
           diagnosis: $.trim(esui.get("Diagnosis").getValue()),
           zy: parseInt(esui.get("ZY1").getGroup().getValue(), 10),
           zytxt: $.trim(esui.get("CustomZYName").getValue())
       };
       
       //验证
       if (data.disease1 == ""
           && data.disease2 == ""
           && data.disease3 == ""
           && data.diseasetxt == ""
       ) {
           esui.Dialog.alert({title: "提示", content: "请选择疾病诊断"});
           return;
       }
       if (data.disease1.indexOf("4") != -1 && isNaN(data.fy)) {
           esui.Dialog.alert({title: "提示", content: "请选择肺炎类型"});
           return;
       }
       if (data.disease1.indexOf("4") == -1) {
           data.fy = 0;
       }
       if (data.diagnosis == "") {
           esui.Dialog.alert({title: "提示", content: "请填写第一诊断"});
           return;
       }
       if (isNaN(data.zy)) {
           esui.Dialog.alert({title: "提示", content: "请选择中医诊断"});
           return;
       }
       if (data.zy == 6 && data.zytxt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写中医诊断"});
           return;
       }
       if (data.zy != 6) {
           data.zytxt = "";
       }
       
       console.log("crf/saveDeseaseInfo.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveDeseaseInfo.do",
            data: data,
            success: function(response) {
                console.log("crf/saveDeseaseInfo.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode30").click();
                } else {
                    esui.Dialog.alert({title: "保存", content: "保存成功！"});
                }
            },
            mock: MOCK,
            mockData: {
                success: true,
                progress: "30%"
            }
        });
    }
});
