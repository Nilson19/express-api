import { UpdateShipment } from "../UpdateShipment";
import { IShipmentRepository } from "../../../domain/repositories/IShipmenRepository";

describe("UpdateShipment", () => {
    let shipmentRepository: jest.Mocked<IShipmentRepository>;
    let updateShipment: UpdateShipment;

    beforeEach(() => {
        shipmentRepository = {
            updateShipment: jest.fn(),
        } as unknown as jest.Mocked<IShipmentRepository>;
        updateShipment = new UpdateShipment(shipmentRepository);
    });

    it("should throw an error if shipmentId is missing", async () => {
        await expect(updateShipment.execute("", "delivered")).rejects.toThrow(
            "Datos de actualizacion incompletos"
        );
    });

    it("should throw an error if status is missing", async () => {
        await expect(updateShipment.execute("123", "")).rejects.toThrow(
            "Datos de actualizacion incompletos"
        );
    });

    it("should call shipmentRepository.updateShipment with correct arguments", async () => {
        shipmentRepository.updateShipment.mockResolvedValue(true);
        const result = await updateShipment.execute("123", "delivered");
        expect(shipmentRepository.updateShipment).toHaveBeenCalledWith("123", "delivered");
        expect(result).toBe(true);
    });

    it("should return false if repository returns false", async () => {
        shipmentRepository.updateShipment.mockResolvedValue(false);
        const result = await updateShipment.execute("123", "pending");
        expect(result).toBe(false);
    });
});