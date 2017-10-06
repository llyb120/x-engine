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
if (typeof describe == 'undefined') {
    global.describe = function () {
    };
}
let ctrl1 = class ctrl1 {
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
        common: () => {
            return {
                cubi: 2
            };
        }
        // render: TEMPLATE + '/:method.html',
        //dataType : "json";
    })
], ctrl1);
let ctrl110 = class ctrl110 {
    test1(req, res, fuck, query, body, c) {
        return {
            guichu: 123321
        };
        // res.redirect("http://www.baidu.com")
    }
};
ctrl110 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/test/:method.html",
        common: () => {
            return {
                cubi: 2
            };
        },
        dataType: "json"
    })
], ctrl110);
let ctrl2 = class ctrl2 {
    test(res) {
    }
};
ctrl2 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/auth/:method.html",
        authorization: ['notlogin']
    })
], ctrl2);
let ctrl3 = class ctrl3 {
    login(user) {
        return user ? 1 : 0;
    }
};
ctrl3 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/auth/:method",
        authorization: ['login']
    })
], ctrl3);
let ctrl4 = class ctrl4 {
    index() {
        return 1;
    }
};
ctrl4 = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: "/",
    })
], ctrl4);
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
    notlogin: function (ctx) {
        ctx.res.redirect("http://www.baidu.com");
        return false;
    },
    login: function (ctx) {
        ctx.user = {};
        return true;
    }
});
var app = express();
var request = supertest(app);
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
    it("should get common", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let result = yield request.get('/test/test1.html').expect(200);
        const json = JSON.parse(result.text);
        should.exist(json.cubi);
    }));
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
    /**
     * 测试不通过，被重定向
     */
    it("test auth", (done) => {
        request.get("/auth/test")
            .expect(302)
            .end((err, res) => {
            should.exist(err);
            // should.not.exist(err);
            done();
        });
    });
    //已经登录的情况，保留user
    it("test logined", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield request.get("/auth/login").expect(200);
            res.text.should.be.eql('1');
        }
        catch (e) {
            should.not.exist(e);
        }
    }));
    it("test index", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield request.get('/').expect(200);
        }
        catch (e) {
            should.not.exist(e);
        }
    }));
    let client;
    it("should connect success", (done) => {
        client = new WebSocket("ws://127.0.0.1:8080/liaoyang");
        setTimeout(() => {
            should.exist(client.readyState);
            client.readyState.should.eql(WebSocket.OPEN);
            done();
        }, 10);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQWdFO0FBRWhFLGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFHdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFJcEQsRUFBRSxDQUFBLENBQUMsT0FBTyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUEsQ0FBQztJQUM5QixNQUFjLENBQUMsUUFBUSxHQUFHO0lBRTNCLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFrQkQsSUFBTSxLQUFLLEdBQVg7SUFHSSxLQUFLLENBQUMsR0FBYTtRQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0NBR0osQ0FBQTtBQVJLLEtBQUs7SUFoQlYsS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRSxnQkFBVSxDQUFDLElBQUk7UUFDckIsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixNQUFNLEVBQUU7WUFDSixJQUFJO2dCQUNBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1NBQ0o7UUFDRCxNQUFNLEVBQUc7WUFDTCxNQUFNLENBQUM7Z0JBQ0gsSUFBSSxFQUFHLENBQUM7YUFDWCxDQUFBO1FBQ0wsQ0FBQztRQUNELHNDQUFzQztRQUN0QyxvQkFBb0I7S0FDdkIsQ0FBQztHQUNJLEtBQUssQ0FRVjtBQVlELElBQU0sT0FBTyxHQUFiO0lBQ0ksS0FBSyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBWSxFQUFFLEtBQVUsRUFBRSxJQUFTLEVBQUUsQ0FBUztRQUM3RSxNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFB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