/*
 * 患者信息-基本情况
 * 
 * @author: Ricky
 */

es.Views.Form11 = Backbone.View.extend({
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
        $.Mustache.load("asset/tpl/form/form11.html").done(function() {
            me.$el.mustache("tpl-form11", {
                data: data.data,
                disabled: es.main.editable ? "" : "disabled:true",
                save: es.main.editable ? [1] : []
            });
            me.initCtrl(data.data);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        esui.init(document.body, {
            Birthday: {
                range: BIRTHDAY_RANGE,
                value: data.birthday
            },
            InDate: {
                range: CRF_RANGE,
                value: data.indate
            },
            OutDate: {
                range: CRF_RANGE,
                value: data.outdate
            },
            Nation: {
                datasource: NATION,
                value: data.ethic
            }
        });
        
        esui.get("Age").setValue(util.getAge(T.date.parse(data.birthday)) + "");
        
        switch (data.sex) {
            case 1: esui.get("Male").setChecked(true); break;
            case 2: esui.get("Female").setChecked(true); this.$(".female").show();
        }
        switch (data.hys) {
            case 1: esui.get("Female1").setChecked(true); break;
            case 2: esui.get("Female2").setChecked(true);
        }
        
        if (data.weightud) {
            esui.get("WeightUd").setChecked(true);
        }
        if (data.heightud) {
            esui.get("HeightUd").setChecked(true);
        }
        
        switch (data.yyks) {
            case 1: esui.get("Dep1").setChecked(true); break;
            case 2: esui.get("Dep2").setChecked(true); break;
            case 3: esui.get("Dep3").setChecked(true); break;
            case 4: esui.get("Dep4").setChecked(true); break;
            case 5: esui.get("Dep5").setChecked(true); break;
            case 6: esui.get("Dep6").setChecked(true);
        }
        
        switch (data.feemode) {
            case 1: esui.get("Pay1").setChecked(true); break;
            case 2: esui.get("Pay2").setChecked(true); break;
            case 3: esui.get("Pay3").setChecked(true); break;
            case 4: esui.get("Pay4").setChecked(true); break;
            case 5: esui.get("Pay5").setChecked(true);
        }
        
        //事件
        var me = this;
        
        esui.get("Birthday").onchange = function(value) {
            esui.get("Birthday").setValueAsDate(value);
            esui.get("Age").setValue(util.getAge(value));
        };
        esui.get("InDate").onchange = function(value) {esui.get("InDate").setValueAsDate(value);};
        esui.get("OutDate").onchange = function(value) {esui.get("OutDate").setValueAsDate(value);};
        
        esui.get("Male").onclick = function() {me.$(".female").hide();};
        esui.get("Female").onclick = function() {me.$(".female").show();};
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
        if (!es.main.editable) {
            esui.get("Birthday").disable();
            esui.get("InDate").disable();
            esui.get("OutDate").disable();
        }
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           
           birthday: esui.get("Birthday").getValue(),
           age: parseInt(esui.get("Age").getValue(), 10),
           ethic: esui.get("Nation").value,
           sex: parseInt(esui.get("Male").getGroup().getValue(), 10),
           hys: parseInt(esui.get("Female1").getGroup().getValue(), 10),
           weight: $.trim(esui.get("Weight").getValue()),
           weightud: esui.get("WeightUd").isChecked(),
           height: $.trim(esui.get("Height").getValue()),
           heightud: esui.get("HeightUd").isChecked(),
           yyks: parseInt(esui.get("Dep1").getGroup().getValue(), 10),
           yykstxt: $.trim(esui.get("CustomDepName").getValue()),
           indate: esui.get("InDate").getValue(),
           outdate: esui.get("OutDate").getValue(),
           feemode: parseInt(esui.get("Pay1").getGroup().getValue(), 10),
           feemodetxt: $.trim(esui.get("CustomPayName").getValue())
       };
       
       //验证
       if (data.ethic == 0) {
           esui.Dialog.alert({title: "提示", content: "请选择民族"});
           return;
       }
       if (isNaN(data.sex)) {
           esui.Dialog.alert({title: "提示", content: "请选择性别"});
           return;
       } else if (data.sex == 2 && isNaN(data.hys)) {
           esui.Dialog.alert({title: "提示", content: "请选择女性所处时期"});
           return;
       }
       if (data.sex == 1) {
           data.hys = 0;
       }
       var weight = data.weight,
           height = data.height,
           floatPattern = /^\d+(\.\d+)?$/;
       if (!data.weightud) {
           if (weight == "") {
               esui.Dialog.alert({title: "提示", content: "请填写体重"});
               return;
           } else if (!floatPattern.test(weight)) {
               esui.Dialog.alert({title: "提示", content: "体重应为数字"});
               return;
           } else if (parseFloat(weight) > 150) {
               esui.Dialog.alert({title: "提示", content: "体重范围不正确"});
               return;
           }
       } else {
           data.weight = "";
       }
       if (!data.heightud) {
           if (height == "") {
               esui.Dialog.alert({title: "提示", content: "请填写身高"});
               return;
           } else if (!floatPattern.test(height)) {
               esui.Dialog.alert({title: "提示", content: "身高应为数字"});
               return;
           } else if (parseFloat(height) > 200 || parseFloat(height) < 10) {
               esui.Dialog.alert({title: "提示", content: "身高范围不正确"});
               return;
           }
       } else {
           data.height = "";
       }
       var indate = T.date.parse(data.indate).getTime(),
           outdate = T.date.parse(data.outdate).getTime();
       if (indate > outdate) {
           esui.Dialog.alert({title: "提示", content: "入院日期不能晚于出院日期"});
           return;
       }
       if (isNaN(data.yyks)) {
           esui.Dialog.alert({title: "提示", content: "请选择用药科室"});
           return;
       } else if (data.yyks == 6 && data.yykstxt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写其他用药科室"});
           return;
       }
       if (data.yyks != 6) {
           data.yykstxt = "";
       }
       if (isNaN(data.feemode)) {
           esui.Dialog.alert({title: "提示", content: "请选择医疗费用方式"});
           return;
       } else if (data.feemode == 5 && data.feemodetxt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写医疗费用方式"});
           return;
       }
       if (data.feemode != 5) {
           data.feemodetxt = "";
       }
       
       console.log("crf/saveBasicInfo.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveBasicInfo.do",
            data: data,
            success: function(response) {
                console.log("crf/saveBasicInfo.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode12").click();
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
