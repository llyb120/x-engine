"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const X_1 = require("../X");
const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const nunjucks = require("nunjucks");
const api_1 = require("../api");
const should = require("should");
const supertest = require("supertest");
const node_fetch_1 = require("node-fetch");
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
        url: "/auth/:method",
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
var request;
// const server = http.createServer(app);
X_1.V.startExpressServer({
    // app: app,
    // server: server,
    init: (server, app) => {
        console.log("before start");
        var env = nunjucks.configure(TEMPLATE, {
            autoescape: true,
            express: app,
            noCache: true
        });
        request = supertest(app);
    },
    crossDomain: true,
    port: 8080
});
// server.listen(8080);
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
    let url = 'http://127.0.0.1:8080';
    it("should get common", async () => {
        let result = await node_fetch_1.default('http://127.0.0.1:8080/test/test1.html');
        const json = JSON.parse(await result.text());
        should.exist(json.cubi);
    });
    //测试http请求
    it("should access success", async () => {
        let ret = await node_fetch_1.default(`${url}/test/test2.html`);
        let txt = await ret.text();
        should.exist(txt);
        txt.should.eql("123");
    });
    // /**
    //  * 测试不通过，被重定向
    //  */
    it("test auth", (done) => {
        done();
        // let ret = await fetch(`${url}/auth/test`);
        // console.log(ret.status);
        // request.get("/auth/test")
        //     .expect(302)
        //     .end((err, res) => {
        //         should.exist(err);
        //         // should.not.exist(err);
        //         done();
        //     });
    });
    // //已经登录的情况，保留user
    it("test logined", async () => {
        try {
            const res = await request.get("/auth/login").expect(200);
            res.text.should.be.eql('1');
        }
        catch (e) {
            should.not.exist(e);
        }
    });
    it("test index", async () => {
        try {
            const res = await request.get('/').expect(200);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsZ0NBQStCO0FBRy9CLHFDQUFxQztBQUNyQyxnQ0FBZ0U7QUFFaEUsaUNBQWlDO0FBQ2pDLHVDQUF1QztBQUN2QywyQ0FBK0I7QUFHL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFJcEQsRUFBRSxDQUFBLENBQUMsT0FBTyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUEsQ0FBQztJQUM5QixNQUFjLENBQUMsUUFBUSxHQUFHO0lBRTNCLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFrQkQsSUFBTSxLQUFLLEdBQVg7SUFHSSxLQUFLLENBQUMsR0FBYTtRQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0NBR0osQ0FBQTtBQVJLLEtBQUs7SUFoQlYsS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRSxnQkFBVSxDQUFDLElBQUk7UUFDckIsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixNQUFNLEVBQUU7WUFDSixJQUFJO2dCQUNBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1NBQ0o7UUFDRCxNQUFNLEVBQUc7WUFDTCxNQUFNLENBQUM7Z0JBQ0gsSUFBSSxFQUFHLENBQUM7YUFDWCxDQUFBO1FBQ0wsQ0FBQztRQUNELHNDQUFzQztRQUN0QyxvQkFBb0I7S0FDdkIsQ0FBQztHQUNJLEtBQUssQ0FRVjtBQVlELElBQU0sT0FBTyxHQUFiO0lBQ0ksS0FBSyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBWSxFQUFFLEtBQVUsRUFBRSxJQUFTLEVBQUUsQ0FBUztRQUM3RSxNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFB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