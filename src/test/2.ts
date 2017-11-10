// import { V as X } from "../X";
// // import { Request, Response } from "express";
// // import * as express from "express";
// // import * as path from "path";
// // import * as WebSocket from "ws"
// // import * as http from "http"

// // import * as nunjucks from "nunjucks";
// import { Connection, ExpressContext } from '../api';

// // import * as should from "should";

// // const TEMPLATE = path.resolve(__dirname, '../view');

// console.log(123321)
// @X.Controller({
//     type: Connection.HTTP,
//     url: "/test/:method.html",
//     inject: {
//         fuck() {
//             return 1;
//         }
//     },
//     authorization : ['testauth']
//     // render: TEMPLATE + '/:method.html',
//     //dataType : "json";
// })
// class ctrl1 {
// //     test1(req: Request, res: Response, fuck: string, query: any, body: any, c: string) {
// //         console.log(query, body, c);
// //         return {
// //             guichu: 123321
// //         }
// //         // res.redirect("http://www.baidu.com")
// //     }

//     test2() {
//         console.log("Fuck")
//         return 123;
//     }

// //     test(){

// //     }


// }



// // X.registerAuthorization(Connection.HTTP,{
// //     testauth : function(ctx : ExpressContext){
// //         ctx.res.redirect("http://www.baidu.com");
// //         return false;
// //     }
// // })

// // console.log(123)

// // @X.Controller({
// //     type: Connection.WebSocket,
// //     url: "/liaoyang"
// // })
// // class GameController {

// //     onConnect(ws: any,req : any) {
// //         console.log(ws,req.url)
// //         console.log("oh i'm coming");
// //     }

// //     onMessage(ws: WebSocket, req: any, message: string) {
// //         console.log("fuck",message)
// //         ws.send("pong");
// //     }


// // }


// // var app = express();

// // var env = nunjucks.configure(TEMPLATE, {
// //     autoescape: true,
// //     express: app,
// //     noCache: true
// // });

// // const server = http.createServer(app);

// X.startExpressServer({
//     // app: app,
//     // server: server,
//     crossDomain: true,
//     port : 8080,
//     init : (server,app) => {
//         console.log("server is listen 8080");
//     }
// });
// // server.listen(8080);
