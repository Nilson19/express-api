import { RegisterUser } from '../RegisterUser';
import { ConflictError, ValidationError } from '../../../utils/errors/AppError';
import ValidationUtils from '../../../utils/validation';

jest.mock('../../../utils/validation');

const mockUserRepository = {
    findByEmail: jest.fn(),
    register: jest.fn(),
};

const mockAddressRepository = {
    addAddress: jest.fn(),
};

const mockUser = {
    email: 'test@example.com',
    password: 'plainpassword',
    addresses: [{ street: '123 Main St', city: 'Testville' }],
} as any;

describe('RegisterUser', () => {
    let registerUser: RegisterUser;

    beforeEach(() => {
        jest.clearAllMocks();
        (ValidationUtils.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
        registerUser = new RegisterUser(
            mockUserRepository as any,
            mockAddressRepository as any
        );
    });

    it('registers a new user and adds addresses', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.register.mockResolvedValue('user-id');
        mockAddressRepository.addAddress.mockResolvedValue(undefined);

        await registerUser.execute({ ...mockUser });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(ValidationUtils.hashPassword).toHaveBeenCalledWith('plainpassword');
        expect(mockUserRepository.register).toHaveBeenCalledWith(
            expect.objectContaining({ password: 'hashedpassword' })
        );
        expect(mockAddressRepository.addAddress).toHaveBeenCalledWith('user-id', mockUser.addresses[0]);
    });

    it('throws ConflictError if email already exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' });

        await expect(registerUser.execute({ ...mockUser }))
            .rejects
            .toThrow(ConflictError);

        expect(mockUserRepository.register).not.toHaveBeenCalled();
        expect(mockAddressRepository.addAddress).not.toHaveBeenCalled();
    });

    it('throws ValidationError if no addresses are provided', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(registerUser.execute({ ...mockUser, addresses: [] }))
            .rejects
            .toThrow(ValidationError);

        expect(mockUserRepository.register).not.toHaveBeenCalled();
        expect(mockAddressRepository.addAddress).not.toHaveBeenCalled();
    });

    it('throws ValidationError if addresses is undefined', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(registerUser.execute({ ...mockUser, addresses: undefined }))
            .rejects
            .toThrow(ValidationError);

        expect(mockUserRepository.register).not.toHaveBeenCalled();
        expect(mockAddressRepository.addAddress).not.toHaveBeenCalled();
    });
});