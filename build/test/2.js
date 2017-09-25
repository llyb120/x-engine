"use strict";
// import { V as X } from "../X";
// import { Request, Response } from "express";
// import * as express from "express";
// import * as path from "path";
// import * as WebSocket from "ws"
// import * as http from "http"
// import * as nunjucks from "nunjucks";
// import { Connection, ExpressContext } from '../api';
// import * as should from "should";
// const TEMPLATE = path.resolve(__dirname, '../view');
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
//     test1(req: Request, res: Response, fuck: string, query: any, body: any, c: string) {
//         console.log(query, body, c);
//         return {
//             guichu: 123321
//         }
//         // res.redirect("http://www.baidu.com")
//     }
//     test2(res: Response) {
//         console.log("Fuck")
//         return 123;
//     }
//     test(){
//     }
// }
// X.registerAuthorization(Connection.HTTP,{
//     testauth : function(ctx : ExpressContext){
//         ctx.res.redirect("http://www.baidu.com");
//         return false;
//     }
// })
// console.log(123)
// @X.Controller({
//     type: Connection.WebSocket,
//     url: "/liaoyang"
// })
// class GameController {
//     onConnect(ws: any,req : any) {
//         console.log(ws,req.url)
//         console.log("oh i'm coming");
//     }
//     onMessage(ws: WebSocket, req: any, message: string) {
//         console.log("fuck",message)
//         ws.send("pong");
//     }
// }
// var app = express();
// var env = nunjucks.configure(TEMPLATE, {
//     autoescape: true,
//     express: app,
//     noCache: true
// });
// const server = http.createServer(app);
// X.startExpressServer({
//     app: app,
//     server: server,
//     crossDomain: true,
// });
// server.listen(8080);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlDQUFpQztBQUNqQywrQ0FBK0M7QUFDL0Msc0NBQXNDO0FBQ3RDLGdDQUFnQztBQUNoQyxrQ0FBa0M7QUFDbEMsK0JBQStCO0FBRS9CLHdDQUF3QztBQUN4Qyx1REFBdUQ7QUFFdkQsb0NBQW9DO0FBRXBDLHVEQUF1RDtBQUV2RCxrQkFBa0I7QUFDbEIsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyxnQkFBZ0I7QUFDaEIsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QixZQUFZO0FBQ1osU0FBUztBQUNULG1DQUFtQztBQUNuQyw2Q0FBNkM7QUFDN0MsMkJBQTJCO0FBQzNCLEtBQUs7QUFDTCxnQkFBZ0I7QUFDaEIsMkZBQTJGO0FBQzNGLHVDQUF1QztBQUN2QyxtQkFBbUI7QUFDbkIsNkJBQTZCO0FBQzdCLFlBQVk7QUFDWixrREFBa0Q7QUFDbEQsUUFBUTtBQUVSLDZCQUE2QjtBQUM3Qiw4QkFBOEI7QUFDOUIsc0JBQXNCO0FBQ3RCLFFBQVE7QUFFUixjQUFjO0FBRWQsUUFBUTtBQUdSLElBQUk7QUFFSiw0Q0FBNEM7QUFDNUMsaURBQWlEO0FBQ2pELG9EQUFvRDtBQUNwRCx3QkFBd0I7QUFDeEIsUUFBUTtBQUNSLEtBQUs7QUFFTCxtQkFBbUI7QUFFbkIsa0JBQWtCO0FBQ2xCLGtDQUFrQztBQUNsQyx1QkFBdUI7QUFDdkIsS0FBSztBQUNMLHlCQUF5QjtBQUV6QixxQ0FBcUM7QUFDckMsa0NBQWtDO0FBQ2xDLHdDQUF3QztBQUN4QyxRQUFRO0FBRVIsNERBQTREO0FBQzVELHNDQUFzQztBQUN0QywyQkFBMkI7QUFDM0IsUUFBUTtBQUdSLElBQUk7QUFHSix1QkFBdUI7QUFFdkIsMkNBQTJDO0FBQzNDLHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLE1BQU07QUFFTix5Q0FBeUM7QUFFekMseUJBQXlCO0FBQ3pCLGdCQUFnQjtBQUNoQixzQkFBc0I7QUFDdEIseUJBQXlCO0FBQ3pCLE1BQU07QUFDTix1QkFBdUIifQ==