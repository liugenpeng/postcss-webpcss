# postcss-webpcss
自动化处理css,适配webp格式图片

## 说明
### 使用的前提有两个，
> 1.需要将对应图片转换成webp格式

> 2.由于浏览器支持原因，主流的只有chrome浏览器之前，所以需要加一个浏览器识别模块，并在html标签自动加上浏览器前缀（这里假定加入的是.chrome前缀）

### 原理
> 将样式表含有background并且含有url规则的样式抽取出来，然后加上浏览器(比如.chrome)前缀，并将url中图片路径替换成webp格式图片路径，最后将抽取的规则生成一个新的样式表文件

## demo

gulp配置（演示含有@import 或者想忽略某些文件的用法）
```
var postcssWebp = require( './index' );
var atImport = require("postcss-import")
//针对webp进行css修复
gulp.task('webp:cssfix', function(){
   
    var css = fs.readFileSync('./app/styles/css/all.css', 'utf8');
    
    var out = postcss()
       .use(postcssWebp({
            dest:"./scss/modules/webp.scss",
            suffix:['.png', '.jpg'],
            rules:{
                from:'../images',
                to:'../images/webp'
            }
       }))
       .process(css).then(function(result){
            console.log("webp.scss生成成功！");
       });

   var css2 = fs.readFileSync('./app/styles/css/components/index.css', 'utf8' );
   var out = postcss()
  
    .use(atImport({
        resolve:function(id, basedir, importOptions){
            if (id != 'webp-fixed.css'){
                return basedir+"/"+id;
            }
        }
    }))
    .use(postcssWebp({
        dest:"./app/styles/css/components/webp-fixed.css",
        suffix:['.png', '.jpg'],
        rules:{
            from:'../images',
            to:'../images/webp'
        }
    }))
    .process(css2,{
        from: "./app/styles/css/components/index.css"
    }).then(function(result){
       console.log(arguments);
        console.log("webp-fixed.css转换成功！");
    });
  
});
```

## 处理前css文件
```
.task-quick-do-titaw .ico-apply  { background:url(../../../images/webp/components/tita-widget/reward-close-btn.png) no-repeat }
.task-quick-do-titaw .ico-apply { background-position:0 -120px }
```
## 处理后css样式
```
.chrome .task-quick-do-titaw .ico-apply { background:url(../../../images/webp/components/tita-widget/reward-close-btn.webp) no-repeat }
.chrome .task-quick-do-titaw .ico-apply { background-position:0 -120px !important }
```
