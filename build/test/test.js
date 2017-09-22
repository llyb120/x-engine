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
        return 123;
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
    })
], ctrl1);
let GameController = class GameController {
    onConnect() {
    }
    onMessage(ws, req, message) {
        return 'pong';
        // ws.send("pong");
    }
};
GameController = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.WebSocket,
        url: "/liaoyang"
    })
], GameController);
// const server = http.createServer(app);
// X.startExpressServer({
//     app: app,
//     server: server,
//     crossDomain: true
// });
// server.listen(8080);
// console.log('server is listing on 800');
// X.registerController(ctrl1,);
describe('test', () => {
    /**
     * 启动框架
     */
    it("should boot success", (done) => {
        try {
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
            should.exist(msg);
            msg.data.should.eql('pong');
            done();
        };
        client.send("ping");
        // done()
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQW9DO0FBRXBDLGlDQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQWFwRCxJQUFNLEtBQUssR0FBWDtJQUNJLEtBQUssQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQVksRUFBRSxLQUFVLEVBQUUsSUFBUyxFQUFFLENBQVM7UUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUE7UUFDRCx1Q0FBdUM7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFhO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FHSixDQUFBO0FBZEssS0FBSztJQVhWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsTUFBTSxFQUFFO1lBQ0osSUFBSTtnQkFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztTQUNKO0tBR0osQ0FBQztHQUNJLEtBQUssQ0FjVjtBQVFELElBQU0sY0FBYyxHQUFwQjtJQUVJLFNBQVM7SUFDVCxDQUFDO0lBRUQsU0FBUyxDQUFDLEVBQWEsRUFBRSxHQUFRLEVBQUUsT0FBZTtRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2QsbUJBQW1CO0lBQ3ZCLENBQUM7Q0FHSixDQUFBO0FBWEssY0FBYztJQUpuQixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsU0FBUztRQUMxQixHQUFHLEVBQUUsV0FBVztLQUNuQixDQUFDO0dBQ0ksY0FBYyxDQVduQjtBQUtELHlDQUF5QztBQUV6Qyx5QkFBeUI7QUFDekIsZ0JBQWdCO0FBQ2hCLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsTUFBTTtBQUNOLHVCQUF1QjtBQUd2QiwyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDYjs7T0FFRztJQUNILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUk7UUFDM0IsSUFBSSxDQUFDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7WUFDcEIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ25DLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixPQUFPLEVBQUUsR0FBRztnQkFDWixPQUFPLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLEtBQUMsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDakIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLElBQUk7YUFDcEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBR0gsSUFBSSxNQUFpQixDQUFDO0lBRXRCLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLElBQUk7UUFDOUIsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDdkQsVUFBVSxDQUFDO1lBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUVYLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFLENBQUMsSUFBSTtRQUMvQixNQUFNLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRztZQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQTtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsU0FBUztJQUViLENBQUMsQ0FBQyxDQUFBO0FBTU4sQ0FBQyxDQUFDLENBQUMifQ==