import * as express from 'express';
import { V } from '../X';
import { Connection } from '../api';
import * as should from "should";
import * as supertest from "supertest";


@V.Controller({
    type: Connection.HTTP,
    url: '/auth/:method',
    authorization: [
        (ctx) => {
            console.log("Fuck")
            return true;
        }
    ]
})
class test {
    a() {
        return 123;
    }
}


let app = express();
var request = supertest(app);
V.startExpressServer({
    app: app
});

describe('auth', async () => {
    it("pass auth", async () => {
        let ret = await request.get("/auth/a").expect(200);
        ret.text.should.eql('123');
    })
});