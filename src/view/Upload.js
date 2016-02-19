/*
 * 图片上传
 * 
 * @author: Ricky
 */

es.Views.Upload = Backbone.View.extend({
    el: "#Main",
    
    events: {
        
    },
    
    initialize: function() {
        
    },
    
    destroy: function() {
        this.$("#UploadContainer").pluploadQueue().destroy();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("upload");
    },
    
    render: function(query) {
        this.renderNav();
        
        var me = this;
        $.Mustache.load("asset/tpl/upload.html").done(function() {
            me.$el.mustache("tpl-upload");
            me.initCtrl();
            me.initUpload();
        });
    },
    
    /*
     * 初始化控件
     */
    initCtrl: function() {
        esui.init(this.el, {
            UploadType: {
                datasource: [{name: "请选择", value: 0}],
                value: 0
            }
        });
    },
    
    initUpload: function() {
        this.$("#UploadContainer").pluploadQueue({
            runtimes: 'flash',
            flash_swf_url: 'asset/swf/Moxie.swf',
            url: '../upload.php',
            chunk_size: '1mb',
            unique_names: true,
            filters: {
                max_file_size: '10mb',
                mime_types: [
                    {title: "Image files", extensions : "jpg,jpeg,bmp,gif,png"}
                ]
            }
        });
    }
});
