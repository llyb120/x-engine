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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBQy9CLDZCQUE0QjtBQUU1QixxQ0FBcUM7QUFDckMsZ0NBQWdFO0FBRWhFLGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFHdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFJcEQsRUFBRSxDQUFBLENBQUMsT0FBTyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUEsQ0FBQztJQUM5QixNQUFjLENBQUMsUUFBUSxHQUFHO0lBRTNCLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFhRCxJQUFNLEtBQUssR0FBWDtJQUNJLEtBQUssQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQVksRUFBRSxLQUFVLEVBQUUsSUFBUyxFQUFFLENBQVM7UUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUE7UUFDRCx1Q0FBdUM7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFhO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FHSixDQUFBO0FBZEssS0FBSztJQVhWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxvQkFBb0I7UUFDekIsTUFBTSxFQUFFO1lBQ0osSUFBSTtnQkFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztTQUNKO0tBR0osQ0FBQztHQUNJLEtBQUssQ0FjVjtBQU9ELElBQU0sS0FBSyxHQUFYO0lBQ0ksSUFBSSxDQUFD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