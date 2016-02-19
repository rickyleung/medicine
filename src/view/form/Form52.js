/*
 * 实验检查-实验室检查
 * 
 * @author: Ricky
 */

es.Views.Form52 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        "click .add-e1": "addE1",
        "click .add-e2": "addE2",
        "click .add-e3": "addE3",
        "click .add-e4": "addE4",
        "click .del-e1": "delE1",
        "click .del-e2": "delE2",
        "click .del-e3": "delE3",
        "click .del-e4": "delE4"
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
        $.Mustache.load("asset/tpl/form/form52.html").done(function() {
            var disabled = es.main.editable ? "" : "disabled:true";
            
            me.$el.mustache("tpl-form52", {
                data: data.data,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            });
            
            me.$(".e1").prepend($.Mustache.render("tpl-form52-e1", {
                data: data.data.data1,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.e1Count = data.data.data1.length;
            
            me.$(".e2").prepend($.Mustache.render("tpl-form52-e2", {
                data: data.data.data2,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.e2Count = data.data.data2.length;
            
            me.$(".e3").prepend($.Mustache.render("tpl-form52-e3", {
                data: data.data.data3,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.e3Count = data.data.data3.length;
            
            me.$(".e4").prepend($.Mustache.render("tpl-form52-e4", {
                data: data.data.data4,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.e4Count = data.data.data4.length;
            
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        var option = {
             ExamDate: {
                range: CRF_RANGE,
                value: data.examDate
            }
        };
        $.each(data.data1, function(index, val) {
            option["E1ExamDate" + val.no] = {range: CRF_RANGE, value: val.examDate};
        });
        $.each(data.data2, function(index, val) {
            option["E2ExamDate" + val.no] = {range: CRF_RANGE, value: val.examDate};
        });
        $.each(data.data3, function(index, val) {
            option["E3ExamDate" + val.no] = {range: CRF_RANGE, value: val.examDate};
        });
        $.each(data.data4, function(index, val) {
            option["E4ExamDate" + val.no] = {range: CRF_RANGE, value: val.examDate};
        });
        
        esui.init(document.body, option);
        
        switch (data.done) {
            case 1: esui.get("Done1").setChecked(true); this.$(".exam").show(); break;
            case 2: esui.get("Done2").setChecked(true);
        }
        switch (data.sample) {
            case 1: esui.get("Sample1").setChecked(true); break;
            case 2: esui.get("Sample2").setChecked(true); break;
            case 3: esui.get("Sample3").setChecked(true);
        }
        if (data.result != "") {
            $.each(data.result.split(","), function(index, val) {
                esui.get("Result" + val).setChecked(true);
            });
        }
        
        //事件
        var me = this;
        esui.get("Done1").onclick = function() {me.$(".exam").show();};
        esui.get("Done2").onclick = function() {me.$(".exam").hide();};
        
        $.each(data.data1, function(index, val) {
            var examDate = esui.get("E1ExamDate" + val.no);
            examDate.onchange = function(value) {examDate.setValueAsDate(value);};
            if (!es.main.editable) {
                examDate.disable();
            }
        });
        $.each(data.data2, function(index, val) {
            var examDate = esui.get("E2ExamDate" + val.no);
            examDate.onchange = function(value) {examDate.setValueAsDate(value);};
            if (!es.main.editable) {
                examDate.disable();
            }
        });
        $.each(data.data3, function(index, val) {
            var examDate = esui.get("E3ExamDate" + val.no);
            examDate.onchange = function(value) {examDate.setValueAsDate(value);};
            if (!es.main.editable) {
                examDate.disable();
            }
        });
        $.each(data.data4, function(index, val) {
            var examDate = esui.get("E4ExamDate" + val.no);
            examDate.onchange = function(value) {examDate.setValueAsDate(value);};
            if (!es.main.editable) {
                examDate.disable();
            }
        });
        esui.get("ExamDate").onchange = function(value) {
            esui.get("ExamDate").setValueAsDate(value);
        };
        if (!es.main.editable) {
            esui.get("ExamDate").disable();
        }
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
    },
    
    addRow: function(number, el) {
        var no = ++this["e" + number + "Count"];
        $(el).parent().before($.Mustache.render("tpl-form52-e" + number, {
            data: [{no: no}],
            disabled: "",
            save: [1]
        }));
        var option = {},
            id = "E" + number + "ExamDate" + no;
        
        option[id] = {
            range: CRF_RANGE,
            value: T.date.format(new Date(), "yyyy-MM-dd")
        };
        esui.init(this.el, option);
        esui.get(id).onchange = function(value) {esui.get(id).setValueAsDate(value);};
    },
    
    addE1: function(e) {
        this.addRow(1, e.target);
    },
    
    addE2: function(e) {
        this.addRow(2, e.target);
    },
    
    addE3: function(e) {
        this.addRow(3, e.target);
    },
    
    addE4: function(e) {
        this.addRow(4, e.target);
    },
    
    delRow: function(number, el) {
        var block = $(el).parent().parent();
        esui.dispose("E" + number + "ExamDate" + block.attr("no"));
        block.remove();
    },
    
    delE1: function(e) {
        this.delRow(1, e.target);
    },
    
    delE2: function(e) {
        this.delRow(2, e.target);
    },
    
    delE3: function(e) {
        this.delRow(3, e.target);
    },
    
    delE4: function(e) {
        this.delRow(4, e.target);
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           done: parseInt(esui.get("Done1").getGroup().getValue(), 10),
           examDate: esui.get("ExamDate").getValue(),
           sample: parseInt(esui.get("Sample1").getGroup().getValue(), 10),
           sampletxt: $.trim(esui.get("SampleName").getValue()),
           result: esui.get("Result1").getGroup().getValue(),
           resulttxt1: $.trim(esui.get("Result1Content").getValue()),
           resulttxt2: $.trim(esui.get("Result2Content").getValue()),
           resulttxt3: $.trim(esui.get("Result3Content").getValue()),
           data1: [],
           data2: [],
           data3: [],
           data4: []
       };
       
       $.each(me.$(".e1-block"), function(index, val) {
           var no = $(val).attr("no");
           data.data1.push({
               examDate: esui.get("E1ExamDate" + no).getValue(),
               value1: $.trim(esui.get("E1V1" + no).getValue()),
               value2: $.trim(esui.get("E1V2" + no).getValue())
           });
       });
       $.each(me.$(".e2-block"), function(index, val) {
           var no = $(val).attr("no");
           data.data2.push({
               examDate: esui.get("E2ExamDate" + no).getValue(),
               value1: $.trim(esui.get("E2V1" + no).getValue()),
               value2: $.trim(esui.get("E2V2" + no).getValue()),
               value3: $.trim(esui.get("E2V3" + no).getValue()),
               value4: $.trim(esui.get("E2V4" + no).getValue()),
               value5: $.trim(esui.get("E2V5" + no).getValue()),
               value6: $.trim(esui.get("E2V6" + no).getValue())
           });
       });
       $.each(me.$(".e3-block"), function(index, val) {
           var no = $(val).attr("no");
           data.data3.push({
               examDate: esui.get("E3ExamDate" + no).getValue(),
               value1: $.trim(esui.get("E3V1" + no).getValue()),
               value2: $.trim(esui.get("E3V2" + no).getValue()),
               value3: $.trim(esui.get("E3V3" + no).getValue()),
               value4: $.trim(esui.get("E3V4" + no).getValue()),
               value5: $.trim(esui.get("E3V5" + no).getValue())
           });
       });
       $.each(me.$(".e4-block"), function(index, val) {
           var no = $(val).attr("no");
           data.data4.push({
               examDate: esui.get("E4ExamDate" + no).getValue(),
               value1: $.trim(esui.get("E4V1" + no).getValue()),
               value2: $.trim(esui.get("E4V2" + no).getValue())
           });
       });
       
       if (isNaN(data.done)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否做了实验室检查"});
           return;
       } else if (data.done == 2) {
           data.examDate = null;
           data.sample = 0;
           data.sampletxt = "";
           data.result = "";
           data.resulttxt1 = "";
           data.resulttxt2 = "";
           data.resulttxt3 = "";
       } else {
           if (isNaN(data.sample)) {
               esui.Dialog.alert({title: "提示", content: "请选择送检样本"});
               return;
           }
           if (data.sample != 3) {
               data.sampletxt = "";
           } else if (data.sampletxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他送检样本"});
               return;
           }
           if (data.result.indexOf("1") != -1 && data.resulttxt1 == "") {
               esui.Dialog.alert({title: "提示", content: "请填写细菌培养"});
               return;
           }
           if (data.result.indexOf("1") == -1) {
               data.resulttxt1 = "";
           }
           if (data.result.indexOf("2") != -1 && data.resulttxt2 == "") {
               esui.Dialog.alert({title: "提示", content: "请填写支原体抗体"});
               return;
           }
           if (data.result.indexOf("2") == -1) {
               data.resulttxt2 = "";
           }
           if (data.result.indexOf("3") != -1 && data.resulttxt3 == "") {
               esui.Dialog.alert({title: "提示", content: "请填写病毒咽拭子"});
               return;
           }
           if (data.result.indexOf("3") == -1) {
               data.resulttxt3 = "";
           }
       }
       
       console.log("crf/saveDrugUseExam.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveDrugUseExam.do",
            data: JSON.stringify(data),
            json: true,
            success: function(response) {
                console.log("crf/saveDrugUseExam.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode53").click();
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
