import request from "supertest";
import { app } from "../../src/app";
import { mysqlPool } from "../../src/config/dbConnection";
import { redisClient } from "../../src/config/redis";

describe("🧪 Shipment Endpoints (E2E)", () => {
  let createdShipmentId: string;
  let token: string;

  beforeAll(async () => {
    const ioMock = { emit: jest.fn() };
    app.set("io", ioMock);
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "user1@example.com",
      password: "12345678",
    });


    token = res.body.data.token;
  });

  afterAll(async () => {
    // Aquí podrías limpiar la base de datos o cerrar conexiones si es necesario
    await mysqlPool.end();
    await redisClient.quit();
  });

  it("POST /api/v1/shipments → debería crear un nuevo envío", async () => {
    const res = await request(app)
      .post("/api/v1/shipments/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: "1",
        origin_zip: "110111",
        destination_zip: "050021",
        weight: 5,
        length: 30,
        width: 30,
        height: 30,
        total_cost: 12000.0,
        status: "pending",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Shipment created successfully");

    createdShipmentId = res.body.data.shipment_id;
  });

  it("POST /api/v1/shipments/quote → debería devolver una cotización válida", async () => {
    const res = await request(app)
      .post("/api/v1/shipments/quote")
      .set("Authorization", `Bearer ${token}`)
      .send({
        originZip: "110111",
        destinationZip: "050021",
        weight: 10,
        length: 40,
        width: 30,
        height: 20,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Shipment quote retrieved successfully");
  });

  it("PATCH /api/v1/shipments/update/:id → debería actualizar el estado del envío", async () => {
    const res = await request(app)
      .patch(`/api/v1/shipments/update/${createdShipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "in_transit" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Estado actualizado correctamente");
  });

  it("PATCH /api/v1/shipments/:id/status → debería fallar si el envío no existe", async () => {
    const res = await request(app)
      .patch("/api/v1/shipments/update/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "entregado" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Shipment not found or update failed");
  });

  it("GET /api/v1/shipments → debería devolver los envíos del usuario", async () => {
    const res = await request(app)
      .get("/api/v1/shipments")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: "1" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Shipments retrieved successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
