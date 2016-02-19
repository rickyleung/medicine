/*
 * 数据字典
 * 
 * @author: Ricky
 */

es.Views.Dict = Backbone.View.extend({
    el: "#Main",
    
    events: {
        
    },
    
    initialize: function() {
        this.model.bind("change:dict", this.renderDict, this);
        this.model.bind("change:item", this.renderItem, this);
        this.model.bind("change:base", this.renderBase, this);
    },
    
    destroy: function() {
        this.menu && this.menu.destroy();
        this.$("#ctrltextItem").autocomplete("destroy");
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("dict");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/dict.html").done(function() {
            me.$el.mustache("tpl-dict");
            me.initCtrl();
            me.model.getDict();
        });
    },
    
    initCtrl: function() {
        esui.init();
        
        esui.get("AddToDict").onclick = this.addToDict;
        esui.get("Items").onsort = function(field, order) {
            var orderBy = field.field,
                listData = baidu.object.clone(esui.get("Items").datasource);
            
            listData.sort(function(a, b) {
                var compareResult;
                switch (orderBy) {
                    case "name":
                        compareResult = a.name.localeCompare(b.name);
                        break;
                    case "baseItemName":
                        compareResult = a.baseItemName.localeCompare(b.baseItemName);
                }
                if (order == 'desc') {
                    compareResult = -compareResult;
                }
                return compareResult;
            });
            
            this.datasource = listData;
            this.render();
        };
        
        var me = this;
        this.$("#ctrltextItem").autocomplete({
            source: function(request, response) {
                util.ajax.run({
                    url: "dict/getBaseList.do",
                    data: {
                        keyword: $.trim(request.term),
                        id: me.dictId
                    },
                    success: function(data) {
                        console.log("dict/getBaseList.do", data);
                        
                        response($.map(data.data, function(item) {
                            return {
                                label: item.baseItemName + "（" + item.baseItemAbbr + "）",
                                value: item.baseItemName,
                                id: item.baseItemId
                            };
                        }));
                    },
                    mock: MOCK,
                    mockData: {
                        success: true,
                        data: [
                            {baseItemName: "高血压", baseItemAbbr: "gxy", baseItemId: 1},
                            {baseItemName: "心肌梗死", baseItemAbbr: "xjgs", baseItemId: 2}
                        ]
                    }
                });
            },
            select: function(event, ui) {
                var me = es.main;
                me.baseItemId = ui.item.id;
                me.baseItemName = ui.item.value;
            }
        });
    },
    
    /*
     * 创建字典
     */
    renderDict: function(model, dict) {
        this.menu = new Tree({
            container: ".sidebar",
            data: dict.data,
            onClick: this.onDictClick,
            defaultId: dict.data[0].id
        });
    },
    
    onDictClick: function(id) {
        var me = es.main;
        me.dictId = id;
        me.model.getItem({id: id});
    },
    
    /*
     * 创建条目
     */
    renderItem: function(model, item) {
        var table = esui.get("Items");
        table.datasource = item.data;
        table.fields = [
            {field: "name", title: "条目名称", sortable: true, content: function(item) {
                return $.Mustache.render("tpl-dict-item", {
                    id: item.id,
                    name: item.name,
                    abbr: item.abbr
                });
            }},
            {field: "baseItemName", title: "底层字典", sortable: true, content: function(item) {
                return !item.baseItemId ? "--" : $.Mustache.render("tpl-dict-item", {
                    id: item.baseItemId,
                    name: item.baseItemName,
                    abbr: item.baseItemAbbr
                });
            }}
        ];
        table.render();
    },
    
    addToDict: function() {
        var selected = $(".ui-table-row-selected span"),
            item = $.trim(esui.get("Item").getValue()),
            me = es.main,
            baseItemId = null,
            baseItemName = null;
        
        if (item == "") {
            esui.Dialog.alert({
                title: "关联",
                content: "请填写或从下拉列表中选择底层字典条目。"
            });
            return;
        }
        
        if (selected.length == 0) {
            esui.Dialog.alert({
                title: "关联",
                content: "请选择条目。"
            });
            return;
        }
        
		if (me.baseItemId && me.baseItemName == item) { //从autocomplete选择
			baseItemId = me.baseItemId;
		} else {
		    baseItemName = item;
		}
		
		var selectedItemId = [];
		$.each(selected, function(index, val) {
			selectedItemId.push(parseInt(val.id, 10));
		});
		
		var data = {
		    selectedItemId: selectedItemId.join(","),
            baseItemId: baseItemId,
            baseItemName: baseItemName
		};
		
		console.log("dict/addItemToBase.do-请求", data);
		
		util.ajax.run({
			url: "dict/addItemToBase.do",
			data: data,
			success: function(response) {
			    console.log("dict/addItemToBase.do-响应", response);
			    
				me.model.getItem({id: me.dictId});
			},
			mock: MOCK,
			mockData: {
				success: true
			}
		});
    }
});
