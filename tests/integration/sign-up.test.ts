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

describe("POST /sign-up", () => {
  it("should answer with status 201 when trying to sign-up", async () => {
    const body = signUpBody();
    const response = await supertest(app).post("/sign-up").send({email: body.email, password: body.password, confirmPassword: body.password});
    expect(response.status).toBe(201);
  });

  it("should answer with status 400 when trying to sign-up with conflict on password and confirmPassword", async () => {
    const body = signUpBody();
    const anotherBody = signUpBody();
    const response = await supertest(app).post("/sign-up").send({email: body.email, password: body.password, confirmPassword: anotherBody.password});
    expect(response.status).toBe(400);
  });

  it("should answer with status 400 when trying to sign-up with empty email", async () => {
    const body = signUpBody();
    const anotherBody = signUpBody();
    const response = await supertest(app).post("/sign-up").send({email: "", password: body.password, confirmPassword: anotherBody.password});
    expect(response.status).toBe(400);
  });

  it("should answer with status 400 when trying to sign-up with empty password", async () => {
    const body = signUpBody();
    const anotherBody = signUpBody();
    const response = await supertest(app).post("/sign-up").send({email: body.email, password: "", confirmPassword: anotherBody.password});
    expect(response.status).toBe(400);
  });

  it("should answer with status 400 when trying to sign-up with empty confirmpassoword", async () => {
    const body = signUpBody();
    const response = await supertest(app).post("/sign-up").send({email: body.email, password: body.password, confirmPassword: ""});
    expect(response.status).toBe(400);
  });

  it("should answer with status 409 when trying to sign-up with email already registered", async () => {
    const body = signUpBody();
    await createUser(body.email, body.password);
    const response = await supertest(app).post("/sign-up").send({email: body.email, password: body.password, confirmPassword: body.password});
    expect(response.status).toBe(409);
  });
});