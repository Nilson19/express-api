import request from "supertest";
import { app } from "../../src/app";
import { mysqlPool } from "../../src/config/dbConnection";

describe("🧪 Auth Endpoints (E2E)", () => {

  afterAll(async () => {
    // Aquí podrías limpiar la base de datos o cerrar conexiones si es necesario
    await mysqlPool.end();
  });

  it("POST /api/v1/auth/register → debería registrar un nuevo usuario", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test12@example.com",
        password: "12345678",
        name: "E2E",
        last_name: "Tester",
        phone: "0000000000",
        addresses: [
          {
            street: "Calle Falsa 123",
            city: "Bogotá",
            state: "Cundinamarca",
            zip_code: "110111",
            country: "Colombia",
            is_default: true,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("POST /api/v1/auth/register → debería fallar si falta el email", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      password: "12345678",
      name: "E2E",
      last_name: "Tester",
      phone: "0000000000",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/^Error al buscar el usuario por email/);
  });

  it("POST /api/v1/auth/register → debería fallar si el email ya está en uso", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test12@example.com", // el ya registrado antes
      password: "12345678",
      name: "E2E",
      last_name: "Tester",
      phone: "0000000000",
      addresses: [],
    });

    expect(res.status).toBe(409); // o 400 dependiendo cómo manejes duplicados
    expect(res.body.name).toBe("ConflictError");
  });

  it("POST /api/v1/auth/login → debería hacer login y devolver un token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test12@example.com",
      password: "12345678",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });

  it("POST /api/v1/auth/login → debería fallar con contraseña incorrecta", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test12@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Usuario o contraseña inválidos");
  });

  it("POST /api/v1/auth/login → debería fallar si el usuario no existe", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "notfound@example.com",
      password: "12345678",
    });

    expect(res.status).toBe(401); // o 404 según la implementación
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Email inválido");
  });
});
