"use strict";
// import { V as X } from "../X";
// import { Request, Response } from "express";
// import * as express from "express";
// import * as path from "path";
// import * as WebSocket from "ws"
// import * as http from "http"
// import * as nunjucks from "nunjucks";
// import { Connection } from '../api';
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
// }
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
//     socket : Connection.WebSocket
// });
// server.listen(8080);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlDQUFpQztBQUNqQywrQ0FBK0M7QUFDL0Msc0NBQXNDO0FBQ3RDLGdDQUFnQztBQUNoQyxrQ0FBa0M7QUFDbEMsK0JBQStCO0FBRS9CLHdDQUF3QztBQUN4Qyx1Q0FBdUM7QUFFdkMsb0NBQW9DO0FBRXBDLHVEQUF1RDtBQUV2RCxrQkFBa0I7QUFDbEIsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyxnQkFBZ0I7QUFDaEIsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QixZQUFZO0FBQ1osU0FBUztBQUNULDZDQUE2QztBQUM3QywyQkFBMkI7QUFDM0IsS0FBSztBQUNMLGdCQUFnQjtBQUNoQiwyRkFBMkY7QUFDM0YsdUNBQXVDO0FBQ3ZDLG1CQUFtQjtBQUNuQiw2QkFBNkI7QUFDN0IsWUFBWTtBQUNaLGtEQUFrRDtBQUNsRCxRQUFRO0FBRVIsNkJBQTZCO0FBQzdCLDhCQUE4QjtBQUM5QixzQkFBc0I7QUFDdEIsUUFBUTtBQUdSLElBQUk7QUFDSixtQkFBbUI7QUFFbkIsa0JBQWtCO0FBQ2xCLGtDQUFrQztBQUNsQyx1QkFBdUI7QUFDdkIsS0FBSztBQUNMLHlCQUF5QjtBQUV6QixxQ0FBcUM7QUFDckMsa0NBQWtDO0FBQ2xDLHdDQUF3QztBQUN4QyxRQUFRO0FBRVIsNERBQTREO0FBQzVELHNDQUFzQztBQUN0QywyQkFBMkI7QUFDM0IsUUFBUTtBQUdSLElBQUk7QUFHSix1QkFBdUI7QUFFdkIsMkNBQTJDO0FBQzNDLHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLE1BQU07QUFFTix5Q0FBeUM7QUFFekMseUJBQXlCO0FBQ3pCLGdCQUFnQjtBQUNoQixzQkFBc0I7QUFDdEIseUJBQXlCO0FBQ3pCLG9DQUFvQztBQUVwQyxNQUFNO0FBQ04sdUJBQXVCIn0=