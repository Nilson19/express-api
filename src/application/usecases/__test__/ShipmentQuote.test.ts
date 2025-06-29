import { ShipmentQuote } from "../ShipmentQuote";
import { ITariffRepository } from "../../../domain/repositories/ITariffRepository";

describe("ShipmentQuote", () => {
    let tariffRepository: jest.Mocked<ITariffRepository>;
    let shipmentQuote: ShipmentQuote;

    beforeEach(() => {
        tariffRepository = {
            getTariff: jest.fn(),
        };
        shipmentQuote = new ShipmentQuote(tariffRepository);
    });

    it("should return the cost when valid parameters are provided", async () => {
        tariffRepository.getTariff.mockResolvedValue("100.00");
        const result = await shipmentQuote.getShipmentQuote("110111", "220222", 5, 40, 30, 20);
        expect(result).toBe("100.00");
        const volumeWeight = Math.ceil((40 * 30 * 20) / 2500);
        const maxWeight = Math.max(volumeWeight, 5);
        expect(tariffRepository.getTariff).toHaveBeenCalledWith("110111", "220222", maxWeight);
    });

    it("should throw an error if originZip is missing", async () => {
        await expect(
            shipmentQuote.getShipmentQuote("", "220222", 5, 40, 30, 20)
        ).rejects.toThrow("Invalid input parameters for shipment quote.");
    });

    it("should throw an error if destinationZip is missing", async () => {
        await expect(
            shipmentQuote.getShipmentQuote("110111", "", 5, 40, 30, 20)
        ).rejects.toThrow("Invalid input parameters for shipment quote.");
    });

    it("should throw an error if weight is zero or negative", async () => {
        await expect(
            shipmentQuote.getShipmentQuote("110111", "220222", 0, 0, 0, 0)
        ).rejects.toThrow("Invalid input parameters for shipment quote.");

        await expect(
            shipmentQuote.getShipmentQuote("110111", "220222", -1, 0, 0, 0)
        ).rejects.toThrow("Invalid input parameters for shipment quote.");
    });

    it("should throw an error if no tariff is found", async () => {
        tariffRepository.getTariff.mockResolvedValue(null);
        await expect(
            shipmentQuote.getShipmentQuote("110111", "220222", 5, 100, 50, 30)
        ).rejects.toThrow("No tariff found for the given parameters.");
    });
});