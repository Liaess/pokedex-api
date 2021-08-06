import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../src/app";
import { signUpBody, createNewSession, Pokemon_UserTableCheck } from "../factories/bodyFactory";
import { clearDatabase } from "../utils/database";
import { v4 as uuid } from "uuid";


beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await getConnection().close();
});

describe("POST /pokemons", () => {
    it("should answer with status 200 for valid token", async () => {
      const body = signUpBody();
      const token = await createNewSession(body.email, body.password);
      const response = await supertest(app).get("/pokemons").set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it("should answer with status 200 for valid token and have more than 10 pokemons", async () => {
        const body = signUpBody();
        const token = await createNewSession(body.email, body.password);
        const response = await supertest(app).get("/pokemons").set('Authorization', `Bearer ${token}`);
        expect(response.body.length).toBeGreaterThan(10);
    });

    it("should answer with status 200 for invalid token", async () => {
        const token = uuid();
        const response = await supertest(app).get("/pokemons").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
    });
});

describe("POST /pokemons/:id/add", () => {
    it("should answer with status 200 for valid token", async () => {
        const body = signUpBody();
        const token = await createNewSession(body.email, body.password);
        const checkingBefore = await Pokemon_UserTableCheck();
        const response = await supertest(app).post("/my-pokemons/1/add").set('Authorization', `Bearer ${token}`);
        const checkingAfter = await Pokemon_UserTableCheck();
        expect(response.status).toBe(200);
        expect(checkingBefore.length).toEqual(0);
        expect(checkingAfter.length).toEqual(1)
    });

    it("should answer with status 401 for invalid token", async () => {
        const token = uuid();
        const response = await supertest(app).post("/my-pokemons/1/add").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
    });
    
    it("should answer with status 401 when trying to add same pokemon at user pokemon list", async () => {
        const body = signUpBody();
        const token = await createNewSession(body.email, body.password);
        await supertest(app).post("/my-pokemons/1/add").set('Authorization', `Bearer ${token}`);
        const checkingAfter = await Pokemon_UserTableCheck();
        const secondAdd = await supertest(app).post("/my-pokemons/1/add").set('Authorization', `Bearer ${token}`);
        expect(secondAdd.status).toEqual(401);
        expect(checkingAfter.length).toEqual(1)
    });
});

describe("POST /pokemons/:id/remove", () => {
    it("should answer with status 200 for valid token", async () => {
        const body = signUpBody();
        const token = await createNewSession(body.email, body.password);
        await supertest(app).post("/my-pokemons/1/add").set('Authorization', `Bearer ${token}`);
        const checkingBefore = await Pokemon_UserTableCheck();
        const response = await supertest(app).post("/my-pokemons/1/remove").set('Authorization', `Bearer ${token}`);
        const checkingAfter = await Pokemon_UserTableCheck();
        expect(response.status).toBe(200);
        expect(checkingBefore.length).toEqual(1);
        expect(checkingAfter.length).toEqual(0)
    });

    it("should answer with status 401 for invalid token", async () => {
        const token = uuid();
        const response = await supertest(app).post("/my-pokemons/1/remove").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
    });

    it("should answer with status 401 when trying to delete pokemon from user pokemon list", async () => {
        const body = signUpBody();
        const token = await createNewSession(body.email, body.password);
        const response = await supertest(app).post("/my-pokemons/1/remove").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
    });
});