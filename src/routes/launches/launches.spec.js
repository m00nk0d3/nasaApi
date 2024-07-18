const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Testing API", () => {
    beforeAll(async () => {
        await mongoConnect();
    })
    afterAll(async () => {
        await mongoDisconnect();
    })

    describe("Testing GET /launches", () => {

        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/launches")
            expect(response.statusCode).toEqual(200)
        });
    })
    describe("Testing POST /launches", () => {
        const completeLauchData = {
            mission: "Kepler Exploration X",
            rocket: "Explorer IS1",
            target: "Kepler-442 b",
            launchDate: "January 4, 2028",
        }
        const launchDataWithoutDate = {
            mission: "Kepler Exploration X",
            rocket: "Explorer IS1",
            target: "Kepler-442 b",
        }
        const launchDataWithInvalidDate = {
            mission: "Kepler Exploration X",
            rocket: "Explorer IS1",
            target: "Kepler-442 b",
            launchDate: "hello",
        }
        test("It should respond with 201 created", async () => {
            const response = await request(app)
                .post("/launches")
                .send(completeLauchData)
            const requestDate = new Date(completeLauchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(response.statusCode).toBe(201)
            expect(requestDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        });

        test("It should catch missing required properties", async () => {
            const response = await request(app)
                .post("/launches")
                .send(launchDataWithoutDate)
            expect(response.body).toStrictEqual({ error: "Missing required launch property" })
        })

        test("It should catch invalid dates", async () => {
            const response = await request(app)
                .post("/launches")
                .send(launchDataWithInvalidDate)
            expect(response.body).toStrictEqual({ error: "Invalid launch date" })
        })
    })
})