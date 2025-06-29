import { GetShipment } from "../GetShipments";
import { Shipment } from "../../../domain/entities/Shipment";

describe("GetShipment", () => {
  const mockShipments: Shipment[] = [
    {
      user_id: "user1",
      origin_zip: "11111",
      destination_zip: "22222",
      weight: 2.5,
      length: 10,
      width: 5,
      height: 3,
      total_cost: 100.0,
      status: "delivered",
    },
    {
      user_id: "user1",
      origin_zip: "11111",
      destination_zip: "33333",
      weight: 3.0,
      length: 12,
      width: 6,
      height: 4,
      total_cost: 120.0,
      status: "pending",
    },
  ];

  const shipmentRepository = {
    getShipments: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if userId is not provided", async () => {
    const getShipment = new GetShipment(shipmentRepository as any);
    await expect(getShipment.execute("")).rejects.toThrow(
      "ID de usuario no proporcionado"
    );
    await expect(getShipment.execute(undefined as any)).rejects.toThrow(
      "ID de usuario no proporcionado"
    );
  });

  it("should call shipmentRepository.getShipments with the correct userId", async () => {
    shipmentRepository.getShipments.mockResolvedValueOnce(mockShipments);
    const getShipment = new GetShipment(shipmentRepository as any);

    await getShipment.execute("user1");

    expect(shipmentRepository.getShipments).toHaveBeenCalledWith("user1");
  });

  it("should return shipments from the repository", async () => {
    shipmentRepository.getShipments.mockResolvedValueOnce(mockShipments);
    const getShipment = new GetShipment(shipmentRepository as any);

    const result = await getShipment.execute("user1");

    expect(result).toEqual(mockShipments);
  });

  it("should return an empty array if repository returns no shipments", async () => {
    shipmentRepository.getShipments.mockResolvedValueOnce([]);
    const getShipment = new GetShipment(shipmentRepository as any);

    const result = await getShipment.execute("user2");

    expect(result).toEqual([]);
  });
});
