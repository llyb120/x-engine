import { X } from "../X";
import { Request, Response } from "express";
import * as express from "express";


@X.Controller({
    url : "/test/:method.html",
    inject : {
        fuck(){
            return 1;
        }
    }
})
class ctrl1 {
    test1(req : Request,res : Response,fuck : string){
        console.log(fuck)
        res.redirect("http://www.baidu.com")
    }

    test2(res : Response){
        
    }


}

var app = express();
app.listen(800);

console.log(123321)
// X.registerController(ctrl1,);

X.startExpressServer(app);