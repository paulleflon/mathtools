import { describe, expect, it } from 'vitest';
import { gcd, mod } from './algebra';

describe('modulo', () => {
	it('should return the correct modulo for positive values', () => {
		expect(mod(10, 3)).toBe(1);
		expect(mod(25, 7)).toBe(4);
		expect(mod(100, 10)).toBe(0);
	});

	it('should return the correct modulo for negative values', () => {
		expect(mod(-10, 3)).toBe(2);
		expect(mod(-25, 7)).toBe(3);
		expect(mod(-100, 10)).toBe(0);
		expect(mod(-25, 25)).toBe(0);
		expect(mod(-26, 25)).toBe(24);
	});

	it('should throw an error for invalid modulo values', () => {
		expect(() => mod(10, 0)).toThrow(RangeError);
		expect(() => mod(10, -3)).toThrow(RangeError);
		expect(() => mod(10, 2.5)).toThrow(RangeError);
	});

	it('should return the value itself when only one argument is provided', () => {
		expect(mod(10)).toBe(10);
		expect(mod(-10)).toBe(-10);
		expect(mod(0)).toBe(0);
	});
});

describe('gcd', () => {
	it('should return the correct gcd for positive values', () => {
		expect(gcd(48, 18)).toBe(6);
		expect(gcd(101, 103)).toBe(1);
		expect(gcd(56, 98)).toBe(14);
	});

	it('should return the correct gcd when one value is zero', () => {
		expect(gcd(0, 5)).toBe(5);
		expect(gcd(5, 0)).toBe(5);
		expect(gcd(0, 0)).toBe(0);
	});

	it('should return the correct gcd for negative values', () => {
		expect(gcd(-48, 18)).toBe(6);
		expect(gcd(48, -18)).toBe(6);
		expect(gcd(-48, -18)).toBe(6);
	});

	it('should return the correct gcd for equal values', () => {
		expect(gcd(7, 7)).toBe(7);
		expect(gcd(-7, -7)).toBe(7);
		expect(gcd(0, 0)).toBe(0);
	});
});