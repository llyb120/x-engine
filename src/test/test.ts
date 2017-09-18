import { X } from "../X";
import { Request, Response } from "express";
import * as express from "express";
import * as path from "path";

const TEMPLATE = path.resolve(__dirname,'../view');

@X.Controller({
    url : "/test/:method.html",
    inject : {
        fuck(){
            return 1;
        }
    },
    render : TEMPLATE + '/:method.html',
    // type :　'json',
})
class ctrl1 {
    test1(req : Request,res : Response,fuck : string,query,body,c : string){
        console.log(query,body,c);
        return {
            guichu : 123321
        }
        // res.redirect("http://www.baidu.com")
    }

    test2(res : Response){
        
    }


}

import * as nunjucks from "nunjucks";

var app = express();
app.listen(800);

var env = nunjucks.configure(TEMPLATE, {
    autoescape: true,
    express: app,
    noCache: true
});
console.log('server is listing on 800');
// X.registerController(ctrl1,);

X.startExpressServer(app);