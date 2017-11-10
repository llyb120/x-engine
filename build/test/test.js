"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const X_1 = require("../X");
const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const nunjucks = require("nunjucks");
const should = require("should");
const supertest = require("supertest");
const node_fetch_1 = require("node-fetch");
const _1_1 = require("./hot/1");
const TEMPLATE = path.resolve(__dirname, '../view');
if (typeof describe == 'undefined') {
    global.describe = function () {
    };
}
_1_1.ctrl1;
var app = express();
var request;
// const server = http.createServer(app);
X_1.V.addHotUpdateDir(path.resolve(__dirname, 'hot'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBOEI7QUFFOUIsbUNBQW1DO0FBQ25DLDZCQUE2QjtBQUM3QixnQ0FBK0I7QUFHL0IscUNBQXFDO0FBR3JDLGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFDdkMsMkNBQStCO0FBQy9CLGdDQUFnQztBQUdoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUlwRCxFQUFFLENBQUEsQ0FBQyxPQUFPLFFBQVEsSUFBSSxXQUFXLENBQUMsQ0FBQSxDQUFDO0lBQzlCLE1BQWMsQ0FBQyxRQUFRLEdBQUc7SUFFM0IsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUVELFVBQUssQ0FBQztBQUVOLElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLElBQUksT0FBNkMsQ0FBQztBQUVsRCx5Q0FBeUM7QUFDekMsS0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBRWpELEtBQUMsQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQixZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLElBQUksRUFBRyxDQUFDLE1BQU0sRUFBQyxHQUFhO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDbkMsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLEdBQUc7WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRzlCLENBQUM7SUFDRCxXQUFXLEVBQUUsSUFBSTtJQUNqQixJQUFJLEVB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