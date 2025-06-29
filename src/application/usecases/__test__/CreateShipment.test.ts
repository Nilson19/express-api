import { CreateShipment } from "../CreateShipment";
import { Shipment } from "../../../domain/entities/Shipment";
import { IShipmentRepository } from "../../../domain/repositories/IShipmenRepository";

describe("CreateShipment", () => {
    let shipmentRepository: jest.Mocked<IShipmentRepository>;
    let createShipment: CreateShipment;

    beforeEach(() => {
        shipmentRepository = {
            createShipment: jest.fn(),
        } as any;
        createShipment = new CreateShipment(shipmentRepository);
    });

    it("should throw an error if origin_zip is missing", async () => {
        const data = {
            origin_zip: "",
            destination_zip: "12345",
            weight: 10,
        } as Shipment;

        await expect(createShipment.execute(data)).rejects.toThrow("Datos de envío incompletos");
        expect(shipmentRepository.createShipment).not.toHaveBeenCalled();
    });

    it("should throw an error if destination_zip is missing", async () => {
        const data = {
            origin_zip: "54321",
            destination_zip: "",
            weight: 10,
        } as Shipment;

        await expect(createShipment.execute(data)).rejects.toThrow("Datos de envío incompletos");
        expect(shipmentRepository.createShipment).not.toHaveBeenCalled();
    });

    it("should throw an error if weight is missing", async () => {
        const data = {
            origin_zip: "54321",
            destination_zip: "12345",
            weight: 0,
        } as Shipment;

        await expect(createShipment.execute(data)).rejects.toThrow("Datos de envío incompletos");
        expect(shipmentRepository.createShipment).not.toHaveBeenCalled();
    });

    it("should call shipmentRepository.createShipment with valid data", async () => {
        const data = {
            origin_zip: "54321",
            destination_zip: "12345",
            weight: 10,
        } as Shipment;

        await createShipment.execute(data);

        expect(shipmentRepository.createShipment).toHaveBeenCalledWith(data);
    });
});