
export function mod(value: number, modulo?: number) {
	if (modulo === undefined)
		return value;
	if (modulo < 1 || !Number.isInteger(modulo))
		throw new RangeError('Modulo must be a non-null positive integer');

	if (value < 0)
		return (modulo + value % modulo) % modulo;
	else
		return value % modulo;
}

export function gcd(a: number, b: number): number {
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return Math.abs(a);
}