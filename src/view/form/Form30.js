/*
 * 用药情况
 * 
 * @author: Ricky
 */

es.Views.Form30 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        "click .times a": "switchTimes",
        "click .times span": "addTimes",
        "click .add-bottle": "addBottle",
        "click .add-injection": "addInjection",
        "click .add-drug": "addDrug"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderForm, this);
        
        //获取用药情况列表
        var me = this;
        util.ajax.run({
            url: "crf/getDrugUseInfoNum.do",
            data: {id: es.main.crfId},
            success: function(response) {
                console.log("crf/getDrugUseInfoNum.do", response);
                
                if (response.data == null) {
                    //创建第一次
                    util.ajax.run({
                        url: "crf/addNewDrugUseInfo.do",
                        data: {id: es.main.crfId},
                        success: function(response) {
                            console.log("crf/addNewDrugUseInfo.do", response);
                            
                            me.drugUseIdList = [response.data.drugUseId];
                            me.rendered = false;
                            me.model.getData({
                                id: es.main.crfId,
                                drugUseId: me.drugUseIdList[0] //获取第一次
                            });
                        },
                        mock: MOCK,
                        mockData: {
                            success: true,
                            data: {
                                drugUseId: 1
                            }
                        }
                    });
                } else {
                    me.drugUseIdList = response.data.drugUseIdList;
                    me.rendered = false;
                    me.model.getData({
                        id: es.main.crfId,
                        drugUseId: me.drugUseIdList[0] //获取第一次
                    });
                }
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: /*{
                    drugUseIdList: [1, 2, 3]
                }*/null
            }
        });
    },
    
    destroy: function() {
        esui.dispose();
        this.$("input.sug").autocomplete("destroy");
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    switchTimes: function(e) {
        var me = $(e.target);
        if (me.hasClass("active")) {
            return;
        }
        
        this.$(".times a").removeClass("active");
        me.addClass("active");
        
        this.model.getData({
            id: es.main.crfId,
            drugUseId: parseInt(me.attr("id"), 10)
        });
    },
    
    addTimes: function(e) {
        var me = $(e.target),
            view = this;
        util.ajax.run({
            url: "crf/addNewDrugUseInfo.do",
            data: {id: es.main.crfId},
            success: function(response) {
                console.log("crf/addNewDrugUseInfo.do", response);
                me.before($.Mustache.render("tpl-form30-times", {
                    n: view.$(".times a").length + 1,
                    id: response.data.drugUseId
                }));
            },
            mock: MOCK,
            mockData: {
                success: true,
                data: {
                    drugUseId: 2
                }
            }
        });
    },
    
    renderForm: function(model, data) {
        var disabled = es.main.editable ? "" : "disabled:true";
        
        if (!this.rendered) {
            //插入质疑对话框
            if (es.main.canDoubt) {
                es.main.$el.append($.Mustache.render("tpl-doubt-dialog"));
            }
            es.main.$el.append($.Mustache.render("tpl-check-doubt-dialog"));
            
            var me = this;
            $.Mustache.load("asset/tpl/form/form30.html").done(function() {
                me.$el.mustache("tpl-form30", {
                    data: data.data,
                    disabled: disabled,
                    save: es.main.editable ? [1] : []
                });
                //用药次数
                var btnHtml = [];
                $.each(me.drugUseIdList, function(index, val) {
                    btnHtml.push($.Mustache.render("tpl-form30-times", {
                        n: index + 1,
                        id: val
                    }));
                });
                me.$(".times").prepend(btnHtml.join(""));
                me.$(".times a:first").addClass("active");
                //用药情况
                me.$(".form30-body").mustache("tpl-form30-body", {
                    data: data.data,
                    disabled: disabled,
                    save: es.main.editable ? [1] : []
                });
                me.$(".bottles").prepend($.Mustache.render("tpl-form30-bottle", {
                    bottle: data.data.bottle,
                    disabled: disabled
                }));
                me.$(".injections-tip").after($.Mustache.render("tpl-form30-injection", {
                    injection: data.data.injection,
                    disabled: disabled
                }));
                me.$(".add-drug").parent().before($.Mustache.render("tpl-form30-drug", {
                    banDrug: data.data.banDrug,
                    disabled: disabled
                }));
                
                me.initCtrl(data.data);
                
                me.rendered = true;
            });
        } else { //切换次数
            esui.dispose("Start");
            esui.dispose("End");
            
            //用药情况
            this.$(".form30-body").html($.Mustache.render("tpl-form30-body", {
                data: data.data,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            this.$(".bottles").prepend($.Mustache.render("tpl-form30-bottle", {
                bottle: data.data.bottle,
                disabled: disabled
            }));
            this.$(".injections-tip").after($.Mustache.render("tpl-form30-injection", {
                injection: data.data.injection,
                disabled: disabled
            }));
            this.$(".add-drug").parent().before($.Mustache.render("tpl-form30-drug", {
                banDrug: data.data.banDrug,
                disabled: disabled
            }));
            
            this.initCtrl(data.data);
        }
    },
    
    initCtrl: function(data) {
        esui.init(document.body, {
            Start: {
                range: CRF_RANGE,
                value: data.startDate
            },
            End: {
                range: CRF_RANGE,
                value: data.endDate
            }
        });
        
        //赋值
        switch (data.history) {
            case 1: esui.get("History1").setChecked(true); this.$(".history").show(); break;
            case 2: esui.get("History2").setChecked(true); break;
            case 3: esui.get("History3").setChecked(true);
        }
        switch (data.adr) {
            case 1: esui.get("ADR1").setChecked(true); break;
            case 2: esui.get("ADR2").setChecked(true); break;
            case 3: esui.get("ADR3").setChecked(true);
        }
        switch (data.solvent) {
            case 1: esui.get("Solvent1").setChecked(true); break;
            case 2: esui.get("Solvent2").setChecked(true); break;
            case 3: esui.get("Solvent3").setChecked(true);
        }
        if (data.prepareTimeUd) {
            esui.get("PrepareTimeUd").setChecked(true);
        }
        switch (data.location) {
            case 1: esui.get("Location1").setChecked(true); break;
            case 2: esui.get("Location2").setChecked(true); break;
            case 3: esui.get("Location3").setChecked(true);
        }
        switch (data.way) {
            case 1: esui.get("Way1").setChecked(true); break;
            case 2: esui.get("Way2").setChecked(true); break;
            case 3: esui.get("Way3").setChecked(true);
        }
        switch (data.sameBottle) {
            case 1: esui.get("SameBottle1").setChecked(true); break;
            case 2: esui.get("SameBottle2").setChecked(true); this.$(".bottles").show();
        }
        switch (data.sameGroup) {
            case 1: esui.get("SameGroup1").setChecked(true); this.$(".gap").show(); break;
            case 2: esui.get("SameGroup2").setChecked(true);
        }
        switch (data.useSolvent) {
            case 1: esui.get("Gap1").setChecked(true); this.$(".use-gap").show(); break;
            case 2: esui.get("Gap2").setChecked(true); this.$(".not-use-gap").show(); 
        }
        switch (data.gpSolvent) {
            case 1: esui.get("GpSolvent1").setChecked(true); break;
            case 2: esui.get("GpSolvent2").setChecked(true); break;
            case 3: esui.get("GpSolvent3").setChecked(true);
        }
        switch (data.prevGroup) {
            case 1: esui.get("PrevGroup1").setChecked(true); break;
            case 2: esui.get("PrevGroup2").setChecked(true);
        }
        switch (data.nextGroup) {
            case 1: esui.get("NextGroup1").setChecked(true); break;
            case 2: esui.get("NextGroup2").setChecked(true);
        }
        switch (data.hasInjection) {
            case 1: esui.get("HasInjection1").setChecked(true); this.$(".injections").show(); break;
            case 2: esui.get("HasInjection2").setChecked(true);
        }
        switch (data.hasBan) {
            case 1: esui.get("HasBan1").setChecked(true); this.$(".ban").show(); break;
            case 2: esui.get("HasBan2").setChecked(true);
        }
        switch (data.ban) {
            case 1: esui.get("Ban1").setChecked(true); break;
            case 2: esui.get("Ban2").setChecked(true); break;
            case 3: esui.get("Ban3").setChecked(true); break;
            case 4: esui.get("Ban4").setChecked(true);
        }
        switch (data.hasFood) {
            case 1: esui.get("HasFood1").setChecked(true); this.$(".food").show(); break;
            case 2: esui.get("HasFood2").setChecked(true); break;
            case 3: esui.get("HasFood3").setChecked(true);
        }
        if (data.food != "") {
            $.each(data.food.split(","), function(index, val) {
                esui.get("Food" + val).setChecked(true);
            });
        }
        
        //事件
        var me = this;
        esui.get("Start").onchange = function(value) {
            esui.get("Start").setValueAsDate(value);
            esui.get("End").setValueAsDate(value);
        };
        esui.get("End").onchange = function(value) {esui.get("End").setValueAsDate(value);};
        esui.get("SameBottle1").onclick = function() {me.$(".bottles").show();};
        esui.get("SameBottle2").onclick = function() {me.$(".bottles").hide();};
        esui.get("SameGroup1").onclick = function() {me.$(".gap").show();};
        esui.get("SameGroup2").onclick = function() {me.$(".gap").hide();};
        esui.get("Gap1").onclick = function() {me.$(".use-gap").show();me.$(".not-use-gap").hide();};
        esui.get("Gap2").onclick = function() {me.$(".use-gap").hide();me.$(".not-use-gap").show();};
        esui.get("HasInjection1").onclick = function() {me.$(".injections").show();};
        esui.get("HasInjection2").onclick = function() {me.$(".injections").hide();};
        esui.get("HasBan1").onclick = function() {me.$(".ban").show();};
        esui.get("HasBan2").onclick = function() {me.$(".ban").hide();};
        esui.get("HasFood1").onclick = function() {me.$(".food").show();};
        esui.get("HasFood2").onclick = function() {me.$(".food").hide();};
        esui.get("HasFood3").onclick = function() {me.$(".food").hide();};
        
        this.$("input.sug").autocomplete({source: util.getSuggestion("drug")});
        
        if (!this.rendered) {
            esui.get("History1").onclick = function() {me.$(".history").show();};
            esui.get("History2").onclick = function() {me.$(".history").hide();};
            esui.get("History3").onclick = function() {me.$(".history").hide();};
            
            if (es.main.canDoubt) {
                esui.get("DoubtOK").onclick = es.main.doubtCRF;
            }
            if (es.main.editable) {
                esui.get("Save").onclick = this.save;
                esui.get("Delete").onclick = this.onDel;
            }
        }
        if (!es.main.editable) {
            esui.get("Start").disable();
            esui.get("End").disable();
        }
    },
    
    addBottle: function(e) {
        var no = this.$(".bottle").length + 1;
        $(e.target).parent().before($.Mustache.render("tpl-form30-bottle", {
            bottle: [{no: no}],
            disabled: ""
        }));
        esui.init();
        this.$("#ctrltextBottleName" + no).autocomplete({source: util.getSuggestion("drug")});
    },
    
    addInjection: function(e) {
        var no = this.$(".injection").length + 1;
        $(e.target).parent().before($.Mustache.render("tpl-form30-injection", {
            injection: [{no: no}],
            disabled: ""
        }));
        esui.init();
        this.$("#ctrltextInjectionName" + no).autocomplete({source: util.getSuggestion("drug")});
    },
    
    addDrug: function(e) {
        var no = this.$(".ban-drug").length + 1;
        $(e.target).parent().before($.Mustache.render("tpl-form30-drug", {
            banDrug: [{no: no}],
            disabled: ""
        }));
        esui.init();
        this.$("#ctrltextDrugName" + no).autocomplete({source: util.getSuggestion("drug")});
    },
    
    onDel: function() {
        if ($(".times a").length == 1) {
            esui.Dialog.alert({title: "提示", content: "不能删除"});
        } else {
            esui.Dialog.confirm({
                title: "删除",
                content: "确定删除本次用药情况？",
                onok: es.main.form.del
            });
        }
    },
    
    del: function() {
        var me = es.main.form;
        
        var data = {
            id: es.main.crfId,
            drugUseId: parseInt(me.$(".times .active").attr("id"), 10)
        };
        
        console.log("crf/deleteDrugUseInfo.do", data);
        
        util.ajax.run({
            url: "crf/deleteDrugUseInfo.do",
            data: data,
            success: function(response) {
                console.log("crf/deleteDrugUseInfo.do", response);
                me.$(".times .active").remove();
                
                //重新编号
                me.$(".times a").each(function(index, val) {
                    $(val).html("第" + (index + 1) + "次用药");
                });
                
                //获取第1次
                var first = me.$(".times a:first");
                first.addClass("active");
                me.model.getData({
                    id: es.main.crfId,
                    drugUseId: parseInt(first.attr("id"), 10)
                });
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    save: function() {
       var me = es.main;
       
       var data = {
           id: me.crfId,
           no: me.model.get("data").no,
           drugUseId: parseInt(me.$(".times .active").attr("id"), 10),
           
           history: parseInt(esui.get("History1").getGroup().getValue(), 10),
           adr: parseInt(esui.get("ADR1").getGroup().getValue(), 10),
           adrtxt: $.trim(esui.get("ADRName").getValue()),
           batchNumber: $.trim(esui.get("BatchNumber").getValue()),
           dose: $.trim(esui.get("Dose").getValue()),
           startDate: esui.get("Start").getValue(),
           startH: $.trim(esui.get("StartH").getValue()),
           startM: $.trim(esui.get("StartM").getValue()),
           endDate: esui.get("End").getValue(),
           endH: $.trim(esui.get("EndH").getValue()),
           endM: $.trim(esui.get("EndM").getValue()),
           solventDose: $.trim(esui.get("SolventDose").getValue()),
           solvent: parseInt(esui.get("Solvent1").getGroup().getValue(), 10),
           solventName: $.trim(esui.get("SolventName").getValue()),
           solventPercent: $.trim(esui.get("SolventPercent").getValue()),
           prepareTime: $.trim(esui.get("PrepareTime").getValue()),
           prepareTimeUd: esui.get("PrepareTimeUd").isChecked(),
           location: parseInt(esui.get("Location1").getGroup().getValue(), 10),
           way: parseInt(esui.get("Way1").getGroup().getValue(), 10),
           way1Speed: $.trim(esui.get("Way1Speed").getValue()),
           way1Time: $.trim(esui.get("Way1Time").getValue()),
           way2Speed: $.trim(esui.get("Way2Speed").getValue()),
           way3Name: $.trim(esui.get("Way3Name").getValue()),
           way3Speed: $.trim(esui.get("Way3Speed").getValue()),
           way3Unit: $.trim(esui.get("Way3Unit").getValue()),
           
           sameBottle: parseInt(esui.get("SameBottle1").getGroup().getValue(), 10),
           bottle: [],
           
           sameGroup: parseInt(esui.get("SameGroup1").getGroup().getValue(), 10),
           useSolvent: parseInt(esui.get("Gap1").getGroup().getValue(), 10),
           gpSolvent: parseInt(esui.get("GpSolvent1").getGroup().getValue(), 10),
           gpSolvent1Dose: $.trim(esui.get("GpSolvent1Dose").getValue()),
           gpSolvent2Dose: $.trim(esui.get("GpSolvent2Dose").getValue()),
           gpSolvent3Name: $.trim(esui.get("GpSolvent3Name").getValue()),
           gpSolvent3Percent: $.trim(esui.get("GpSolvent3Percent").getValue()),
           gpSolvent3Dose: $.trim(esui.get("GpSolvent3Dose").getValue()),
           prevGroup: parseInt(esui.get("PrevGroup1").getGroup().getValue(), 10),
           prevGroupName: $.trim(esui.get("PrevGroupName").getValue()),
           nextGroup: parseInt(esui.get("NextGroup1").getGroup().getValue(), 10),
           nextGroupName: $.trim(esui.get("NextGroupName").getValue()),
           
           hasInjection: parseInt(esui.get("HasInjection1").getGroup().getValue(), 10),
           injection: [],
           
           hasBan: parseInt(esui.get("HasBan1").getGroup().getValue(), 10),
           ban: parseInt(esui.get("Ban1").getGroup().getValue(), 10),
           banColor: $.trim(esui.get("BanColor").getValue()),
           bantxt: $.trim(esui.get("BanName").getValue()),
           banDrug: [],
           
           hasFood: parseInt(esui.get("HasFood1").getGroup().getValue(), 10),
           food: esui.get("Food1").getGroup().getValue(),
           foodtxt: $.trim(esui.get("FoodName").getValue())
       };
       
       if (data.sameBottle == 1) {
           var bottle = me.$(".bottle");
           $.each(bottle, function(index, val) {
               var no = index + 1;
               data.bottle.push({
                   name: $.trim(esui.get("BottleName" + no).getValue()),
                   dose: $.trim(esui.get("BottleDose" + no).getValue()),
                   unit: $.trim(esui.get("BottleUnit" + no).getValue())
               });
           });
       }
       if (data.hasInjection == 1) {
           var injection = me.$(".injection");
           $.each(injection, function(index, val) {
               var no = index + 1;
               data.injection.push({
                   name: $.trim(esui.get("InjectionName" + no).getValue()),
                   dose: $.trim(esui.get("InjectionDose" + no).getValue()),
                   unit: $.trim(esui.get("InjectionUnit" + no).getValue())
               });
           });
       }
       if (data.hasBan == 1) {
           var banDrug = me.$(".ban-drug");
           $.each(banDrug, function(index, val) {
               var no = index + 1;
               data.banDrug.push({
                   name: $.trim(esui.get("DrugName" + no).getValue()),
                   dose: $.trim(esui.get("DrugDose" + no).getValue()),
                   unit: $.trim(esui.get("DrugUnit" + no).getValue())
               });
           });
       }
       
       //验证
       var floatPattern = /^\d+(\.\d+)?$/,
           intPattern = /^\d+$/;
       if (isNaN(data.history)) {
           esui.Dialog.alert({title: "提示", content: "请选择痰热清用药史"});
           return;
       }
       if (data.history == 1) {
           if (isNaN(data.adr)) {
               esui.Dialog.alert({title: "提示", content: "请选择是否有不良反应"});
               return;
           }
           if (data.adr == 1 && data.adrtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写不良反应表现"});
               return;
           }
           if (data.adr != 1) {
               data.adrtxt = "";
           }
       } else {
           data.adr = 0;
           data.adrtxt = "";
       }
       if (data.batchNumber == "") {
           esui.Dialog.alert({title: "提示", content: "请填写批号"});
           return;
       }
       if (!intPattern.test(data.dose) || parseInt(data.dose) > 100) {
           esui.Dialog.alert({title: "提示", content: "单次用药量应为不大于100的数字"});
           return;
       }
       if (!intPattern.test(data.startH) || parseInt(data.startH) > 24
         || !intPattern.test(data.startM) || parseInt(data.startM) > 60
         || !intPattern.test(data.endH) || parseInt(data.endH) > 24
         || !intPattern.test(data.endM) || parseInt(data.endM) > 60) {
           esui.Dialog.alert({title: "提示", content: "用药时间输入不正确"});
           return;
       }
       var start = T.date.parse(data.startDate + " " + data.startH + ":" + data.startM).getTime(),
           end = T.date.parse(data.endDate + " " + data.endH + ":" + data.endM).getTime();
       if (start > end) {
           esui.Dialog.alert({title: "提示", content: "用药开始时间不能晚于结束时间"});
           return;
       }
       if (!intPattern.test(data.solventDose) || parseInt(data.solventDose) % 50 != 0 || data.solventDose == "0") {
           esui.Dialog.alert({title: "提示", content: "单次溶媒剂量应为50的倍数"});
           return;
       }
       if (isNaN(data.solvent)) {
           esui.Dialog.alert({title: "提示", content: "请选择溶媒"});
           return;
       }
       if (data.solvent == 3) {
           if (data.solventName == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他溶媒名称"});
               return;
           }
           if (!floatPattern.test(data.solventPercent)) {
               esui.Dialog.alert({title: "提示", content: "溶媒浓度应为数字"});
               return;
           }
       } else {
           data.solventName = "";
           data.solventPercent = "";
       }
       if (!data.prepareTimeUd) {
           if (!intPattern.test(data.prepareTime)) {
               esui.Dialog.alert({title: "提示", content: "请填写配液至给药时间"});
               return;
           }
       } else {
           data.prepareTime = "";
       }
       if (isNaN(data.location)) {
           esui.Dialog.alert({title: "提示", content: "请选择配液场所"});
           return;
       }
       if (isNaN(data.way)) {
           esui.Dialog.alert({title: "提示", content: "请选择给药途径"});
           return;
       }
       if (data.way == 1) {
           if (data.way1Speed == "" && data.way1Time == "") {
               esui.Dialog.alert({title: "提示", content: "请填写静脉滴注速度或时间"});
               return;
           }
           if (data.way1Speed != "" && !intPattern.test(data.way1Speed)) {
               esui.Dialog.alert({title: "提示", content: "静脉滴注速度应为数字"});
               return;
           }
           if (data.way1Time != "" && !intPattern.test(data.way1Time)) {
               esui.Dialog.alert({title: "提示", content: "静脉滴注时间应为数字"});
               return;
           }
           data.way2Speed = "";
           data.way3Name = "";
           data.way3Speed = "";
           data.way3Unit = "";
       }
       if (data.way == 2) {
           if (!intPattern.test(data.way2Speed)) {
               esui.Dialog.alert({title: "提示", content: "请填写静脉泵入速度"});
               return;
           }
           data.way1Speed = "";
           data.way1Time = "";
           data.way3Name = "";
           data.way3Speed = "";
           data.way3Unit = "";
       }
       if (data.way == 3) {
           if ((data.way3Name == "" || data.way3Speed == "" || data.way3Unit == "")) {
               esui.Dialog.alert({title: "提示", content: "请填写其他途径"});
               return;
           }
           data.way1Speed = "";
           data.way1Time = "";
           data.way2Speed = "";
       }
       if (isNaN(data.sameBottle)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否同瓶用药"});
           return;
       }
       if (data.sameBottle == 1) {
           for (var i = 0, n = data.bottle.length; i < n; i++) {
               var item = data.bottle[i], seq = i + 1;
               if (item.name == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个同瓶药品名称"});
                   return false;
               }
               if (!intPattern.test(item.dose)) {
                   esui.Dialog.alert({title: "提示", content: "请选择第 " + seq + " 个同瓶药品剂量"});
                   return false;
               }
               if (item.unit == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个同瓶药品单位"});
                   return false;
               }
           }
       }
       if (isNaN(data.sameGroup)) {
           esui.Dialog.alert({title: "提示", content: "请选择是否同组用药"});
           return;
       }
       if (data.sameGroup == 1) {
           if (isNaN(data.useSolvent)) {
               esui.Dialog.alert({title: "提示", content: "请选择是否使用间隔液"});
               return;
           }
           if (data.useSolvent == 1) {
               if (isNaN(data.gpSolvent)) {
                   esui.Dialog.alert({title: "提示", content: "请选择间隔液"});
                   return;
               }
               if (data.gpSolvent == 1 && !intPattern.test(data.gpSolvent1Dose)) {
                   esui.Dialog.alert({title: "提示", content: "请填写葡萄糖注射液剂量"});
                   return;
               }
               if (data.gpSolvent == 2 && !intPattern.test(data.gpSolvent2Dose)) {
                   esui.Dialog.alert({title: "提示", content: "请填写氯化钠注射液剂量"});
                   return;
               }
               if (data.gpSolvent == 3 && (data.gpSolvent3Name == "" || !floatPattern.test(data.gpSolvent3Percent) || !intPattern.test(data.gpSolvent3Dose))) {
                   esui.Dialog.alert({title: "提示", content: "请填写间隔液"});
                   return;
               }
               data.prevGroup = 0;
               data.prevGroupName = "";
               data.nextGroup = 0;
               data.nextGroupName = "";
           } else {
               if (isNaN(data.prevGroup)) {
                   esui.Dialog.alert({title: "提示", content: "请选择上组用药"});
                   return;
               }
               if (data.prevGroup == 1 && data.prevGroupName == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写上组用药"});
                   return;
               }
               if (data.prevGroup == 2) {
                   data.prevGroupName = "";
               }
               if (isNaN(data.nextGroup)) {
                   esui.Dialog.alert({title: "提示", content: "请选择下组用药"});
                   return;
               }
               if (data.nextGroup == 1 && data.nextGroupName == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写下组用药"});
                   return;
               }
               if (data.nextGroup == 2) {
                   data.nextGroupName = "";
               }
               data.gpSolvent = 0;
               data.gpSolvent1Dose = "";
               data.gpSolvent2Dose = "";
               data.gpSolvent3Name = "";
               data.gpSolvent3Percent = "";
               data.gpSolvent3Dose = "";
           }
       } else {
           data.useSolvent = 0;
           data.gpSolvent = 0;
           data.gpSolvent1Dose = "";
           data.gpSolvent2Dose = "";
           data.gpSolvent3Name = "";
           data.gpSolvent3Percent = "";
           data.gpSolvent3Dose = "";
           data.prevGroup = 0;
           data.prevGroupName = "";
           data.nextGroup = 0;
           data.nextGroupName = "";
       }
       if (isNaN(data.hasInjection)) {
           esui.Dialog.alert({title: "提示", content: "请选择静滴期间是否同时使用其他注射剂"});
           return;
       }
       if (data.hasInjection == 1) {
           for (var i = 0, n = data.injection.length; i < n; i++) {
               var item = data.injection[i], seq = i + 1;
               if (item.name == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个其他注射剂名称"});
                   return false;
               }
               if (!intPattern.test(item.dose)) {
                   esui.Dialog.alert({title: "提示", content: "请选择第 " + seq + " 个其他注射剂剂量"});
                   return false;
               }
               if (item.unit == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个其他注射剂单位"});
                   return false;
               }
           }
       }
       if (isNaN(data.hasBan)) {
           esui.Dialog.alert({title: "提示", content: "请选择配伍禁忌现象"});
           return;
       }
       if (data.hasBan == 1) {
           if (isNaN(data.ban)) {
               esui.Dialog.alert({title: "提示", content: "请选择配伍禁忌现象"});
               return;
           }
           if (data.ban == 3 && data.banColor == "") {
               esui.Dialog.alert({title: "提示", content: "请填写颜色"});
               return;
           }
           if (data.ban == 4 && data.bantxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他配伍禁忌现象"});
               return;
           }
           for (var i = 0, n = data.banDrug.length; i < n; i++) {
               var item = data.banDrug[i], seq = i + 1;
               if (item.name == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个配伍禁忌药品名称"});
                   return false;
               }
               if (!intPattern.test(item.dose)) {
                   esui.Dialog.alert({title: "提示", content: "请选择第 " + seq + " 个配伍禁忌药品剂量"});
                   return false;
               }
               if (item.unit == "") {
                   esui.Dialog.alert({title: "提示", content: "请填写第 " + seq + " 个配伍禁忌药品单位"});
                   return false;
               }
           }
       } else {
           data.ban = 0;
           data.banColor = "";
           data.bantxt = "";
       }
       if (isNaN(data.hasFood)) {
           esui.Dialog.alert({title: "提示", content: "请选择静滴前后24小时内是否进食易致敏物质"});
           return;
       }
       if (data.hasFood == 1) {
           if (data.food == "") {
               esui.Dialog.alert({title: "提示", content: "请选择易致敏物质"});
               return;
           }
           if (data.food.indexOf("5") != -1 && data.foodtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他易致敏物质"});
               return;
           }
           if (data.food.indexOf("5") == -1) {
               data.foodtxt = "";
           }
       } else {
           data.food = "";
           data.foodtxt = "";
       }
       
       console.log("crf/saveDrugUseInfo.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveDrugUseInfo.do",
            data: JSON.stringify(data),
            json: true,
            success: function(response) {
                console.log("crf/saveDrugUseInfo.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode40").click();
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
