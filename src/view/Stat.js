/*
 * 全局统计
 * 
 * @author: Ricky
 */

es.Views.Stat = Backbone.View.extend({
    el: "#Main",
    
    events: {
        
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderChart, this);
    },
    
    destroy: function() {
        esui.dispose();
        this.destroyChart();
        this.menu && this.menu.destroy();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    destroyChart: function() {
        var chart = this.$(".chart").highcharts();
        chart && chart.destroy();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("stat");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/stat.html").done(function() {
            me.$el.mustache("tpl-stat");
            
            esui.init();
            
            //创建菜单
            me.menu = new Tree({
                container: ".sidebar",
                data: STAT_MENU,
                onClick: me.onMenuClick,
                defaultId: 1
            });
        });
    },
    
    onMenuClick: function(id) {
        var me = es.main;
        me.statType = id;
        me.model.getData(id);
    },
    
    /*
     * 渲染Chart
     */
    renderChart: function(model, data) {
        this.destroyChart();
        
        switch (this.statType) {
            case 1:
                this.$('.chart').css({height: Math.max(400, data.categories.length * 50)}).show();
                this.$('.stat-grid').hide();
                this.renderHospitalChart(data);
                break;
            case 2:
                this.$('.chart').css({height: 400}).show();
                this.$('.stat-grid').hide();
                this.renderAgeChart(data);
                break;
            case 3:
                this.$('.chart').css({height: 400}).show();
                this.$('.stat-grid').hide();
                this.renderSexChart(data);
                break;
            case 4:
                this.$('.chart').hide();
                this.$('.stat-grid').show();
                this.renderADE(data);
        }
    },
    
    renderHospitalChart: function(data) {
        this.$(".chart").highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: '医院统计'
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: '数目'
                }
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: data.series
        });
    },
    
    renderAgeChart: function(data) {
        this.renderPieChart(data, "年龄统计");
    },
    
    renderSexChart: function(data) {
        this.renderPieChart(data, "性别统计");
    },
    
    renderPieChart: function(data, title) {
        this.$(".chart").highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '表单数: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                data: data
            }]
        });
    },
    
    renderADE: function(data) {
        var ade = esui.get("Grid");
        
        if (data == null || data.length == 0) {
            this.$(".no-result").show();
            $(ade.main).hide();
        } else {
            this.$(".no-result").hide();
            $(ade.main).show();
            
            ade.datasource = data;
            ade.fields = [
                {
                    field: "no",
                    title: "观察表编号",
                    content: function(item) {
                        return $.Mustache.render("tpl-stat-ade-detail", {
                            id: item.id,
                            no: item.no
                        });
                    }
                },
                {
                    field: "age",
                    title: "年龄",
                    sortable: true,
                    content: function(item) {return item.age;}
                },
                {
                    field: "sex",
                    title: "性别",
                    sortable: true,
                    content: function(item) {return item.sex;}
                },
                {
                    field: "ethic",
                    title: "民族",
                    sortable: true,
                    content: function(item) {return item.ethic;}
                },
                {
                    field: "diagnosis",
                    title: "第一诊断",
                    sortable: true,
                    content: function(item) {return item.diagnosis;}
                },
                {
                    field: "ade",
                    title: "不良反应/事件名称",
                    sortable: true,
                    content: function(item) {return item.ade;}
                }
            ];
            ade.render();
        }
    }
});
