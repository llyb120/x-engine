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
const supertest = require("supertest");
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
let ctrl2 = class ctrl2 {
    test(res) {
    }
};
ctrl2 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/auth/:method.html",
        authorization: ['testauth']
    })
], ctrl2);
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
X_1.V.registerAuthorization(api_1.Connection.HTTP, {
    testauth: function (ctx) {
        ctx.res.redirect("http://www.baidu.com");
        return false;
    }
});
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
    var app = express();
    var request = supertest(app);
    /**
     * 启动框架
     */
    it("should boot success", (done) => {
        try {
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
    //测试http请求
    it("should access success", (done) => {
        request.get("/test/test2.html")
            .expect(200)
            .end((err, res) => {
            should.not.exist(err);
            res.text.should.be.eql('123');
            done();
        });
    });
    it("test auth", (done) => {
        request.get("/auth/test")
            .expect(200)
            .end((err, res) => {
            console.log(err);
            done();
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQWdFO0FBRWhFLGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFHdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFlcEQsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFZLEVBQUUsS0FBVSxFQUFFLElBQVMsRUFBRSxDQUFTO1FBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFBO1FBQ0QsdUNBQXVDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBYTtRQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0NBR0osQ0FBQTtBQWRLLEtBQUs7SUFYVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsSUFBSTtRQUNyQixHQUFHLEVBQUUsb0JBQW9CO1FBQ3pCLE1BQU0sRUFBRTtZQUNKLElBQUk7Z0JBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7U0FDSjtLQUdKLENBQUM7R0FDSSxLQUFLLENBY1Y7QUFPRCxJQUFNLEtBQUssR0FBWDtJQUNJLElBQUksQ0FBQyxHQUFjO0lBRW5CLENBQUM7Q0FDSixDQUFBO0FBSkssS0FBSztJQUxWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUcsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3RCLEdBQUcsRUFBRyxvQkFBb0I7UUFDMUIsYUFBYSxFQUFHLENBQUMsVUFBVSxDQUFDO0tBQy9CLENBQUM7R0FDSSxLQUFLLENBSVY7QUFRRCxJQUFNLGNBQWMsR0FBcEI7SUFFSSxTQUFTO0lBQ1QsQ0FBQztJQUVELFNBQVMsQ0FBQyxFQUFhLEVBQUUsR0FBUSxFQUFFLE9BQWU7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNkLG1CQUFtQjtJQUN2QixDQUFDO0NBR0osQ0FBQTtBQVhLLGNBQWM7SUFKbkIsS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRSxnQkFBVSxDQUFDLFNBQVM7UUFDMUIsR0FBRyxFQUFFLFdBQVc7S0FDbkIsQ0FBQztHQUNJLGNBQWMsQ0FXbkI7QUFHRCxLQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLEVBQUM7SUFDcEMsUUFBUSxFQUFHLFVBQVMsR0FBb0I7UUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSixDQUFDLENBQUE7QUFLRix5Q0FBeUM7QUFFekMseUJBQXlCO0FBQ3pCLGdCQUFnQjtBQUNoQixzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLE1BQU07QUFDTix1QkFBdUI7QUFHdkIsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2IsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTdCOztPQUVHO0lBQ0gsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSTtRQUMzQixJQUFJLENBQUM7WUFDRCxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLE9BQU8sRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdEMsS0FBQyxDQUFDLGtCQUFrQixDQUFDO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixNQUFNLEVBQUUsTUFBTTtnQkFDZCxXQUFXLEVBQUUsSUFBSTthQUNwQixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLElBQUksRUFBRSxDQUFDO1FBRVgsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxVQUFVO0lBQ1YsRUFBRSxDQUFDLHVCQUF1QixFQUFFLENBQUMsSUFBSTtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO2FBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRztZQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQTtJQUNWLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLFdBQVcsRUFBQyxDQUFDLElBQUk7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNoQixJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUE7SUFHRixJQUFJLE1BQWlCLENBQUM7SUFFdEIsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsSUFBSTtRQUM5QixNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUN2RCxVQUFVLENBQUM7WUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRVgsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxJQUFJO1FBQy9CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBVSxHQUFHO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQyxDQUFBO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixTQUFTO0lBRWIsQ0FBQyxDQUFDLENBQUE7QUFNTixDQUFDLENBQUMsQ0FBQyJ9