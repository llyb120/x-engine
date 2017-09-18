# X-engine
可能是我们眼中倒数的nodejs控制器

### 一分钟入门
1. 引入x-engine
```
import {X} from 'x-engine'
```

2. 书写控制器
```
class ctrl1 {
    test1(req : Request,res : Response,hahaha : string){
        return {
            guichu : 123321
        }
        // res.redirect("http://www.baidu.com")
    }

}
```

3. 你可以用装饰器或者直接注册的方式来注册控制器
```
var config = {
    //:method会被替换为你控制器里对应的函数名，例如访问/test/test1.html即调用test1方法
    url : "/test/:method.html",
    //对应的函数会被注入到对应的参数里
    inject : {
        hahaha(){
            return 1;
        }
    },
    // 模板渲染同url，需要你预先指定模板渲染引擎以及view目录
    // render : TEMPLATE + '/:method.html',
    type :　'json'
}

@X.Controller(config)
class ctrl1{
    .....
}

或者

// X.registerController(ctrl1,config);
```


4. 你在控制器里填入的方法参数，系统会自动注入，例如req就是request, res是response，这里我们注入了自定义的hahaha，当存在render选项的时候，return的东西会被注入到模板里，当存在type : 'json'的时候，函数return的东西会被转换成json格式输出