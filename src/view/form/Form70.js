/*
 * ADR
 * 
 * @author: Ricky
 */

es.Views.Form70 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        "click .add-doubt": "addDoubt",
        "click .add-merge": "addMerge",
        "click .del-doubt": "delDoubt",
        "click .del-merge": "delMerge"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderForm, this);
        this.model.getData({id: es.main.crfId});
    },
    
    destroy: function() {
        this.$(".sug").autocomplete("destroy");
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
        $.Mustache.load("asset/tpl/form/form70.html").done(function() {
            var disabled = es.main.editable ? "" : "disabled:true";
            
            me.$el.mustache("tpl-form70", {
                data: data.data,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            });
            
            me.$("#DoubtList").append($.Mustache.render("tpl-form70-doubt", {
                drug1: data.data.drug1,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.doubtCount = data.data.drug1.length;
            
            me.$("#MergeList").append($.Mustache.render("tpl-form70-merge", {
                drug2: data.data.drug2,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.mergeCount = data.data.drug2.length;
            
            var clone = $.extend(true, {}, data.data);
            me.initCtrl(clone);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        var option = {
            Birthday: {
                range: BIRTHDAY_RANGE,
                value: data.birthday
            },
            Nation: {
                datasource: NATION,
                value: data.ethic
            },
            ADRDate: {
                range: CRF_RANGE,
                value: data.adrDate
            },
            DeathDate: {
                range: CRF_RANGE,
                value: data.deathDate
            },
            ReportDate: {
                range: CRF_RANGE,
                value: data.reportDate
            }
        };
        $.each(data.drug1, function(index, val) {
            option["DoubtF7" + val.no] = {range: CRF_RANGE, value: val.f7};
            option["DoubtF8" + val.no] = {range: CRF_RANGE, value: val.f8};
        });
        $.each(data.drug2, function(index, val) {
            option["MergeF7" + val.no] = {range: CRF_RANGE, value: val.f7};
            option["MergeF8" + val.no] = {range: CRF_RANGE, value: val.f8};
        });
        
        esui.init(document.body, option);
        
        var table1 = esui.get("Doubt"),
            table2 = esui.get("Merge");
        table1.datasource = data.drug1;
        table2.datasource = data.drug2;
        table1.fields = [
            {title: '批准文号', content: function (item) {return item.f1;}},
            {title: '商品名称', content: function (item) {return item.f2;}},
            {title: '通用名称', content: function (item) {return item.f3;}},
            {title: '生产厂家', content: function (item) {return item.f4;}},
            {title: '生产批号', content: function (item) {return item.f5;}},
            {title: '用法用量', content: function (item) {return item.f6;}},
            {title: '用药开始时间', content: function (item) {return item.f7;}},
            {title: '用药停止时间', content: function (item) {return item.f8;}},
            {title: '用药原因', content: function (item) {return item.f9;}}
        ];
        table2.fields = [
            {title: '批准文号', content: function (item) {return item.f1;}},
            {title: '商品名称', content: function (item) {return item.f2;}},
            {title: '通用名称', content: function (item) {return item.f3;}},
            {title: '生产厂家', content: function (item) {return item.f4;}},
            {title: '生产批号', content: function (item) {return item.f5;}},
            {title: '用法用量', content: function (item) {return item.f6;}},
            {title: '用药开始时间', content: function (item) {return item.f7;}},
            {title: '用药停止时间', content: function (item) {return item.f8;}},
            {title: '用药原因', content: function (item) {return item.f9;}}
        ];
        
        if (es.main.editable) {
            table1.fields.push({
                title: '操作',
                content: function (item) {
                    return '<a href="javascript:void(0)" class="del-btn del-doubt" id="del' + item.id + '">删除</a>';
                }
            });
            table2.fields.push({
                title: '操作',
                content: function (item) {
                    return '<a href="javascript:void(0)" class="del-btn del-merge" id="del' + item.id + '">删除</a>';
                }
            });
        }
        
        table1.render();
        table2.render();
        
        switch (data.type) {
            case 1: esui.get("Type1").setChecked(true); break;
            case 2: esui.get("Type2").setChecked(true); break;
            case 3: esui.get("Type3").setChecked(true); break;
            case 4: esui.get("Type4").setChecked(true);
        }
        switch (data.blood) {
            case 1: esui.get("Blood1").setChecked(true); break;
            case 2: esui.get("Blood2").setChecked(true);
        }
        switch (data.sex) {
            case 1: esui.get("Male").setChecked(true); break;
            case 2: esui.get("Female").setChecked(true);
        }
        switch (data.historyadr) {
            case 1: esui.get("HisADR1").setChecked(true); break;
            case 2: esui.get("HisADR2").setChecked(true); break;
            case 3: esui.get("HisADR3").setChecked(true);
        }
        switch (data.familyadr) {
            case 1: esui.get("FamilyADR1").setChecked(true); this.$(".relationship").show(); break;
            case 2: esui.get("FamilyADR2").setChecked(true); break;
            case 3: esui.get("FamilyADR3").setChecked(true);
        }
        switch (data.relationship) {
            case 1: esui.get("Relationship1").setChecked(true); break;
            case 2: esui.get("Relationship2").setChecked(true); break;
            case 3: esui.get("Relationship3").setChecked(true); break;
            case 4: esui.get("Relationship4").setChecked(true);
        }
        if (data.info != "") {
            $.each(data.info.split(","), function(index, val) {
                esui.get("Info" + val).setChecked(true);
            });
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
        if (data.adr7 != "") {
            $.each(data.adr7.split(","), function(index, val) {
                esui.get("ADR7_" + val).setChecked(true);
            });
        }
        if (data.adr8 != "") {
            $.each(data.adr8.split(","), function(index, val) {
                esui.get("ADR8_" + val).setChecked(true);
            });
        }
        if (data.adr9 != "") {
            $.each(data.adr9.split(","), function(index, val) {
                esui.get("ADR9_" + val).setChecked(true);
            });
        }
        if (data.adr10 != "") {
            $.each(data.adr10.split(","), function(index, val) {
                esui.get("ADR10_" + val).setChecked(true);
            });
        }
        switch (data.adrDeal) {
            case 1: esui.get("Deal1").setChecked(true); break;
            case 2: esui.get("Deal2").setChecked(true); break;
            case 3: esui.get("Deal3").setChecked(true); break;
            case 4: esui.get("Deal4").setChecked(true);
        }
        switch (data.adrDeal3) {
            case 1: esui.get("Deal3_1").setChecked(true); break;
            case 2: esui.get("Deal3_2").setChecked(true); break;
            case 3: esui.get("Deal3_3").setChecked(true); break;
            case 4: esui.get("Deal3_4").setChecked(true); break;
            case 5: esui.get("Deal3_5").setChecked(true);
        }
        switch (data.ending) {
            case 1: esui.get("Ending1").setChecked(true); break;
            case 2: esui.get("Ending2").setChecked(true); break;
            case 3: esui.get("Ending3").setChecked(true); break;
            case 4: esui.get("Ending4").setChecked(true); break;
            case 5: esui.get("Ending5").setChecked(true); break;
            case 6: esui.get("Ending6").setChecked(true); this.$(".death").show();
        }
        switch (data.adrStop) {
            case 1: esui.get("Stop1").setChecked(true); break;
            case 2: esui.get("Stop2").setChecked(true); break;
            case 3: esui.get("Stop3").setChecked(true); break;
            case 4: esui.get("Stop4").setChecked(true);
        }
        switch (data.adrRestart) {
            case 1: esui.get("Restart1").setChecked(true); break;
            case 2: esui.get("Restart2").setChecked(true); break;
            case 3: esui.get("Restart3").setChecked(true); break;
            case 4: esui.get("Restart4").setChecked(true);
        }
        switch (data.evaluate) {
            case 1: esui.get("Evaluate1").setChecked(true); break;
            case 2: esui.get("Evaluate2").setChecked(true); break;
            case 3: esui.get("Evaluate3").setChecked(true); break;
            case 4: esui.get("Evaluate4").setChecked(true); break;
            case 5: esui.get("Evaluate5").setChecked(true); break;
            case 6: esui.get("Evaluate6").setChecked(true);
        }
        switch (data.career) {
            case 1: esui.get("Career1").setChecked(true); break;
            case 2: esui.get("Career2").setChecked(true); break;
            case 3: esui.get("Career3").setChecked(true); break;
            case 4: esui.get("Career4").setChecked(true);
        }
        
        //事件
        var me = this;
        esui.get("Birthday").onchange = function(value) {esui.get("Birthday").setValueAsDate(value);};
        esui.get("ADRDate").onchange = function(value) {esui.get("ADRDate").setValueAsDate(value);};
        esui.get("DeathDate").onchange = function(value) {esui.get("DeathDate").setValueAsDate(value);};
        esui.get("ReportDate").onchange = function(value) {esui.get("ReportDate").setValueAsDate(value);};
        
        esui.get("FamilyADR1").onclick = function() {me.$(".relationship").show();};
        esui.get("FamilyADR2").onclick = function() {me.$(".relationship").hide();};
        esui.get("FamilyADR3").onclick = function() {me.$(".relationship").hide();};
        
        esui.get("Ending1").onclick = function() {me.$(".death").hide();};
        esui.get("Ending2").onclick = function() {me.$(".death").hide();};
        esui.get("Ending3").onclick = function() {me.$(".death").hide();};
        esui.get("Ending4").onclick = function() {me.$(".death").hide();};
        esui.get("Ending5").onclick = function() {me.$(".death").hide();};
        esui.get("Ending6").onclick = function() {me.$(".death").show();};
        
        $.each(data.drug1, function(index, val) {
            var start = esui.get("DoubtF7" + val.no);
            start.onchange = function(value) {start.setValueAsDate(value);};
            if (!es.main.editable) {
                start.disable();
            }
            var end = esui.get("DoubtF8" + val.no);
            end.onchange = function(value) {end.setValueAsDate(value);};
            if (!es.main.editable) {
                end.disable();
            }
            if (es.main.editable) {
                esui.get("SaveDoubt" + val.no).onclick = function() {
                    var block = $(this.main).parent().parent();
                    me.saveDoubt(block);
                };
            }
            $("#ctrltextDoubtF3" + val.no).autocomplete({source: util.getSuggestion("drug")});
        });
        $.each(data.drug2, function(index, val) {
            var start = esui.get("MergeF7" + val.no);
            start.onchange = function(value) {start.setValueAsDate(value);};
            if (!es.main.editable) {
                start.disable();
            }
            var end = esui.get("MergeF8" + val.no);
            end.onchange = function(value) {end.setValueAsDate(value);};
            if (!es.main.editable) {
                end.disable();
            }
            if (es.main.editable) {
                esui.get("SaveMerge" + val.no).onclick = function() {
                    var block = $(this.main).parent().parent();
                    me.saveMerge(block);
                };
            }
            $("#ctrltextMergeF3" + val.no).autocomplete({source: util.getSuggestion("drug")});
        });
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
        if (!es.main.editable) {
            esui.get("Birthday").disable();
            esui.get("ADRDate").disable();
            esui.get("DeathDate").disable();
            esui.get("ReportDate").disable();
        }
    },
    
    addDoubt: function(e) {
        var no = ++this.doubtCount;
        this.$("#DoubtList").append($.Mustache.render("tpl-form70-doubt", {
            drug1: [{no: no}],
            disabled: "",
            save: [1]
        }));
        var option = {};
        option["DoubtF7" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        option["DoubtF8" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        esui.init(this.el, option);
        esui.get("DoubtF7" + no).onchange = function(value) {esui.get("DoubtF7" + no).setValueAsDate(value);};
        esui.get("DoubtF8" + no).onchange = function(value) {esui.get("DoubtF8" + no).setValueAsDate(value);};
        var me = this;
        esui.get("SaveDoubt" + no).onclick = function() {
            var block = $(this.main).parent().parent();
            me.saveDoubt(block);
        };
        $("#ctrltextDoubtF3" + no).autocomplete({source: util.getSuggestion("drug")});
    },
    
    addMerge: function() {
        var no = ++this.mergeCount;
        this.$("#MergeList").append($.Mustache.render("tpl-form70-merge", {
            drug2: [{no: no}],
            disabled: "",
            save: [1]
        }));
        var option = {};
        option["MergeF7" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        option["MergeF8" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        esui.init(this.el, option);
        esui.get("MergeF7" + no).onchange = function(value) {esui.get("MergeF7" + no).setValueAsDate(value);};
        esui.get("MergeF8" + no).onchange = function(value) {esui.get("MergeF8" + no).setValueAsDate(value);};
        var me = this;
        esui.get("SaveMerge" + no).onclick = function() {
            var block = $(this.main).parent().parent();
            me.saveMerge(block);
        };
        $("#ctrltextMergeF3" + no).autocomplete({source: util.getSuggestion("drug")});
    },
    
    saveDoubt: function(block) {
        var no = block.attr("no"),
            id = block.attr("id"),
            f1 = $.trim(esui.get("DoubtF1" + no).getValue()),
            f2 = $.trim(esui.get("DoubtF2" + no).getValue()),
            f3 = $.trim(esui.get("DoubtF3" + no).getValue()),
            f4 = $.trim(esui.get("DoubtF4" + no).getValue()),
            f5 = $.trim(esui.get("DoubtF5" + no).getValue()),
            f6 = $.trim(esui.get("DoubtF6" + no).getValue()),
            f7 = esui.get("DoubtF7" + no).getValue(),
            f8 = esui.get("DoubtF8" + no).getValue(),
            f9 = $.trim(esui.get("DoubtF9" + no).getValue());
        var data = {
            id: es.main.crfId,
            drugId: id == "" ? null : parseInt(id, 10),
            f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, 
            f6: f6, f7: f7, f8: f8, f9: f9
        };
        
        //验证
        if (data.f1 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品批准文号"});
            return false;
        }
        if (data.f2 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品商品名称"});
            return false;
        }
        if (data.f3 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品通用名称"});
            return false;
        }
        if (data.f4 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品生产厂家"});
            return false;
        }
        if (data.f5 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品生产批号"});
            return false;
        }
        if (data.f6 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品用法用量"});
            return false;
        }
        var start = T.date.parse(data.f7).getTime(),
            end = T.date.parse(data.f8).getTime();
        if (start > end) {
            esui.Dialog.alert({title: "提示", content: "怀疑药品用药开始时间不能晚于用药停止时间"});
            return;
        }
        if (data.f9 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写怀疑药品用药原因"});
            return false;
        }
        
        console.log("crf/saveOneDoubtDrugInADE.do-请求", data);
        
        util.ajax.run({
            url: "crf/saveOneDoubtDrugInADE.do",
            data: data,
            success: function(response) {
                console.log("crf/saveOneDoubtDrugInADE.do-响应:", response);
                
                block.attr({id: response.id});
                var table = esui.get("Doubt"),
                    rowData = {
                        id: response.id,
                        f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, 
                        f6: f6, f7: f7, f8: f8, f9: f9
                    },
                    row = null;
                
                $.each(table.datasource, function(index, val) {
                    if (val.id == rowData.id) {
                        row = index;
                    }
                });
                if (row == null) {
                    table.datasource.push(rowData);
                } else {
                    table.datasource[row] = rowData;
                }
                table.render();
            },
            mock: MOCK,
            mockData: {
                success: true,
                id: 789
            }
        });
    },
    
    saveMerge: function(block) {
        var no = block.attr("no"),
            id = block.attr("id"),
            f1 = $.trim(esui.get("MergeF1" + no).getValue()),
            f2 = $.trim(esui.get("MergeF2" + no).getValue()),
            f3 = $.trim(esui.get("MergeF3" + no).getValue()),
            f4 = $.trim(esui.get("MergeF4" + no).getValue()),
            f5 = $.trim(esui.get("MergeF5" + no).getValue()),
            f6 = $.trim(esui.get("MergeF6" + no).getValue()),
            f7 = esui.get("MergeF7" + no).getValue(),
            f8 = esui.get("MergeF8" + no).getValue(),
            f9 = $.trim(esui.get("MergeF9" + no).getValue());
        var data = {
            id: es.main.crfId,
            drugId: id == "" ? null : parseInt(id, 10),
            f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, 
            f6: f6, f7: f7, f8: f8, f9: f9
        };
        
        //验证
        if (data.f1 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品批准文号"});
            return false;
        }
        if (data.f2 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品商品名称"});
            return false;
        }
        if (data.f3 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品通用名称"});
            return false;
        }
        if (data.f4 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品生产厂家"});
            return false;
        }
        if (data.f5 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品生产批号"});
            return false;
        }
        if (data.f6 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品用法用量"});
            return false;
        }
        var start = T.date.parse(data.f7).getTime(),
            end = T.date.parse(data.f8).getTime();
        if (start > end) {
            esui.Dialog.alert({title: "提示", content: "并用药品用药开始时间不能晚于用药停止时间"});
            return;
        }
        if (data.f9 == "") {
            esui.Dialog.alert({title: "提示", content: "请填写并用药品用药原因"});
            return false;
        }
        
        console.log("crf/saveOneCombineDrugInADE.do-请求", data);
        
        util.ajax.run({
            url: "crf/saveOneCombineDrugInADE.do",
            data: data,
            success: function(response) {
                console.log("crf/saveOneCombineDrugInADE.do-响应:", response);
                
                block.attr({id: response.id});
                var table = esui.get("Merge"),
                    rowData = {
                        id: response.id,
                        f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, 
                        f6: f6, f7: f7, f8: f8, f9: f9
                    },
                    row = null;
                
                $.each(table.datasource, function(index, val) {
                    if (val.id == rowData.id) {
                        row = index;
                    }
                });
                if (row == null) {
                    table.datasource.push(rowData);
                } else {
                    table.datasource[row] = rowData;
                }
                table.render();
            },
            mock: MOCK,
            mockData: {
                success: true,
                id: 789
            }
        });
    },
    
    delDoubt: function(e) {
        var id = parseInt($(e.target).attr("id").replace('del', ''), 10),
            block = this.$("#" + id),
            no = block.attr("no");
        
        var data = {
           id: es.main.crfId,
           drugId: id
        };
        
        console.log("crf/deleteOneDoubtDrugInADE.do-请求:", data);
        
        util.ajax.run({
            url: "crf/deleteOneDoubtDrugInADE.do",
            data: data,
            success: function(response) {
                console.log("crf/deleteOneDoubtDrugInADE.do-响应:", response);
                
                esui.dispose("DoubtF7" + no);
                esui.dispose("DoubtF8" + no);
                $("#ctrltextDoubtF3" + no).autocomplete("destroy");
                block.remove();
                
                var table = esui.get("Doubt"), row = null;
                $.each(table.datasource, function(index, val) {
                    if (val.id == id) {
                        row = index;
                    }
                });
                table.datasource.splice(row, 1);
                table.render();
            },
            mock: MOCK,
            mockData: {
                success: true
            }
        });
    },
    
    delMerge: function(e) {
        var id = parseInt($(e.target).attr("id").replace('del', ''), 10),
            block = this.$("#" + id),
            no = block.attr("no");
        
        var data = {
           id: es.main.crfId,
           drugId: id
        };
        
        console.log("crf/deleteOneCombineDrugInADE.do-请求:", data);
        
        util.ajax.run({
            url: "crf/deleteOneCombineDrugInADE.do",
            data: data,
            success: function(response) {
                console.log("crf/deleteOneCombineDrugInADE.do-响应:", response);
                
                esui.dispose("MergeF7" + no);
                esui.dispose("MergeF8" + no);
                $("#ctrltextMergeF3" + no).autocomplete("destroy");
                block.remove();
                
                var table = esui.get("Merge"), row = null;
                $.each(table.datasource, function(index, val) {
                    if (val.id == id) {
                        row = index;
                    }
                });
                table.datasource.splice(row, 1);
                table.render();
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
           
           type: parseInt(esui.get("Type1").getGroup().getValue(), 10),
           blood: parseInt(esui.get("Blood1").getGroup().getValue(), 10),
           name: $.trim(esui.get("Name").getValue()),
           sex: parseInt(esui.get("Male").getGroup().getValue(), 10),
           birthday: esui.get("Birthday").getValue(),
           ethic: esui.get("Nation").value,
           weight: $.trim(esui.get("Weight").getValue()),
           contact: $.trim(esui.get("Contact").getValue()),
           disease: $.trim(esui.get("Disease").getValue()),
           patientNo: $.trim(esui.get("PatientNo").getValue()),
           historyadr: parseInt(esui.get("HisADR1").getGroup().getValue(), 10),
           historyadrtxt: $.trim(esui.get("HisADR").getValue()),
           familyadr: parseInt(esui.get("FamilyADR1").getGroup().getValue(), 10),
           familyadrtxt: $.trim(esui.get("FamilyADR").getValue()),
           relationship: parseInt(esui.get("Relationship1").getGroup().getValue(), 10),
           info: esui.get("Info1").getGroup().getValue(),
           info6txt: $.trim(esui.get("Info6Name").getValue()),
           info7txt: $.trim(esui.get("Info7Name").getValue()),
           drug1: esui.get("Doubt").datasource,
           drug2: esui.get("Merge").datasource,
           adr: esui.get("ADR1").getGroup().getValue(),
           adr1: esui.get("ADR1_1").getGroup().getValue(),
           adr2: esui.get("ADR2_1").getGroup().getValue(),
           adr3: esui.get("ADR3_1").getGroup().getValue(),
           adr4: esui.get("ADR4_1").getGroup().getValue(),
           adr5: esui.get("ADR5_1").getGroup().getValue(),
           adr6: esui.get("ADR6_1").getGroup().getValue(),
           adr7: esui.get("ADR7_1").getGroup().getValue(),
           adr8: esui.get("ADR8_1").getGroup().getValue(),
           adr9: esui.get("ADR9_1").getGroup().getValue(),
           adr10: esui.get("ADR10_1").getGroup().getValue(),
           adrtxt: $.trim(esui.get("CustomADRName").getValue()),
           adrDate: esui.get("ADRDate").getValue(),
           adrH: $.trim(esui.get("ADRH").getValue()),
           adrM: $.trim(esui.get("ADRM").getValue()),
           adrDescription: $.trim(esui.get("Description").getValue()),
           adrDeal: parseInt(esui.get("Deal1").getGroup().getValue(), 10),
           adrDeal3: parseInt(esui.get("Deal3_1").getGroup().getValue(), 10),
           adrDealDose: $.trim(esui.get("Deal2Dose").getValue()),
           adrDeal3txt: $.trim(esui.get("CustomDeal3Name").getValue()),
           adrDeal4txt: $.trim(esui.get("CustomDealName").getValue()),
           adrDealRemark: $.trim(esui.get("DealRemark").getValue()),
           ending: parseInt(esui.get("Ending1").getGroup().getValue(), 10),
           endingtxt: $.trim(esui.get("Ending5Content").getValue()),
           deathDate: esui.get("DeathDate").getValue(),
           deathReason: $.trim(esui.get("DeathReason").getValue()),
           adrStop: parseInt(esui.get("Stop1").getGroup().getValue(), 10),
           adrRestart: parseInt(esui.get("Restart1").getGroup().getValue(), 10),
           evaluate: parseInt(esui.get("Evaluate1").getGroup().getValue(), 10),
           career: parseInt(esui.get("Career1").getGroup().getValue(), 10),
           careertxt: $.trim(esui.get("CustomCareerName").getValue()),
           email: $.trim(esui.get("Email").getValue()),
           reportDate: esui.get("ReportDate").getValue(),
           remark: $.trim(esui.get("Remark").getValue())
       };
       
       //验证
       var floatPattern = /^\d+(\.\d+)?$/,
           intPattern = /^\d+$/;
       if (isNaN(data.type)) {
           esui.Dialog.alert({title: "提示", content: "请选择报告类型"});
           return;
       }
       if (isNaN(data.blood)) {
           esui.Dialog.alert({title: "提示", content: "请选择该患者是否采血"});
           return;
       }
       if (data.name == "") {
           esui.Dialog.alert({title: "提示", content: "请填写患者姓名"});
           return;
       }
       if (isNaN(data.sex)) {
           esui.Dialog.alert({title: "提示", content: "请选择性别"});
           return;
       }
       if (data.ethic == 0) {
           esui.Dialog.alert({title: "提示", content: "请选择民族"});
           return;
       }
       if (!floatPattern.test(data.weight)) {
           esui.Dialog.alert({title: "提示", content: "请填写体重"});
           return;
       }
       if (parseFloat(data.weight) > 150) {
           esui.Dialog.alert({title: "提示", content: "体重范围不正确"});
           return;
       }
       if (data.contact == "") {
           esui.Dialog.alert({title: "提示", content: "请填写联系方式"});
           return;
       }
       if (data.disease == "") {
           esui.Dialog.alert({title: "提示", content: "请填写原患疾病"});
           return;
       }
       if (data.patientNo == "") {
           esui.Dialog.alert({title: "提示", content: "请填写病历号/门诊号"});
           return;
       }
       if (isNaN(data.historyadr)) {
           esui.Dialog.alert({title: "提示", content: "请选择既往药品不良反应/事件"});
           return;
       }
       if (data.historyadr == 1) {
           if (data.historyadrtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写既往药品不良反应/事件"});
               return;
           }
       } else {
           data.historyadrtxt = "";
       }
       if (isNaN(data.familyadr)) {
           esui.Dialog.alert({title: "提示", content: "请选择家族药品不良反应/事件"});
           return;
       }
       if (data.familyadr == 1) {
           if (data.familyadrtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写家族药品不良反应/事件"});
               return;
           }
           if (isNaN(data.relationship)) {
               esui.Dialog.alert({title: "提示", content: "请选择关系"});
               return;
           }
       } else {
           data.familyadrtxt = "";
           data.relationship = 0;
       }
       if (data.info == "") {
           esui.Dialog.alert({title: "提示", content: "请选择相关重要信息"});
           return;
       }
       if (data.info.indexOf("6") != -1 && data.info6txt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写过敏史"});
           return;
       }
       if (data.info.indexOf("6") == -1) {
           data.info6txt = "";
       }
       if (data.info.indexOf("7") != -1 && data.info7txt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写其他相关重要信息"});
           return;
       }
       if (data.info.indexOf("7") == -1) {
           data.info7txt = "";
       }
       
       if (data.adr == "") {
           esui.Dialog.alert({title: "提示", content: "请选择不良反应/事件名称"});
           return;
       }
       if (data.adr.indexOf("11") != -1 && data.adrtxt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写其他不良反应/事件名称"});
           return;
       }
       if (data.adr.indexOf("11") == -1) {
           data.adrtxt = "";
       }
       if (!intPattern.test(data.adrH) || parseInt(data.adrH) > 24
        || !intPattern.test(data.adrM) || parseInt(data.adrM) > 60) {
           esui.Dialog.alert({title: "提示", content: "请填写不良反应/事件发生时间"});
           return;
       }
       if (data.adrDescription == "") {
           esui.Dialog.alert({title: "提示", content: "请填写不良反应/事件过程描述"});
           return;
       }
       if (isNaN(data.adrDeal)) {
           esui.Dialog.alert({title: "提示", content: "请选择不良反应/事件处理情况"});
           return;
       }
       if (data.adrDeal == 1) {
           data.adrDeal3 = 0;
           data.adrDealDose = "";
           data.adrDeal3txt = "";
           data.adrDeal4txt = "";
       }
       if (data.adrDeal == 2) {
           if (!intPattern.test(data.adrDealDose)) {
               esui.Dialog.alert({title: "提示", content: "请填写减少剂量"});
               return;
           }
           data.adrDeal3 = 0;
           data.adrDeal3txt = "";
           data.adrDeal4txt = "";
       }
       if (data.adrDeal == 3) {
           if (isNaN(data.adrDeal3)) {
               esui.Dialog.alert({title: "提示", content: "请选择对症支持治疗"});
               return;
           }
           if (data.adrDeal3 == 5 && data.adrDeal3txt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他对症支持治疗"});
               return;
           }
           data.adrDealDose = "";
           data.adrDeal4txt = "";
       }
       if (data.adrDeal == 4) {
           if (data.adrDeal4txt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写其他不良反应/事件处理情况"});
               return;
           }
           data.adrDeal3 = 0;
           data.adrDealDose = "";
           data.adrDeal3txt = "";
       }
       if (isNaN(data.ending)) {
           esui.Dialog.alert({title: "提示", content: "请选择不良反应/事件的结果"});
           return;
       }
       if (data.ending != 5 && data.ending != 6) {
           data.endingtxt = "";
           data.deathReason = "";
           data.deathDate = null;
       }
       if (data.ending == 5) {
           if (data.endingtxt == "") {
               esui.Dialog.alert({title: "提示", content: "请填写后遗症表现"});
               return;
           }
           data.deathReason = "";
           data.deathDate = null;
       }
       if (data.ending == 6) {
           if (data.deathReason == "") {
               esui.Dialog.alert({title: "提示", content: "请填写直接死因"});
               return;
           }
           data.endingtxt = "";
       }
       if (isNaN(data.adrStop)) {
           esui.Dialog.alert({title: "提示", content: "请选择停药或减量后，反应/事件是否消失或减轻"});
           return;
       }
       if (isNaN(data.adrRestart)) {
           esui.Dialog.alert({title: "提示", content: "请选择再次使用可疑药品后是否再次出现同样反应/事件"});
           return;
       }
       if (isNaN(data.evaluate)) {
           esui.Dialog.alert({title: "提示", content: "请选择报告人评价"});
           return;
       }
       if (isNaN(data.career)) {
           esui.Dialog.alert({title: "提示", content: "请选择职业"});
           return;
       }
       if (data.career == 4 && data.careertxt == "") {
           esui.Dialog.alert({title: "提示", content: "请填写其他职业"});
           return;
       }
       if (data.career != 4) {
           data.careertxt = "";
       }
       if (data.email == "") {
           esui.Dialog.alert({title: "提示", content: "请填写电子邮箱"});
           return;
       }
       
       console.log("crf/saveADR.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveADR.do",
            data: JSON.stringify(data),
            json: true,
            success: function(response) {
                console.log("crf/saveADR.do-响应:", response);
                
                esui.Dialog.alert({title: "保存", content: "保存成功！"});
                me.updateProgress(response.progress);
            },
            mock: MOCK,
            mockData: {
                success: true,
                progress: "30%"
            }
        });
    }
});
