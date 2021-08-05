import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../src/app";
import { createUser, signUpBody } from "../factories/bodyFactory";
import { clearDatabase } from "../utils/database";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await getConnection().close();
});

describe("POST /sign-in", () => {
    it("should answer with status 200 when trying to sign-in", async () => {
        const body = signUpBody();
        await createUser(body.email, body.password);
        const response = await supertest(app).post("/sign-in").send({email: body.email, password: body.password});
        expect(response.status).toBe(200);
    });

    it("should answer with status 400 when trying to sign-in with empty email", async () => {
        const body = signUpBody();
        await createUser(body.email, body.password);
        const response = await supertest(app).post("/sign-in").send({email: "", password: body.password});
        expect(response.status).toBe(400);
    });

    it("should answer with status 400 when trying to sign-in with empty password", async () => {
        const body = signUpBody();
        await createUser(body.email, body.password);
        const response = await supertest(app).post("/sign-in").send({email: body.email, password: ""});
        expect(response.status).toBe(400);
    });

    it("should answer with status 400 when trying to sign-in with unregistered user", async () => {
        const body = signUpBody();
        const response = await supertest(app).post("/sign-in").send({email: body.email, password: body.password});
        expect(response.status).toBe(401);
    });
});