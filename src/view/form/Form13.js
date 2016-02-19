/*
 * 患者信息-既往史
 * 
 * @author: Ricky
 */

es.Views.Form13 = Backbone.View.extend({
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
        $.Mustache.load("asset/tpl/form/form13.html").done(function() {
            me.$el.mustache("tpl-form13", {
                data: data.data,
                disabled: es.main.editable ? "" : "disabled:true",
                save: es.main.editable ? [1] : []
            });
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        var me = this;
        esui.init(document.body, {
            GXBLevel: {
                datasource: GXB_LEVEL.datasource,
                value: data.gxb
            },
            GXYLevel: {
                datasource: GXY_LEVEL.datasource,
                value: data.gxy
            },
            TNBType: {
                datasource: TNB_Type.datasource,
                value: data.tnb
            }
        });
        switch (data.hasDisease) {
            case 1: esui.get("Disease1").setChecked(true); this.$(".disease").show(); break;
            case 2: esui.get("Disease2").setChecked(true); break;
            case 3: esui.get("Disease3").setChecked(true);
        }
        switch (data.hasAllergy) {
            case 1: esui.get("ADisease1").setChecked(true); this.$(".a-disease").show(); break;
            case 2: esui.get("ADisease2").setChecked(true); break;
            case 3: esui.get("ADisease3").setChecked(true);
        }
        if (data.disease != "") {
            $.each(data.disease.split(","), function(index, val) {
                esui.get("DiseaseType" + val).setChecked(true);
                if (val == "1") {
                    me.$(".heart-disease").show();
                }
                if (val == "2") {
                    me.$(".brain-disease").show();
                }
                if (val == "7") {
                    me.$("#ctrlselectTNBType").show();
                }
            });
        }
        if (data.disease1 != "") {
            $.each(data.disease1.split(","), function(index, val) {
                esui.get("DiseaseType1_" + val).setChecked(true);
                if (val == "1") {
                    me.$(".heart").show();
                    me.$("#ctrlselectGXBLevel").show();
                }
                if (val == "2") {
                    me.$("#ctrlselectGXYLevel").show();
                }
            });
        }
        if (data.disease2 != "") {
            $.each(data.disease2.split(","), function(index, val) {
                esui.get("DiseaseType2_" + val).setChecked(true);
            });
        }
        if (data.allergy != "") {
            $.each(data.allergy.split(","), function(index, val) {
                esui.get("ADiseaseType" + val).setChecked(true);
            });
        }
        
        //事件
        esui.get("Disease1").onclick = function() {me.$(".disease").show();};
        esui.get("Disease2").onclick = function() {me.$(".disease").hide();};
        esui.get("Disease3").onclick = function() {me.$(".disease").hide();};
        esui.get("ADisease1").onclick = function() {me.$(".a-disease").show();};
        esui.get("ADisease2").onclick = function() {me.$(".a-disease").hide();};
        esui.get("ADisease3").onclick = function() {me.$(".a-disease").hide();};
        esui.get("DiseaseType1").onclick = function() {
            if (esui.get("DiseaseType1").isChecked()) {
                me.$(".heart-disease").show();
            } else {
                me.$(".heart-disease").hide();
            }
        };
        esui.get("DiseaseType2").onclick = function() {
            if (esui.get("DiseaseType2").isChecked()) {
                me.$(".brain-disease").show();
            } else {
                me.$(".brain-disease").hide();
            }
        };
        esui.get("DiseaseType1_1").onclick = function() {
            if (esui.get("DiseaseType1_1").isChecked()) {
                me.$(".heart").show();
                me.$("#ctrlselectGXBLevel").show();
            } else {
                me.$(".heart").hide();
                me.$("#ctrlselectGXBLevel").hide();
            }
        };
        esui.get("DiseaseType1_2").onclick = function() {
            if (esui.get("DiseaseType1_2").isChecked()) {
                me.$("#ctrlselectGXYLevel").show();
            } else {
                me.$("#ctrlselectGXYLevel").hide();
            }
        };
        esui.get("DiseaseType7").onclick = function() {
            if (esui.get("DiseaseType7").isChecked()) {
                me.$("#ctrlselectTNBType").show();
            } else {
                me.$("#ctrlselectTNBType").hide();
            }
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
           
           hasDisease: parseInt(esui.get("Disease1").getGroup().getValue(), 10),
           hasAllergy: parseInt(esui.get("ADisease1").getGroup().getValue(), 10),
           disease: esui.get("DiseaseType1").getGroup().getValue(),
           disease1: esui.get("DiseaseType1_1").getGroup().getValue(),
           disease2: esui.get("DiseaseType2_1").getGroup().getValue(),
           diseasetxt: $.trim(esui.get("CustomDiseaseTypeName").getValue()),
           gxb: esui.get("GXBLevel").value,
           gxy: esui.get("GXYLevel").value,
           tnb: esui.get("TNBType").value,
           allergy: esui.get("ADiseaseType1").getGroup().getValue(),
           allergytxt: $.trim(esui.get("CustomADiseaseTypeName").getValue())
       };
       
       //验证
       if (isNaN(data.hasDisease)) {
           esui.Dialog.alert({title: "提示", content: "请选择常见疾病"});
           return;
       } else if (data.hasDisease == 1) {
           if (data.disease == "") {
               esui.Dialog.alert({title: "提示", content: "请选择常见疾病"});
               return;
           }
           if (data.disease.indexOf("1") != -1) {
               if (data.disease1 == "") {
                   esui.Dialog.alert({title: "提示", content: "请选择心血管疾病"});
                   return;
               } else {
                   if (data.disease1.indexOf("1") != -1) {
                       if (data.gxb == 0) {
                           esui.Dialog.alert({title: "提示", content: "请选择冠心病心功能分级"});
                           return;
                       }
                   } else {
                       data.gxb = 0;
                   }
                   if (data.disease1.indexOf("2") != -1) {
                       if (data.gxy == 0) {
                           esui.Dialog.alert({title: "提示", content: "请选择高血压分级"});
                           return;
                       }
                   } else {
                       data.gxy = 0;
                   }
               }
           }
           if (data.disease.indexOf("2") != -1 && data.disease2 == "") {
               esui.Dialog.alert({title: "提示", content: "请选择脑血管疾病"});
               return;
           }
           if (data.disease.indexOf("7") != -1) {
               if (data.tnb == 0) {
                   esui.Dialog.alert({title: "提示", content: "请选择糖尿病类型"});
                   return;
               }
           } else {
               data.tnb = 0;
           }
           if (data.disease.indexOf("8") != -1) {
               if (data.diseasetxt == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写其他常见疾病"});
                   return;
               }
           } else {
               data.diseasetxt = "";
           }
       }
       if (isNaN(data.hasAllergy)) {
           esui.Dialog.alert({title: "提示", content: "请选择过敏性疾病史"});
           return;
       } else if (data.hasAllergy == 1) {
           if (data.allergy == "") {
               esui.Dialog.alert({title: "提示", content: "请选择过敏性疾病史"});
               return;
           }
           if (data.allergy.indexOf("6") != -1 && data.allergytxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他过敏性疾病史"});
               return;
           }
           if (data.allergy.indexOf("6") == -1) {
               data.allergytxt = "";
           }
       }
       
       console.log("crf/savePastHistory.do-请求", data);
       
       util.ajax.run({
            url: "crf/savePastHistory.do",
            data: data,
            success: function(response) {
                console.log("crf/savePastHistory.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode20").click();
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
