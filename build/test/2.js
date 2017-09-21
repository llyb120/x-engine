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
        render: TEMPLATE + '/:method.html',
    })
], ctrl1);
let GameController = class GameController {
    onConnect(ws) {
        console.log(ws);
        console.log("oh i'm coming");
    }
    onMessage(ws, req, message) {
        console.log("fuck");
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
    crossDomain: true
});
server.listen(8080);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFFN0IsNkJBQTRCO0FBRTVCLHFDQUFxQztBQUNyQyxnQ0FBb0M7QUFJcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFhcEQsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFZLEVBQUUsS0FBVyxFQUFFLElBQVUsRUFBRSxDQUFTO1FBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFBO1FBQ0QsdUNBQXVDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBYTtJQUVuQixDQUFDO0NBR0osQ0FBQTtBQWRLLEtBQUs7SUFYVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsSUFBSTtRQUNyQixHQUFHLEVBQUUsb0JBQW9CO1FBQ3pCLE1BQU0sRUFBRTtZQUNKLElBQUk7Z0JBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7U0FDSjtRQUNELE1BQU0sRUFBRSxRQUFRLEdBQUcsZUFBZTtLQUVyQyxDQUFDO0dBQ0ksS0FBSyxDQWNWO0FBT0QsSUFBTSxjQUFjLEdBQXBCO0lBRUksU0FBUyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUyxDQUFDLEVBQWMsRUFBQyxHQUFTLEVBQUUsT0FBZ0I7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FHSixDQUFBO0FBYkssY0FBYztJQUpuQixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsU0FBUztRQUMxQixHQUFHLEVBQUcsV0FBVztLQUNwQixDQUFDO0dBQ0ksY0FBYyxDQWFuQjtBQUdELElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBRXBCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQ25DLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osT0FBTyxFQUFFLElBQUk7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUUxQixLQUFDLENBQUMsa0JBQWtCLENBQUM7SUFDakIsR0FBRyxFQUFFLEdBQUc7SUFDUixNQUFNLEVBQUUsTUFBTTtJQUNkLFdBQVcsRUFBRyxJQUFJO0NBQ3JCLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==