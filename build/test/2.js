"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlDQUFpQztBQUNqQyxrREFBa0Q7QUFDbEQseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyxxQ0FBcUM7QUFDckMsa0NBQWtDO0FBRWxDLDJDQUEyQztBQUMzQyx1REFBdUQ7QUFFdkQsdUNBQXVDO0FBRXZDLDBEQUEwRDtBQUUxRCxzQkFBc0I7QUFDdEIsa0JBQWtCO0FBQ2xCLDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFDakMsZ0JBQWdCO0FBQ2hCLG1CQUFtQjtBQUNuQix3QkFBd0I7QUFDeEIsWUFBWTtBQUNaLFNBQVM7QUFDVCxtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLDJCQUEyQjtBQUMzQixLQUFLO0FBQ0wsZ0JBQWdCO0FBQ2hCLDhGQUE4RjtBQUM5RiwwQ0FBMEM7QUFDMUMsc0JBQXNCO0FBQ3RCLGdDQUFnQztBQUNoQyxlQUFlO0FBQ2YscURBQXFEO0FBQ3JELFdBQVc7QUFFWCxnQkFBZ0I7QUFDaEIsOEJBQThCO0FBQzlCLHNCQUFzQjtBQUN0QixRQUFRO0FBRVIsaUJBQWlCO0FBRWpCLFdBQVc7QUFHWCxJQUFJO0FBSUosK0NBQStDO0FBQy9DLG9EQUFvRDtBQUNwRCx1REFBdUQ7QUFDdkQsMkJBQTJCO0FBQzNCLFdBQVc7QUFDWCxRQUFRO0FBRVIsc0JBQXNCO0FBRXRCLHFCQUFxQjtBQUNyQixxQ0FBcUM7QUFDckMsMEJBQTBCO0FBQzFCLFFBQVE7QUFDUiw0QkFBNEI7QUFFNUIsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQywyQ0FBMkM7QUFDM0MsV0FBVztBQUVYLCtEQUErRDtBQUMvRCx5Q0FBeUM7QUFDekMsOEJBQThCO0FBQzlCLFdBQVc7QUFHWCxPQUFPO0FBR1AsMEJBQTBCO0FBRTFCLDhDQUE4QztBQUM5QywyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2QixTQUFTO0FBRVQsNENBQTRDO0FBRTVDLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIsK0JBQStCO0FBQy9CLGdEQUFnRDtBQUNoRCxRQUFRO0FBQ1IsTUFBTTtBQUNOLDBCQUEwQiJ9