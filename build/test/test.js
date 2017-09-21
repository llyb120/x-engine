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
    onConnect() {
    }
};
GameController = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.WebSocket
    })
], GameController);
var app = express();
var env = nunjucks.configure(TEMPLATE, {
    autoescape: true,
    express: app,
    noCache: true
});
// console.log('server is listing on 800');
// X.registerController(ctrl1,);
describe('test', () => {
    /**
     * 启动框架
     */
    it("should boot success", (done) => {
        try {
            const server = http.createServer(app);
            server.listen(8080);
            X_1.V.startExpressServer({
                app: app,
                server: server
            });
            app.all('*', (req, res) => {
                console.log(req);
                console.log("fuck");
            });
            done();
        }
        catch (e) {
            should.not.exist(e);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFFN0IsNkJBQTRCO0FBRTVCLHFDQUFxQztBQUNyQyxnQ0FBb0M7QUFFcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFhcEQsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFZLEVBQUUsS0FBVyxFQUFFLElBQVUsRUFBRSxDQUFTO1FBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTTtTQUNqQixDQUFBO1FBQ0QsdUNBQXVDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBYTtJQUVuQixDQUFDO0NBR0osQ0FBQTtBQWRLLEtBQUs7SUFYVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsSUFBSTtRQUNyQixHQUFHLEVBQUUsb0JBQW9CO1FBQ3pCLE1BQU0sRUFBRTtZQUNKLElBQUk7Z0JBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7U0FDSjtRQUNELE1BQU0sRUFBRSxRQUFRLEdBQUcsZUFBZTtLQUVyQyxDQUFDO0dBQ0ksS0FBSyxDQWNWO0FBUUQsSUFBTSxjQUFjLEdBQXBCO0lBQ0ksU0FBUztJQUVULENBQUM7Q0FHSixDQUFBO0FBTkssY0FBYztJQUhuQixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsU0FBUztLQUM3QixDQUFDO0dBQ0ksY0FBYyxDQU1uQjtBQUdELElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBRXBCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQ25DLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osT0FBTyxFQUFFLElBQUk7Q0FDaEIsQ0FBQyxDQUFDO0FBR0gsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2I7O09BRUc7SUFDSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJO1FBQzNCLElBQUksQ0FBQztZQUNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwQixLQUFDLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxNQUFNO2FBQ2pCLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLENBQUMsR0FBRyxFQUFDLEdBQUc7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdkIsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBSVAsQ0FBQyxDQUFDLENBQUMifQ==