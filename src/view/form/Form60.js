/*
 * 用药小结
 * 
 * @author: Ricky
 */

es.Views.Form60 = Backbone.View.extend({
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
        $.Mustache.load("asset/tpl/form/form60.html").done(function() {
            me.$el.mustache("tpl-form60", {
                data: data.data,
                disabled: es.main.editable ? "" : "disabled:true",
                save: es.main.editable ? [1] : []
            });
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        esui.init(document.body, {
            StartDate: {
                range: CRF_RANGE,
                value: data.startDate
            },
            EndDate: {
                range: CRF_RANGE,
                value: data.endDate
            },
            DeathDate: {
                range: CRF_RANGE,
                value: data.deathDate
            }
        });
        
        //赋值
        switch (data.ending) {
            case 1: esui.get("Ending1").setChecked(true); break;
            case 2: esui.get("Ending2").setChecked(true); break;
            case 3: esui.get("Ending3").setChecked(true); break;
            case 4: esui.get("Ending4").setChecked(true); break;
            case 5: esui.get("Ending5").setChecked(true); this.$(".death").show(); break;
            case 6: esui.get("Ending6").setChecked(true); break;
            case 7: esui.get("Ending7").setChecked(true);
        }
        switch (data.hasAdr) {
            case 1: esui.get("HasADR1").setChecked(true); break;
            case 2: esui.get("HasADR2").setChecked(true);
        }
        if (data.adr != "") {
            $.each(data.adr.split(","), function(index, val) {
                esui.get("ADR" + val).setChecked(true);
            });
        }
        if (data.adr1 != "") {
            $.each(data.adr1.split(","), function(index, val) {
                esui.get("ADR1_" + val).setChecked(true);
            });
        }
        if (data.adr2 != "") {
            $.each(data.adr2.split(","), function(index, val) {
                esui.get("ADR2_" + val).setChecked(true);
            });
        }
        if (data.adr3 != "") {
            $.each(data.adr3.split(","), function(index, val) {
                esui.get("ADR3_" + val).setChecked(true);
            });
        }
        if (data.adr4 != "") {
            $.each(data.adr4.split(","), function(index, val) {
                esui.get("ADR4_" + val).setChecked(true);
            });
        }
        if (data.adr5 != "") {
            $.each(data.adr5.split(","), function(index, val) {
                esui.get("ADR5_" + val).setChecked(true);
            });
        }
        if (data.adr6 != "") {
            $.each(data.adr6.split(","), function(index, val) {
                esui.get("ADR6_" + val).setChecked(true);
            });
        }
        switch (data.hasOtherAdr) {
            case 1: esui.get("HasOtherADR1").setChecked(true); this.$(".adr").show(); break;
            case 2: esui.get("HasOtherADR2").setChecked(true);
        }
        switch (data.unreasonable) {
            case 1: esui.get("Unreasonable1").setChecked(true); break;
            case 2: esui.get("Unreasonable2").setChecked(true);
        }
        switch (data.intervention) {
            case 1: esui.get("Intervention1").setChecked(true); this.$(".intervention").show(); break;
            case 2: esui.get("Intervention2").setChecked(true);
        }
        
        //事件
        var me = this;
        
        esui.get("StartDate").onchange = function(value) {esui.get("StartDate").setValueAsDate(value);};
        esui.get("EndDate").onchange = function(value) {esui.get("EndDate").setValueAsDate(value);};
        esui.get("DeathDate").onchange = function(value) {esui.get("DeathDate").setValueAsDate(value);};
        
        esui.get("Ending1").onclick = function() {me.$(".death").hide();};
        esui.get("Ending2").onclick = function() {me.$(".death").hide();};
        esui.get("Ending3").onclick = function() {me.$(".death").hide();};
        esui.get("Ending4").onclick = function() {me.$(".death").hide();};
        esui.get("Ending5").onclick = function() {me.$(".death").show();};
        esui.get("Ending6").onclick = function() {me.$(".death").hide();};
        esui.get("Ending7").onclick = function() {me.$(".death").hide();};
        
        esui.get("HasADR1").onclick = function() {me.$(".adr").show();};
        esui.get("HasADR2").onclick = function() {me.$(".adr").hide();};
        esui.get("Intervention1").onclick = function() {me.$(".intervention").show();};
        esui.get("Intervention2").onclick = function() {me.$(".intervention").hide();};
        
        esui.get("HasOtherADR1").onclick = function() {
            esui.Dialog.alert({title: "提示", content: "别忘记继续填写ADE！"});
        };
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
        if (!es.main.editable) {
            esui.get("StartDate").disable();
            esui.get("EndDate").disable();
            esui.get("DeathDate").disable();
        }
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           startDate: esui.get("StartDate").getValue(),
           endDate: esui.get("EndDate").getValue(),
           ending: parseInt(esui.get("Ending1").getGroup().getValue(), 10),
           deathDate: esui.get("DeathDate").getValue(),
           deathReason: $.trim(esui.get("DeathReason").getValue()),
           hasAdr: parseInt(esui.get("HasADR1").getGroup().getValue(), 10),
           adr: esui.get("ADR1").getGroup().getValue(),
           adr1: esui.get("ADR1_1").getGroup().getValue(),
           adr2: esui.get("ADR2_1").getGroup().getValue(),
           adr3: esui.get("ADR3_1").getGroup().getValue(),
           adr4: esui.get("ADR4_1").getGroup().getValue(),
           adr5: esui.get("ADR5_1").getGroup().getValue(),
           adr6: esui.get("ADR6_1").getGroup().getValue(),
           adrtxt: $.trim(esui.get("CustomADRName").getValue()),
           hasOtherAdr: parseInt(esui.get("HasOtherADR1").getGroup().getValue(), 10),
           unreasonable: parseInt(esui.get("Unreasonable1").getGroup().getValue(), 10),
           intervention: parseInt(esui.get("Intervention1").getGroup().getValue(), 10),
           interventiontxt: $.trim(esui.get("Intervention").getValue()),
           treatmentCost: $.trim(esui.get("Index1").getValue()),
           drugCost: $.trim(esui.get("Index2").getValue()),
           trqCost: $.trim(esui.get("Index3").getValue()),
           remark: $.trim(esui.get("Remark").getValue())
       };
       
       //验证
       var start = T.date.parse(data.startDate).getTime(),
           end = T.date.parse(data.endDate).getTime();
       if (start > end) {
           esui.Dialog.alert({title: "提示", content: "首次用药时间不能晚于末次用药时间"});
           return;
       }
       if (isNaN(data.ending)) {
           esui.Dialog.alert({title: "提示", content: "请选择痰热清注射液用药结局"});
           return;
       }
       if (data.ending != 5) {
           data.deathDate = null;
           data.deathReason = "";
       } else if (data.deathReason == "") {
           esui.Dialog.alert({title: "提示", content: "请填写直接死因"});
           return;
       }
       if (isNaN(data.hasAdr)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否出现过敏反应症状"});
           return;
       }
       if (data.hasAdr == 1) {
           if (data.adr == "") {
               esui.Dialog.alert({title: "提示", content: "请选择过敏反应症状"});
               return;
           }
           if (data.adr.indexOf("7") != -1 && data.adrtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他过敏反应症状"});
               return;
           }
           if (data.adr.indexOf("7") == -1) {
               data.adrtxt = "";
           }
       } else {
           data.adr = "";
           data.adr1 = "";
           data.adr2 = "";
           data.adr3 = "";
           data.adr4 = "";
           data.adr5 = "";
           data.adr6 = "";
           data.adrtxt = "";
       }
       if (isNaN(data.hasOtherAdr)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否出现其他不良反应/事件"});
           return;
       }
       if (isNaN(data.unreasonable)) {
           esui.Dialog.alert({title: "提示", content: "请选择有无痰热清注射液用药不合理的现象"});
           return;
       }
       if (isNaN(data.intervention)) {
           esui.Dialog.alert({title: "提示", content: "请选择药师是否进行相关干预"});
           return;
       }
       if (data.intervention == 1) {
            if (data.interventiontxt == "") {
                esui.Dialog.alert({title: "提示", content: "请填写药师如何进行干预"});
                return;
            }
       } else {
           data.interventiontxt = "";
       }
       var floatPattern = /^\d+(\.\d+)?$/;
       if (data.treatmentCost != "" && !floatPattern.test(data.treatmentCost)) {
           esui.Dialog.alert({title: "提示", content: "请填写治疗总费用"});
           return;
       }
       if (!floatPattern.test(data.drugCost)) {
           esui.Dialog.alert({title: "提示", content: "请填写药品总费用"});
           return;
       }
       if (!floatPattern.test(data.trqCost)) {
           esui.Dialog.alert({title: "提示", content: "请填写痰热清注射液费用"});
           return;
       }
       
       console.log("crf/saveDrugSummary.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveDrugSummary.do",
            data: data,
            success: function(response) {
                console.log("crf/saveDrugSummary.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode70").click();
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
