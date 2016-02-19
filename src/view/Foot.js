/*
 * 底部
 * 
 * @author: Ricky
 */

es.Views.Foot = Backbone.View.extend({
    el: "#Foot",
    
    events: {
        
    },
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        this.$el.html($.Mustache.render("tpl-foot", {
            year: (new Date()).getFullYear()
        }));
    }
});
