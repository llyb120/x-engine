"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const X_1 = require("../X");
const api_1 = require("../api");
const supertest = require("supertest");
let test = class test {
    a() {
        return 123;
    }
};
test = tslib_1.__decorate([
    X_1.V.Controller({
        type: api_1.Connection.HTTP,
        url: '/auth/:method',
        authorization: [
            (ctx) => {
                console.log("Fuck");
                return true;
            }
        ]
    })
], test);
let app = express();
var request = supertest(app);
X_1.V.startExpressServer({
    app: app
});
describe('auth', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    it("pass auth", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let ret = yield request.get("/auth/a").expect(200);
        ret.text.should.eql('123');
    }));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLDRCQUF5QjtBQUN6QixnQ0FBb0M7QUFFcEMsdUNBQXVDO0FBYXZDLElBQU0sSUFBSSxHQUFWO0lBQ0ksQ0FBQztRQUNHLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0osQ0FBQTtBQUpLLElBQUk7SUFWVCxLQUFDLENBQUMsVUFBVSxDQUFDO1FBQ1YsSUFBSSxFQUFFLGdCQUFVLENBQUMsSUFBSTtRQUNyQixHQUFHLEVBQUUsZUFBZTtRQUNwQixhQUFhLEVBQUU7WUFDWCxDQUFDLEdBQUc7Z0JBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1NBQ0o7S0FDSixDQUFDO0dBQ0ksSUFBSSxDQUlUO0FBR0QsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLEtBQUMsQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQixHQUFHLEVBQUUsR0FBRztDQUNYLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDYixFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ1osSUFBSSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQSxDQUFDLENBQUMifQ==