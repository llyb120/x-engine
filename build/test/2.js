"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const X_1 = require("../X");
const express = require("express");
const path = require("path");
const http = require("http");
const nunjucks = require("nunjucks");
const api_1 = require("../api");
const TEMPLATE = path.resolve(__dirname, '../view');
let ctrl1 = class ctrl1 {
    test1(req, res, fuck, query, body, c) {
        console.log(query, body, c);
        return {
            guichu: 123321
        };
        // res.redirect("http://www.baidu.com")
    }
    test2(res) {
        console.log("Fuck");
        return 123;
    }
    test() {
    }
};
ctrl1 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/test/:method.html",
        inject: {
            fuck() {
                return 1;
            }
        },
        authorization: ['testauth']
        // render: TEMPLATE + '/:method.html',
        //dataType : "json";
    })
], ctrl1);
X_1.V.registerAuthorization(api_1.Connection.HTTP, {
    testauth: function (ctx) {
        ctx.res.redirect("http://www.baidu.com");
        return false;
    }
});
console.log(123);
let GameController = class GameController {
    onConnect(ws, req) {
        console.log(ws, req.url);
        console.log("oh i'm coming");
    }
    onMessage(ws, req, message) {
        console.log("fuck", message);
        ws.send("pong");
    }
};
GameController = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.WebSocket,
        url: "/liaoyang"
    })
], GameController);
var app = express();
var env = nunjucks.configure(TEMPLATE, {
    autoescape: true,
    express: app,
    noCache: true
});
const server = http.createServer(app);
X_1.V.startExpressServer({
    app: app,
    server: server,
    crossDomain: true,
});
server.listen(8080);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFFN0IsNkJBQTRCO0FBRTVCLHFDQUFxQztBQUNyQyxnQ0FBb0Q7QUFJcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFjcEQsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFZLEVBQUUsS0FBVSxFQUFFLElBQVMsRUFBRSxDQUFTO1FBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFBO1FBQ0QsdUNBQXVDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBYTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJO0lBRUosQ0FBQztDQUdKLENBQUE7QUFuQkssS0FBSztJQVpWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsTUFBTSxFQUFFO1lBQ0osSUFBSTtnQkFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztTQUNKO1FBQ0QsYUFBYSxFQUFHLENBQUMsVUFBVSxDQUFDO1FBQzVCLHNDQUFzQztRQUN0QyxvQkFBb0I7S0FDdkIsQ0FBQztHQUNJLEtBQUssQ0FtQlY7QUFFRCxLQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLEVBQUM7SUFDcEMsUUFBUSxFQUFHLFVBQVMsR0FBb0I7UUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSixDQUFDLENBQUE7QUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBTWhCLElBQU0sY0FBYyxHQUFwQjtJQUVJLFNBQVMsQ0FBQyxFQUFPLEVBQUMsR0FBUztRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUyxDQUFDLEVBQWEsRUFBRSxHQUFRLEVBQUUsT0FBZTtRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FHSixDQUFBO0FBYkssY0FBYztJQUpuQixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsU0FBUztRQUMxQixHQUFHLEVBQUUsV0FBVztLQUNuQixDQUFDO0dBQ0ksY0FBYyxDQWFuQjtBQUdELElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBRXBCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQ25DLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osT0FBTyxFQUFFLElBQUk7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV0QyxLQUFDLENBQUMsa0JBQWtCLENBQUM7SUFDakIsR0FBRyxFQUFFLEdBQUc7SUFDUixNQUFNLEVBQUUsTUFBTTtJQUNkLFdBQVcsRUFBRSxJQUFJO0NBQ3BCLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==