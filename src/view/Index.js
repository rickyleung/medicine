/*
 * 首页
 * 
 * @author: Ricky
 */

es.Views.Index = Backbone.View.extend({
    el: "#Main",
    
    events: {
        "click .phm1": "openNewCRF",
        "click .phm2": "openNewADR"
    },
    
    initialize: function() {
        
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("index");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/index.html").done(function() {
            me.$el.mustache("tpl-index", {
                row1: Auth.CRO || Auth.LCRO ? [1] : [],
                row2: Auth.CRM || Auth.DM ? [1] : [],
                row3: Auth.DM || Auth.LCRO ? [1] : [],
                row31: Auth.DM ? [1] : [],
                row32: Auth.DM ? [1] : []
            });
            if (me.$(".phm").length != 0) {
                me.$(".index-wrap").append($.Mustache.render("tpl-new-crf-dialog"));
                me.$(".index-wrap").append($.Mustache.render("tpl-new-adr-dialog"));
                me.initCtrl();
            }
        });
    },
    
    initCtrl: function() {
        esui.init();
        esui.get("NewCRFOK").onclick = this.newCRF;
        esui.get("NewADROK").onclick = this.newADR;
    },
    
    /*
     * 打开对话框
     */
    openNewCRF: function() {
        esui.get("NewAbbr").setValue("");
        $("#ctrltextNewAbbr").next().empty();
        esui.get("NewNo").setValue("");
        $("#ctrltextNewNo").next().empty();
        esui.get("NewCRFDialog").show();
    },
    
    /*
     * 新建CRF
     */
    newCRF: function() {
        var data = {
            abbr: $.trim(esui.get("NewAbbr").getValue()),
            no: $.trim(esui.get("NewNo").getValue())
        };
        
        //验证
        var error1 = $("#ctrltextNewAbbr").next(),
            error2 = $("#ctrltextNewNo").next();
        error1.empty();
        error1.empty();
        if (data.abbr === "") {
            error1.html("请填写患者姓名缩写");
            return;
        }
        if (!/^[a-z]+$/i.test(data.abbr)) {
            error1.html("必须为字母");
            return;
        }
        if (data.no === "") {
            error2.html("请填写观察表编号");
            return;
        }
        if (!/^\d{3}-\d{4}$/.test(data.no)) {
            error2.html("格式应为：xxx-xxxx");
            return;
        }
        
        console.log("crf/addCRF.do-请求", data);
        
        util.ajax.run({
            url: "crf/addCRF.do",
            data: data,
            success: function(response) {
                console.log("crf/addCRF.do-响应", response);
                
                esui.get("NewCRFDialog").hide();
                es.router.navigate("crf/update/" + response.id, true);
            },
            mock: MOCK,
            mockData: {
                success: true,
                id: 1,
                no: "333-1234"
            }
        });
    },
    
    /*
     * 打开对话框
     */
    openNewADR: function() {
        esui.get("No").setValue("");
        $("#AdrError").empty();
        esui.get("NewADRDialog").show();
    },
    
    /*
     * 新建ADR
     */
    newADR: function() {
        var data = {
            no: $.trim(esui.get("No").getValue())
        };
        
        //验证
        if (data.no === "") {
            $("#AdrError").html("请填写观察表编号");
            return;
        }
        if (!/^\d{3}-\d{4}$/.test(data.no)) {
            $("#AdrError").html("格式应为：xxx-xxxx");
            return;
        }
        
        console.log("crf/addADR.do-请求", data);
        
        util.ajax.run({
            url: "crf/addADR.do",
            data: data,
            success: function(response) {
                console.log("crf/addADR.do-响应", response);
                
                esui.get("NewADRDialog").hide();
                es.router.navigate("crf/updateadr/" + response.id, true);
            },
            mock: MOCK,
            mockData: {
                success: true,
                id: 1
            }
        });
    }
});
