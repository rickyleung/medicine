/*
 * 实验检查-体格检查
 * 
 * @author: Ricky
 */

es.Views.Form51 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        "click .add-btn": "add",
        "click .del-btn": "del"
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
        $.Mustache.load("asset/tpl/form/form51.html").done(function() {
            var disabled = es.main.editable ? "" : "disabled:true";
            
            me.$el.mustache("tpl-form51", {
                data: data.data,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            });
            
            me.$(".exam").prepend($.Mustache.render("tpl-form51-exam", {
                data: data.data.exam,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.examCount = data.data.exam.length;
            
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        var option = {};
        $.each(data.exam, function(index, val) {
            option["ExamDate" + val.no] = {range: CRF_RANGE, value: val.examDate};
        });
        esui.init(document.body, option);
        
        var me = this;
        
        switch (data.done) {
            case 1: esui.get("Done1").setChecked(true); this.$(".exam").show(); break;
            case 2: esui.get("Done2").setChecked(true);
        }
        
        //事件
        esui.get("Done1").onclick = function() {me.$(".exam").show();};
        esui.get("Done2").onclick = function() {me.$(".exam").hide();};
        $.each(data.exam, function(index, val) {
            var examDate = esui.get("ExamDate" + val.no);
            examDate.onchange = function(value) {examDate.setValueAsDate(value);};
            if (!es.main.editable) {
                examDate.disable();
            }
        });
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
    },
    
    add: function(e) {
        var no = ++this.examCount;
        $(e.target).parent().before($.Mustache.render("tpl-form51-exam", {
            data: [{no: no}],
            disabled: "",
            save: [1]
        }));
        var option = {},
            id = "ExamDate" + no;
        option[id] = {
            range: CRF_RANGE,
            value: T.date.format(new Date(), "yyyy-MM-dd")
        };
        esui.init(this.el, option);
        esui.get(id).onchange = function(value) {esui.get(id).setValueAsDate(value);};
    },
    
    del: function(e) {
        var block = $(e.target).parent().parent();
        esui.dispose("ExamDate" + block.attr("no"));
        block.remove();
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           done: parseInt(esui.get("Done1").getGroup().getValue(), 10),
           exam: []
       };
       
       $.each(me.$(".exam-block"), function(index, val) {
           var no = $(val).attr("no");
           data.exam.push({
               examDate: esui.get("ExamDate" + no).getValue(),
               temperature: $.trim(esui.get("Temperature" + no).getValue()),
               breathe: $.trim(esui.get("Breathe" + no).getValue()),
               ssy: $.trim(esui.get("Ssy" + no).getValue()),
               szy: $.trim(esui.get("Szy" + no).getValue()),
               rate: $.trim(esui.get("Rate" + no).getValue())
           });
       });
       
       //验证
       if (isNaN(data.done)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否做了体格检查"});
           return;
       } else if (data.done == 2) {
           data.exam = [];
       } else {
           if (data.exam.length == 0) {
               esui.Dialog.alert({title: "提示", content: "请填写体格检查"});
               return;
           }
           var floatPattern = /^\d+(\.\d+)?$/;
           for (var i = 0, n = data.exam.length; i < n; i++) {
               var item = data.exam[i], no = i + 1;
               if (!floatPattern.test(item.temperature)) {
                   esui.Dialog.alert({title: "提示", content: "请填写第" + no + "个体温"});
                   return;
               }
               if (!floatPattern.test(item.breathe)) {
                   esui.Dialog.alert({title: "提示", content: "请填写第" + no + "个呼吸"});
                   return;
               }
               if (!floatPattern.test(item.ssy)) {
                   esui.Dialog.alert({title: "提示", content: "请填写第" + no + "个收缩压"});
                   return;
               }
               if (!floatPattern.test(item.szy)) {
                   esui.Dialog.alert({title: "提示", content: "请填写第" + no + "个舒张压"});
                   return;
               }
               if (!floatPattern.test(item.rate)) {
                   esui.Dialog.alert({title: "提示", content: "请填写第" + no + "个心率"});
                   return;
               }
           }
       }
       
       console.log("crf/saveBodyExam.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveBodyExam.do",
            data: JSON.stringify(data),
            json: true,
            success: function(response) {
                console.log("crf/saveBodyExam.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode52").click();
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
