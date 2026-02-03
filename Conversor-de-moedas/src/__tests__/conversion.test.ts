import { calculateConversion } from '../utils/conversion';

describe('calculateConversion', () => {
    const mockRates = {
        'USD': 1,
        'BRL': 5.0,
        'EUR': 0.9,
    };

    test('should convert USD to BRL correctly', () => {
        const result = calculateConversion(10, 'USD', 'BRL', mockRates);
        expect(result.success).toBe(true);
        expect(result.result).toBe(50); // 10 * 5.0
        expect(result.rate).toBe(5.0);
    });

    test('should convert BRL to USD correctly', () => {
        const result = calculateConversion(50, 'BRL', 'USD', mockRates);
        expect(result.success).toBe(true);
        expect(result.result).toBe(10); // 50 / 5.0
        expect(result.rate).toBe(0.2); // 1 / 5.0
    });

    test('should return error if currency not found', () => {
        const result = calculateConversion(10, 'USD', 'XYZ', mockRates);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    test('should return error if rate is 0', () => {
        const badRates = { ...mockRates, 'ZERO': 0 };
        const result = calculateConversion(10, 'USD', 'ZERO', badRates);
        expect(result.success).toBe(false);
    });
});