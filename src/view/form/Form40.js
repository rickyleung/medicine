/*
 * 合并用药
 * 
 * @author: Ricky
 */

es.Views.Form40 = Backbone.View.extend({
    el: ".crf-form",
    
    events: {
        "click .add-drug": "addDrug",
        "click .del-drug": "delDrug"
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
        $.Mustache.load("asset/tpl/form/form40.html").done(function() {
            var disabled = es.main.editable ? "" : "disabled:true";
            
            me.$el.mustache("tpl-form40", {
                disabled: disabled,
                save: es.main.editable ? [1] : []
            });
            
            me.$("#DrugList").prepend($.Mustache.render("tpl-form40-drug", {
                drug: data.data.drug,
                disabled: disabled,
                save: es.main.editable ? [1] : []
            }));
            me.drugCount = data.data.drug.length;
            
            var clone = $.extend(true, {}, data.data);
            me.initCtrl(clone);
        });
    },
    
    initCtrl: function(data) {
        //赋值
        var option = {};
        $.each(data.drug, function(index, val) {
            option["Start" + val.no] = {range: CRF_RANGE, value: val.start};
            option["End" + val.no] = {range: CRF_RANGE, value: val.end};
        });
        
        esui.init(document.body, option);
        
        var table = esui.get("Drug");
        table.datasource = data.drug;
        table.fields = [
            {title: '通用名称', content: function (item) {return item.name;}},
            {title: '开始日期', content: function (item) {return item.start;}},
            {title: '停止日期', content: function (item) {return item.end;}},
            {title: '单次用药量', content: function (item) {return item.dose;}},
            {title: '计量单位', content: function (item) {return item.unit;}},
            {title: '给药途径', content: function (item) {return item.way;}},
            {title: '给药频次', content: function (item) {return item.frequency;}}
        ];
        if (es.main.editable) {
            table.fields.push({
                title: '操作',
                content: function (item) {
                    return '<a href="javascript:void(0)" class="del-btn del-drug" id="del' + item.id + '">删除</a>';
                }
            });
        }
        this.$(".drugs").show();
        table.render();
        this.$(".drugs").hide();
        
        switch (data.hasDrug) {
            case 1: esui.get("Merge1").setChecked(true); this.$(".drugs").show(); break;
            case 2: esui.get("Merge2").setChecked(true);
        }
        
        //事件
        var me = this;
        esui.get("Merge1").onclick = function() {me.$(".drugs").show();};
        esui.get("Merge2").onclick = function() {me.$(".drugs").hide();};
        
        $.each(data.drug, function(index, val) {
            var start = esui.get("Start" + val.no);
            start.onchange = function(value) {start.setValueAsDate(value);};
            if (!es.main.editable) {
                start.disable();
            }
            var end = esui.get("End" + val.no);
            end.onchange = function(value) {end.setValueAsDate(value);};
            if (!es.main.editable) {
                end.disable();
            }
            if (es.main.editable){
            	esui.get("Save" + val.no).onclick = function() {
                    var block = $(this.main).parent().parent();
                    me.saveDrug(block);
                };
            }
            $("#ctrltextName" + val.no).autocomplete({source: util.getSuggestion("drug")});
            $("#ctrltextWay" + val.no).autocomplete({source: util.getSuggestion("way")});
        });
        
        if (es.main.canDoubt) {
            esui.get("DoubtOK").onclick = es.main.doubtCRF;
        }
        if (es.main.editable) {
            esui.get("Save").onclick = this.save;
        }
    },
    
    addDrug: function(e) {
        var no = ++this.drugCount;
        this.$("#DrugList").append($.Mustache.render("tpl-form40-drug", {
            drug: [{no: no}],
            disabled: "",
            save: [1]
        }));
        var option = {};
        option["Start" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        option["End" + no] = {range: CRF_RANGE, value: T.date.format(new Date(), "yyyy-MM-dd")};
        esui.init(this.el, option);
        
        esui.get("Start" + no).onchange = function(value) {esui.get("Start" + no).setValueAsDate(value);};
        esui.get("End" + no).onchange = function(value) {esui.get("End" + no).setValueAsDate(value);};
        var me = this;
        esui.get("Save" + no).onclick = function() {
            var block = $(this.main).parent().parent();
            me.saveDrug(block);
        };
        $("#ctrltextName" + no).autocomplete({source: util.getSuggestion("drug")});
        $("#ctrltextWay" + no).autocomplete({source: util.getSuggestion("way")});
    },
    
    saveDrug: function(block) {
        var no = block.attr("no"),
            id = block.attr("id"),
            name = $.trim(esui.get("Name" + no).getValue()),
            start = esui.get("Start" + no).getValue(),
            end = esui.get("End" + no).getValue(),
            dose = $.trim(esui.get("Dose" + no).getValue()),
            unit = $.trim(esui.get("Unit" + no).getValue()),
            way = $.trim(esui.get("Way" + no).getValue()),
            frequency = $.trim(esui.get("Frequency" + no).getValue());
        var data = {
            id: es.main.crfId,
            drugId: id == "" ? null : parseInt(id, 10),
            name: name,
            start: start,
            end: end,
            dose: dose,
            unit: unit,
            way: way,
            frequency: frequency
        };
        
        //验证
        var intPattern = /^\d+$/;
        if (data.name == "") {
           esui.Dialog.alert({title: "提示", content: "请填写通用名称"});
           return false;
        }
        if (T.date.parse(data.start).getTime() > T.date.parse(data.end).getTime()) {
            esui.Dialog.alert({title: "提示", content: "开始日期不能晚于停止日期"});
            return;
        }
        if (!intPattern.test(data.dose)) {
            esui.Dialog.alert({title: "提示", content: "请填写单次用药剂量"});
            return false;
        }
        if (data.unit == "") {
            esui.Dialog.alert({title: "提示", content: "请填写剂量单位"});
            return false;
        }
        if (data.way == "") {
            esui.Dialog.alert({title: "提示", content: "请填写给药途径"});
            return false;
        }
        if (data.frequency == "") {
            esui.Dialog.alert({title: "提示", content: "请填写给药频次"});
            return false;
        }
        
        console.log("crf/saveOneDrugCombination.do-请求", data);
        
        util.ajax.run({
            url: "crf/saveOneDrugCombination.do",
            data: data,
            success: function(response) {
                console.log("crf/saveOneDrugCombination.do-响应:", response);
                
                block.attr({id: response.id});
                var table = esui.get("Drug"),
                    rowData = {
                        id: response.id,
                        name: name,
                        start: start,
                        end: end,
                        dose: dose,
                        unit: unit,
                        way: way,
                        frequency: frequency
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
    
    delDrug: function(e) {
        var id = parseInt($(e.target).attr("id").replace('del', ''), 10),
            block = this.$("#" + id),
            no = block.attr("no");
        
        var data = {
           id: es.main.crfId,
           drugId: id
        };
        
        console.log("crf/deleteOneDrugCombination.do-请求:", data);
        
        util.ajax.run({
            url: "crf/deleteOneDrugCombination.do",
            data: data,
            success: function(response) {
                console.log("crf/deleteOneDrugCombination.do-响应:", response);
                
                esui.dispose("Start" + no);
                esui.dispose("End" + no);
                esui.dispose("Save" + no);
                $("#ctrltextName" + no).autocomplete("destroy");
                $("#ctrltextWay" + no).autocomplete("destroy");
                block.remove();
                
                var table = esui.get("Drug"), row = null;
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
           hasDrug: parseInt(esui.get("Merge1").getGroup().getValue(), 10),
           drug: esui.get("Drug").datasource
       };
       
       if (isNaN(data.hasDrug)) {
           esui.Dialog.alert({title: "提示", content: "请选择有无合并用药"});
           return;
       } else if (data.hasDrug == 2) {
           data.drug = [];
       } else if (data.drug.length == 0) {
           esui.Dialog.alert({title: "提示", content: "请添加合并用药"});
           return;
       }
       
       console.log("crf/saveDrugCombinationInfo.do-请求", data);
       
       util.ajax.run({
            url: "crf/saveDrugCombinationInfo.do",
            data: JSON.stringify(data),
            json: true,
            success: function(response) {
                console.log("crf/saveDrugCombinationInfo.do-响应:", response);
                
                me.updateProgress(response.progress);
                if (me.form.model.first) {
                    $("#TreeNode51").click();
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
