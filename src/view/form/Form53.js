/*
 * 实验检查-心电图
 * 
 * @author: Ricky
 */

es.Views.Form53 = Backbone.View.extend({
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
        $.Mustache.load("asset/tpl/form/form53.html").done(function() {
            me.$el.mustache("tpl-form53", {
                data: data.data,
                disabled: es.main.editable ? "" : "disabled:true",
                save: es.main.editable ? [1] : []
            });
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        esui.init(document.body, {
            ExamDate: {
                range: CRF_RANGE,
                value: data.examDate
            }
        });
        
        //赋值
        var me = this;
        switch (data.done) {
            case 1: esui.get("Done1").setChecked(true); this.$(".exam").show(); break;
            case 2: esui.get("Done2").setChecked(true);
        }
        switch (data.normal) {
            case 1: esui.get("Normal1").setChecked(true); break;
            case 2: esui.get("Normal2").setChecked(true);
        }
        
        //事件
        esui.get("Done1").onclick = function() {me.$(".exam").show();};
        esui.get("Done2").onclick = function() {me.$(".exam").hide();};
        esui.get("ExamDate").onchange = function(value) {esui.get("ExamDate").setValueAsDate(value);};
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
        if (!es.main.editable) {
            esui.get("ExamDate").disable();
        }
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           done: parseInt(esui.get("Done1").getGroup().getValue(), 10),
           examDate: esui.get("ExamDate").getValue(),
           normal: parseInt(esui.get("Normal1").getGroup().getValue(), 10),
           description: $.trim(esui.get("Description").getValue())
       };
       
       //验证
       if (isNaN(data.done)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否做了心电图"});
           return;
       } else if (data.done == 2) {
           data.examDate = null;
           data.normal = 0;
           data.description = "";
       } else {
           if (isNaN(data.normal)) {
               esui.Dialog.alert({title: "提示", content: "请选择是否正常"});
               return;
           }
           if (data.normal == 1) {
               data.description = "";
           } else if (data.description == "") {
               esui.Dialog.alert({title: "提示", content: "请填写异常心电图描述"});
               return;
           }
       }
       
       console.log("crf/saveECGExam.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveECGExam.do",
            data: data,
            success: function(response) {
                console.log("crf/saveECGExam.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode60").click();
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
