/*
 * 导航
 * 
 * @author: Ricky
 */

es.Views.Nav = Backbone.View.extend({
    el: "#Nav",
    
    events: {
        
    },
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        
    },
    
    setActive: function(className) {
        this.$("a").removeClass("active");
        this.$("." + className).addClass("active");
    },
    
    clearActive: function() {
        this.$("a").removeClass("active");
    }
});
