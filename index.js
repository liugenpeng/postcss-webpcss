var postcss = require('postcss');
var helpers = require('postcss-helpers');
var fs = require('fs');
module.exports = postcss.plugin('postcss-webp', function (opts) {
    var defaultOptions = {
        suffix:['.png', '.jpg'],
        rules:{
            from:'../images',
            to:'../images/webp'
        },
        force:false 
    };
  
    opts = Object.assign({}, defaultOptions, opts);
    
    function _formatSelector(_mutiSelector) {
        return _mutiSelector.map(function(selector,i){

            if (selector.indexOf('.chrome') > -1) {
                return selector;
            } else {
                return '.chrome ' + selector;
            } 
              
        });
    }
    //解析并重置对应的background-position属性
    function _formatBpRules(decl,_mutiSelector){
        var bpRules = [];
        var selArr ;
        if (decl.prop.toLocaleLowerCase() == 'background-position') { 
            
            selArr  =  _formatSelector(_mutiSelector) ;
            var  str = selArr.join(',') ;
            
            bpRules.push((str) +" { background-position:"+decl.value+" !important }");
        }
        return bpRules;
    }

    return function (style, result) {
        var selectors = [];
        var impAttrs = [];
      
        style.walk(function(node){
            
            if (!node.selector) {
                return ;
            }
            
           
            
            node.walkDecls(function(decl){
                var ruleValue = decl.value;
                //是否含有.gif
                if (!ruleValue || ruleValue.indexOf('.gif')>-1) {
                    return;
                }
                var _mutiSelector = node.selector.split(',');
                //解析并重置对应的background-position属性
                impAttrs = _formatBpRules(decl, _mutiSelector);

                //不含有url属性，
                if (!ruleValue.match(helpers.regexp.URLS)) { return; }
               
                str = _formatSelector(_mutiSelector).join(',');

                //替换相应的图片格式
                opts.suffix.forEach(function(suffix) {
                    ruleValue = ruleValue.replace(suffix, '.webp');
                });
                //isFixed
                if(/\/webp\//.test(ruleValue)==false){
                    ruleValue =ruleValue.replace(opts.rules.from, opts.rules.to);
                }
                selectors.push((str||node.selector) +" { background:"+ruleValue+"}")
                
              });
          
        });


        var finallyArray =  selectors.concat(impAttrs);

        fs.writeFile(opts.dest, finallyArray.join("\n"), (err) => {
           
        });
    };
});