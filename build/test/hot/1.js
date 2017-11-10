"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const X_1 = require("../../X");
const api_1 = require("../../api");
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
exports.ctrl1 = ctrl1;
let ctrl110 = class ctrl110 {
    test1(req, res, fuck, query, body, c) {
        return {
            guichu: 1233214
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
console.log("i'm load  3!4");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0L2hvdC8xLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQVFqQyxtQ0FBbUU7QUF1Qm5FLElBQWEsS0FBSyxHQUFsQjtJQUdJLEtBQUssQ0FBQyxHQUFhO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FHSixDQUFBO0FBUlksS0FBSztJQWhCakIsS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRSxnQkFBVSxDQUFDLElBQUk7UUFDckIsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixNQUFNLEVBQUU7WUFDSixJQUFJO2dCQUNBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1NBQ0o7UUFDRCxNQUFNLEVBQUc7WUFDTCxNQUFNLENBQUM7Z0JBQ0gsSUFBSSxFQUFHLENBQUM7YUFDWCxDQUFBO1FBQ0wsQ0FBQztRQUNELHNDQUFzQztRQUN0QyxvQkFBb0I7S0FDdkIsQ0FBQztHQUNXLEtBQUssQ0FRakI7QUFSWSxzQkFBSztBQW9CbEIsSUFBTSxPQUFPLEdBQWI7SUFDSSxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFZLEVBQUUsS0FBVSxFQUFFLElBQVMsRUFBRSxDQUFTO1FBQzdFLE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxPQUFPO1NBQ2xCLENBQUE7UUFDRCx1Q0FBdUM7SUFDM0MsQ0FBQztDQUNKLENBQUE7QUFQSyxPQUFPO0lBVlosS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRyxnQkFBVSxDQUFDLElBQUk7UUFDdEIsR0FBRyxFQUFHLG9CQUFvQjtRQUMxQixNQUFNLEVBQUc7WUFDTCxNQUFNLENBQUM7Z0JBQ0gsSUFBSSxFQUFHLENBQUM7YUFDWCxDQUFBO1FBQ0wsQ0FBQztRQUNELFFBQVEsRUFBRyxNQUFNO0tBQ3BCLENBQUM7R0FDSSxPQUFPLENBT1o7QUFPRCxJQUFNLEtBQUssR0FBWDtJQUNJLElBQUksQ0FBQyxHQUFhO0lBRWxCLENBQUM7Q0FDSixDQUFBO0FBSkssS0FBSztJQUxWLEtBQUMsQ0FBQyxVQUFVLENBQUM7UUFDVixJQUFJLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJO1FBQ3JCLEdBQUcsRUFBRSxlQUFlO1FBQ3BCLGFBQWEsRUFBRSxDQUFDLFVBQVUsQ0FBQztLQUM5QixDQUFDO0dBQ0ksS0FBSyxDQUlWO0FBT0QsSUFBTSxLQUFLLEdBQVg7SUFDSSxLQUFLLENBQUMsSUFBUztRQUNYLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0osQ0FBQTtBQUpLLEtBQUs7SUFMVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsSUFBSTtRQUNyQixHQUFHLEVBQUUsZUFBZTtRQUNwQixhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDM0IsQ0FBQztHQUNJLEtBQUssQ0FJVjtBQVFELElBQU0sS0FBSyxHQUFYO0lBQ0ksS0FBSztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0NBQ0osQ0FBQTtBQUpLLEtBQUs7SUFKVixLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFHLGdCQUFVLENBQUMsSUFBSTtRQUN0QixHQUFHLEVBQUcsR0FBRztLQUNaLENBQUM7R0FDSSxLQUFLLENBSVY7QUFPRCxJQUFNLGNBQWMsR0FBcEI7SUFFSSxTQUFTO0lBQ1QsQ0FBQztJQUVELFNBQVMsQ0FBQyxFQUFhLEVBQUUsR0FBUSxFQUFFLE9BQWU7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNkLG1CQUFtQjtJQUN2QixDQUFDO0NBR0osQ0FBQTtBQVhLLGNBQWM7SUFKbkIsS0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNWLElBQUksRUFBRSxnQkFBVSxDQUFDLFNBQVM7UUFDMUIsR0FBRyxFQUFFLFdBQVc7S0FDbkIsQ0FBQztHQUNJLGNBQWMsQ0FXbkI7QUFHRCxLQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLEVBQUU7SUFDckMsUUFBUSxFQUFFLFVBQVUsR0FBbUI7UUFDbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxLQUFLLEVBQUUsVUFBVSxHQUF5QjtRQUN0QyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUVKLENBQUMsQ0FBQTtBQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUEifQ==