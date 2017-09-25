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
        console.log(123);
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
        }, 50);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQWdFO0FBRWhFLGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFHdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFJcEQsRUFBRSxDQUFBLENBQUMsT0FBTyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUEsQ0FBQztJQUM5QixNQUFjLENBQUMsUUFBUSxHQUFHO0lBRTNCLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFhRCxJQUFNLEtBQUssR0FBWDtJQUNJLEtBQUssQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQVksRUFBRSxLQUFVLEVBQUUsSUFBUyxFQUFFLENBQVM7UUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUE7UUFDRCx1Q0FBdUM7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFhO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FHSixDQUFBO0FBZEssS0FBSztJQVhWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsTUFBTSxFQUFFO1lBQ0osSUFBSTtnQkFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztTQUNKO0tBR0osQ0FBQztHQUNJLEtBQUssQ0FjVjtBQU9ELElBQU0sS0FBSyxHQUFYO0lBQ0ksSUFBSSxDQUFD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