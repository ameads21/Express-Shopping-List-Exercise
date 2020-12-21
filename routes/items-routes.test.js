process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app")
const items = require("../fakeDb")

let chocolate = {name: "Chocolate", price: 1.99}

beforeEach(function(){
    items.push(chocolate)
});

afterEach(function(){
    items.length = 0;
})

describe("GET /items", () => {
    test("Get all items", async() => {
        const res = await request(app).get("/items")
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items: [{"name":"popsicle","price":1.45},{"name":"cherrios","price":3.4}, chocolate]})
    })
})

describe("GET /items/:name", () => {
    test("Get certain item", async() => {
        const res = await request(app).get(`/items/${chocolate.name}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"name": chocolate.name, "price": chocolate.price})
    })

    test("Non existing item", async() => {
        const res = await request(app).get(`/items/notasnack`)
        expect(res.statusCode).toBe(404);
    })
})


describe("POST /items", () => {
    test("Create item", async() => {
        const res = await request(app).post(`/items`).send({name: "popcorn", price:1.25})
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added: {"name": "popcorn", "price": 1.25}})
    })

    test("Missing Name", async() => {
        const res = await request(app).post(`/items`).send({ price:1.25})
        expect(res.statusCode).toBe(400);
    })

    test("Missing price", async() => {
        const res = await request(app).post(`/items`).send({name: "popcorn"})
        expect(res.statusCode).toBe(400);
    })
})


describe("PATCH /items:name", () => {
    test("Update item", async() => {
        const res = await request(app)
            .patch(`/items/${chocolate.name}`)
            .send({name: "Peanut Butter"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated: {name: "Peanut Butter", price: chocolate.price}})
    })

    test("Responding with 404 for invalid item", async() => {
        const res = await request(app)
            .patch(`/items/notvalidsnack`)
            .send({name: "Peanut Butter"})
        expect(res.statusCode).toBe(404)
    })
})

describe("DELETE /items:name", () => {
    test("Deleting a snack", async() => {
        const res = await request(app).delete(`/items/${chocolate.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"})
    })

    test("Responding with 404 for invalid item", async() => {
        const res = await request(app).delete(`/items/notvalidsnack`);
        expect(res.statusCode).toBe(404);
    })
})