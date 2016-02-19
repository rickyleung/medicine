/*
 * 树形菜单
 * 
 * @author: Ricky
 */

function Tree(option) {
    this.container = option.container;
    this.data = option.data;
    this.onClick = option.onClick;
    this.defaultId = option.defaultId;
    this.onLoad = option.onLoad;
    this.init();
}

Tree.prototype = {
    init: function() {
        //绑定事件
        var me = this;
        $(this.container).delegate(".menu-title", "click", function(e) {
            me.fold(e);
        });
        $(this.container).delegate(".menu-title-standalone a", "click", function(e) {
            me.onTitleClick(e);
        });
        $(this.container).delegate(".menu-item", "click", function(e) {
            me.onItemClick(e);
        });
        
        //渲染
        var html = [];
        $.each(this.data, function(index, val) {
            html.push($.Mustache.render(val.children ? "tpl-tree" : "tpl-tree-standalone", {
                data: val
            }));
        });
        $(this.container).append(html.join(""));
        
        this.onLoad && this.onLoad();
        
        //选中默认结点
        $(this.container + " #TreeNode" + this.defaultId).click();
    },
    
    /*
     * 折叠菜单
     */
    fold: function(e) {
        var me = $(e.target);
        me.toggleClass("menu-title-collapse");
        me.next().toggle(100);
    },
    
    /*
     * 切换一级表单
     */
    onTitleClick: function(e) {
        var me = $(e.target);
        if (e.target.tagName.toLowerCase() !== "a") {
            me = me.parent();
        }
        if (me.hasClass("active")) {
            return;
        }
        
        $(this.container + " .menu-title-standalone a").removeClass("active");
        $(this.container + " .menu-item").removeClass("menu-item-active");
        me.addClass("active");
        
        this.onClick(parseInt(me.attr("id").replace(/[a-z]+/i, ""), 10), me);
    },
    
    /*
     * 切换二级表单
     */
    onItemClick: function(e) {
        var me = $(e.target);
        if (e.target.tagName.toLowerCase() !== "a") {
            me = me.parent();
        }
        if (me.hasClass("menu-item-active")) {
            return;
        }
        
        $(this.container + " .menu-title-standalone a").removeClass("active");
        $(this.container + " .menu-item").removeClass("menu-item-active");
        me.addClass("menu-item-active");
        
        this.onClick(parseInt(me.attr("id").replace(/[a-z]+/i, ""), 10), me);
    },
    
    destroy: function() {
        $(this.container).undelegate().empty();
    }
};
