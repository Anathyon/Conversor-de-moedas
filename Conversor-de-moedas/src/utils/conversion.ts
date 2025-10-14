interface ConversionResult {
    success: boolean;
    result: number;
    rate: number;
}

// A função recebe as taxas no formato { "BRL": 5.20, "USD": 1, ... }
export function calculateConversion(
    amount: number,
    fromCode: string,
    toCode: string,
    rates: Record<string, number>
): ConversionResult & { error?: string } {

    // 1. Verificação da taxa de destino (To)
    const rateTo = rates[toCode];
    if (rateTo === undefined || rateTo === 0) {
        // Taxa de destino é necessária para qualquer conversão
        console.error(`Taxa não encontrada para ${toCode}`);
        return { success: false, result: 0, rate: 0, error: `Taxa de destino (${toCode}) não disponível.` };
    }

    // 2. Verificação da taxa de origem (From)
    const rateFrom = rates[fromCode];
    if (rateFrom === undefined || rateFrom === 0) {
        // Taxa de origem é necessária para a conversão
        console.error(`Taxa não encontrada para ${fromCode}`);
        return { success: false, result: 0, rate: 0, error: `Taxa de origem (${fromCode}) não disponível.` };
    }
    
    // 3. CÁLCULO BASEADO NO USD (Ouro da conversão de moedas)
    // Passo 1: Converter o Montante de 'FROM' para a Moeda Base (USD)
    // Valor em USD = Montante / Taxa de 'FROM' para USD (ex: 100 BRL / 5.00 BRL/USD = 20 USD)
    const valueInUSD = amount / rateFrom;
    
    // Passo 2: Converter o Valor em USD para a Moeda de Destino ('TO')
    // Resultado = Valor em USD * Taxa de 'TO' para USD (ex: 20 USD * 5.20 BRL/USD = 104 BRL)
    const finalResult = valueInUSD * rateTo;
    
    // 4. Calcular a Taxa Direta (para exibir no histórico)
    // Taxa Direta = (Taxa de 'TO' para USD) / (Taxa de 'FROM' para USD)
    // Ex: Taxa BRL/USD (5.20) / Taxa EUR/USD (0.92) = Taxa EUR/BRL
    const directRate = rateTo / rateFrom;

    // A conversão de sucesso só ocorre se houver taxas válidas e o resultado for finito
    if (isNaN(finalResult) || !isFinite(finalResult)) {
         return { success: false, result: 0, rate: 0, error: "Cálculo resultou em valor inválido." };
    }

    return {
        success: true,
        result: finalResult,
        rate: directRate,
    };
}