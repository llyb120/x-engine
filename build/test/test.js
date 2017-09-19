"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const X_1 = require("../X");
const express = require("express");
const path = require("path");
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
        url: "/test/:method.html",
        inject: {
            fuck() {
                return 1;
            }
        },
        render: TEMPLATE + '/:method.html',
    })
], ctrl1);
const nunjucks = require("nunjucks");
var app = express();
app.listen(800);
var env = nunjucks.configure(TEMPLATE, {
    autoescape: true,
    express: app,
    noCache: true
});
console.log('server is listing on 800');
// X.registerController(ctrl1,);
X_1.V.startExpressServer(app);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQThCO0FBRTlCLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLENBQUM7QUFZbkQsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsR0FBYSxFQUFDLEdBQWMsRUFBQyxJQUFhLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxDQUFVO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUcsTUFBTTtTQUNsQixDQUFBO1FBQ0QsdUNBQXVDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBYztJQUVwQixDQUFDO0NBR0osQ0FBQTtBQWRLLEtBQUs7SUFWVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsR0FBRyxFQUFHLG9CQUFvQjtRQUMxQixNQUFNLEVBQUc7WUFDTCxJQUFJO2dCQUNBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1NBQ0o7UUFDRCxNQUFNLEVBQUcsUUFBUSxHQUFHLGVBQWU7S0FFdEMsQ0FBQztHQUNJLEtBQUssQ0FjVjtBQUVELHFDQUFxQztBQUVyQyxJQUFJLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRWhCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQ25DLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxHQUFHO0lBQ1osT0FBTyxFQUFFLElBQUk7Q0FDaEIsQ0FBQyxDQUFDO0FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hDLGdDQUFnQztBQUVoQyxLQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMifQ==