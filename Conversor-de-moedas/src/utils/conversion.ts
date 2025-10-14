// Define a estrutura esperada para as taxas e o resultado da conversão
interface Rates {
    [key: string]: number; // Ex: { "BRL": 5.4, "EUR": 0.92, ... }
}

interface ConversionResult {
    success: boolean;
    result: number;
    rate: number;
}

/**
 * Calcula a conversão de um montante de uma moeda para outra usando taxas baseadas em USD.
 * @param amount O valor a ser convertido.
 * @param fromCode O código da moeda de origem (ex: 'USD', 'BRL').
 * @param toCode O código da moeda de destino (ex: 'EUR', 'BRL').
 * @param rates O objeto de taxas onde todas são taxas de 1 USD.
 * @returns Um objeto contendo o resultado da conversão e a taxa utilizada.
 */
export const calculateConversion = (
    amount: number,
    fromCode: string,
    toCode: string,
    rates: Rates
): ConversionResult => {
    // Caso especial: conversão de uma moeda para ela mesma
    if (fromCode === toCode) {
        return { success: true, result: amount, rate: 1 };
    }

    // 1. Obter taxas de câmbio para a moeda de origem e destino
    // A API retorna a taxa de X para USD (Se for USD, a taxa é 1)
    const rateFrom = rates[fromCode]; 
    const rateTo = rates[toCode];

    // 2. Verificar se ambas as taxas existem
    if (!rateFrom || !rateTo) {
        console.error(`Taxa não encontrada para ${fromCode} ou ${toCode}`);
        return { success: false, result: 0, rate: 0 };
    }

    let result = 0;
    let finalRate = 0;

    // 3. Calcular a conversão
    
    // Converte o montante de 'From' para USD (USD é a moeda base no rates)
    // Se a taxa for 5.0 (BRL para USD), 1 BRL = 1/5.0 USD = 0.2 USD
    const amountInUSD = amount / rateFrom;
    
    // Converte de USD para 'To'
    // Se a taxa for 0.92 (EUR para USD), 1 USD = 0.92 EUR
    result = amountInUSD * rateTo;

    // 4. Calcular a taxa final para exibição (1 From = X To)
    // Taxa de 1 From para 1 To = (1 / rateFrom) * rateTo
    finalRate = rateTo / rateFrom;
    
    return { success: true, result: result, rate: finalRate };
};