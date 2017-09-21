"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const X_1 = require("../X");
const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const http = require("http");
const nunjucks = require("nunjucks");
const api_1 = require("../api");
const should = require("should");
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
    onConnect() {
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
throw new Error();
// console.log('server is listing on 800');
// X.registerController(ctrl1,);
describe('test', () => {
    /**
     * 启动框架
     */
    it("should boot success", (done) => {
        try {
            const server = http.createServer(app);
            X_1.V.startExpressServer({
                app: app,
                server: server,
                crossDomain: true
            });
            server.listen(8080);
            done();
        }
        catch (e) {
            should.not.exist(e);
        }
    });
    let client;
    it("should connect success", (done) => {
        client = new WebSocket("ws://127.0.0.1:8080/liaoyang");
        setTimeout(() => {
            should.exist(client.readyState);
            client.readyState.should.eql(WebSocket.OPEN);
            done();
        }, 500);
    });
    it("should get some message", (done) => {
        client.onmessage = function (msg) {
            msg.should.eql("pone");
            done();
        };
        client.send("ping");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQW9DO0FBRXBDLGlDQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQWFwRCxJQUFNLEtBQUssR0FBWDtJQUNJLEtBQUssQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQVksRUFBRSxLQUFXLEVBQUUsSUFBVSxFQUFFLENBQVM7UUFDL0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUE7UUFDRCx1Q0FBdUM7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFhO0lBRW5CLENBQUM7Q0FHSixDQUFBO0FBZEssS0FBSztJQVhWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsTUFBTSxFQUFFO1lBQ0osSUFBSTtnQkFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztTQUNKO1FBQ0QsTUFBTSxFQUFFLFFBQVEsR0FBRyxlQUFlO0tBRXJDLENBQUM7R0FDSSxLQUFLLENBY1Y7QUFTRCxJQUFNLGNBQWMsR0FBcEI7SUFFSSxTQUFTO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUyxDQUFDLEVBQWMsRUFBQyxHQUFTLEVBQUUsT0FBZ0I7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FB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