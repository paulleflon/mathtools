import { describe, expect, it } from 'vitest';
import { Matrix, ModularMatrix } from './matrix';
describe('Matrix', () => {

	describe('constructor', () => {
		it('throws if size is invalid', () => {
			expect(() => new Matrix([[1], [2, 3]])).toThrowError();
		});
		it('accepts empty matrix', () => {
			expect(() => new Matrix([])).not.toThrow();
		});
		it('accepts singleton', () => {
			expect(() => new Matrix([[1]])).not.toThrow();
		});
		it('creates an identity matrix', () => {
			const identityMatrix = Matrix.identity(3);
			const m2 = Matrix.identity(1);
			expect(identityMatrix.toArray()).toEqual([
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			]);
			expect(m2.toArray()).toEqual([[1]]);
		});
		it('creates a matrix of ones', () => {
			const m1 = Matrix.ones(3);
			const m2 = Matrix.ones(3, 3);
			const m3 = Matrix.ones(1);
			const m4 = Matrix.ones(5, 2);

			expect(m1.toArray()).toEqual([
				[1, 1, 1],
				[1, 1, 1],
				[1, 1, 1]
			]);

			expect(m2.toArray()).toEqual([
				[1, 1, 1],
				[1, 1, 1],
				[1, 1, 1]
			]);

			expect(m3.toArray()).toEqual([
				[1]
			]);

			expect(m4.toArray()).toEqual([
				[1, 1],
				[1, 1],
				[1, 1],
				[1, 1],
				[1, 1]
			]);
		});
	});

	describe('access', () => {
		const matrix = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);

		it('gets correct number', () => {
			expect(matrix.get(1, 1)).toEqual(5);
		});
		it('gets correct row', () => {
			expect(matrix.getRow(2)).toEqual([7, 8, 9]);
		});

		it('iterates through the matrix correctly', () => {
			const values = [];
			for (const row of matrix) {
				for (const i of row)
					values.push(i);
			}
			expect(values).toEqual([
				1, 2, 3, 4, 5, 6, 7, 8, 9
			]);
		});
	});

	describe('infos', () => {
		const matrix = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);

		it('returns correct string representation', () => {
			expect(matrix.toString()).toEqual('1 2 3\n4 5 6\n7 8 9');
		});

		it('returns correct size', () => {
			expect(matrix.size).toEqual([3, 3]);
		});

		it('checks matrix dimensions', () => {
			expect(Matrix.check([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			])).toBe(true);

			expect(Matrix.check([
				[1, 2],
				[3, 4, 5]
			])).toBe(false);
		});
	})

	describe('mutation', () => {
		const m1 = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);

		it('sets the correct number', () => {
			m1.set(1, 1, 16);
			expect(m1.get(1, 1)).toEqual(16);
		});
		it('inserts first row', () => {
			m1.insertRow([5, 5, 5], 0);
			expect(m1.getRow(0)).toEqual([5, 5, 5]);
		});
		it('inserts last row', () => {
			m1.insertRow([6, 6, 6]);
			expect(m1.getRow(m1.size[0] - 1)).toEqual([6, 6, 6]);
		});
		it('inserts row in the middle', () => {
			m1.insertRow([7, 7, 7], 2);
			expect(m1.getRow(2)).toEqual([7, 7, 7]);
		});
		it('preserves matrix size', () => {
			expect(() => m1.insertRow([1])).toThrow();
		});

		const m2 = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[10, 11, 12],
			[13, 14, 15]
		]);

		it('deletes the first row', () => {
			m2.deleteRow(0);
			expect(m2.getRow(0)).toEqual([4, 5, 6]);
		});
		it('deletes the last row', () => {
			m2.deleteRow(m2.size[0] - 1);
			expect(m2.getRow(m2.size[0] - 1)).toEqual([10, 11, 12]);
		});
		it('deletes a row in the middle', () => {
			m2.deleteRow(1);
			expect(m2.getRow(1)).toEqual([10, 11, 12]);
		});
	});

	describe('operations', () => {
		const m1 = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);

		const m2 = new Matrix([
			[9, 8, 7],
			[6, 5, 4],
			[3, 2, 1]
		]);

		it('adds two matrices correctly', () => {
			m1.add(m2);
			expect(m1.toArray()).toEqual([
				[10, 10, 10],
				[10, 10, 10],
				[10, 10, 10]
			]);
		});

		it('throws if matrices sizes do not match', () => {
			const m3 = new Matrix([
				[1, 2],
				[3, 4]
			]);
			expect(() => m1.add(m3)).toThrowError();
		});
		it('multiplies matrix by a scalar correctly', () => {
			const m3 = new Matrix([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			]);
			m3.scalar(2);
			expect(m3.toArray()).toEqual([
				[2, 4, 6],
				[8, 10, 12],
				[14, 16, 18]
			]);
		});
		it('multiplies two matrices correctly', () => {
			const m3 = new Matrix([
				[1, 2],
				[3, 4]
			]);

			const m4 = new Matrix([
				[2, 0],
				[1, 2]
			]);

			m3.product(m4);
			expect(m3.toArray()).toEqual([
				[4, 4],
				[10, 8]
			]);
		});

		it('throws if matrices sizes do not match for multiplication', () => {
			const m3 = new Matrix([
				[1, 2],
				[3, 4]
			]);

			const m4 = new Matrix([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			]);
			expect(() => m3.product(m4)).toThrowError();
		});
		it('transposes the matrix correctly', () => {
			const m3 = new Matrix([
				[1, 2, 3],
				[4, 5, 6]
			]);

			m3.transpose();
			expect(m3.toArray()).toEqual([
				[1, 4],
				[2, 5],
				[3, 6]
			]);
		});

		it('transposes a square matrix correctly', () => {
			const m4 = new Matrix([
				[1, 2],
				[3, 4]
			]);

			m4.transpose();
			expect(m4.toArray()).toEqual([
				[1, 3],
				[2, 4]
			]);
		});

		it('transposes a single row matrix correctly', () => {
			const m5 = new Matrix([
				[1, 2, 3]
			]);

			m5.transpose();
			expect(m5.toArray()).toEqual([
				[1],
				[2],
				[3]
			]);
		});

		it('transposes a single column matrix correctly', () => {
			const m6 = new Matrix([
				[1],
				[2],
				[3]
			]);

			m6.transpose();
			expect(m6.toArray()).toEqual([
				[1, 2, 3]
			]);
		});
		it('calculates the determinant of a 1x1 matrix', () => {
			const m = new Matrix([[5]]);
			expect(m.determinant()).toEqual(5);
		});

		it('calculates the determinant of a 2x2 matrix', () => {
			const m = new Matrix([
				[1, 2],
				[3, 4]
			]);
			expect(m.determinant()).toEqual(-2);
		});

		it('calculates the determinant of a 3x3 matrix', () => {
			const m = new Matrix([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			]);
			expect(m.determinant()).toEqual(0);
		});

		it('throws if the matrix is not square', () => {
			const m = new Matrix([
				[1, 2, 3],
				[4, 5, 6]
			]);
			expect(() => m.determinant()).toThrowError();
		});
	});
});

describe('ModularMatrix', () => {
	describe('constructor', () => {
		it('throws if modulo is invalid', () => {
			expect(() => new ModularMatrix([[1, 2], [3, 4]], 0)).toThrowError();
			expect(() => new ModularMatrix([[1, 2], [3, 4]], -1)).toThrowError();
			expect(() => new ModularMatrix([[1, 2], [3, 4]], 1.5)).toThrowError();
		});
		it('creates a valid modular matrix', () => {
			const matrix = new ModularMatrix([[1, 2], [3, 4]], 3);
			expect(matrix.toArray()).toEqual([[1, 2], [0, 1]]);
		});
	});

	describe('mutation', () => {
		const matrix = new ModularMatrix([[1, 2], [3, 4]], 3);
		it('sets the correct number with modulo', () => {
			matrix.set(0, 0, 5);
			expect(matrix.get(0, 0)).toEqual(2);
		});
		it('inserts a row with modulo', () => {
			matrix.insertRow([5, 6], 1);
			expect(matrix.getRow(1)).toEqual([2, 0]);
		});
		it('transforms the matrix with modulo', () => {
			matrix.transform((value) => value + 1);
			expect(matrix.toArray()).toEqual([[0, 0], [0, 1], [1, 2]]);
		});
	});

	describe('operations', () => {
		const m1 = new ModularMatrix([[1, 2], [3, 4]], 3);
		const m2 = new ModularMatrix([[2, 1], [0, 2]], 3);

		it('adds two modular matrices correctly', () => {
			m1.add(m2);
			expect(m1.toArray()).toEqual([[0, 0], [0, 0]]);
		});
		it('multiplies modular matrix by a scalar correctly', () => {
			const m3 = new ModularMatrix([[1, 2], [3, 4]], 3);
			m3.scalar(2);
			expect(m3.toArray()).toEqual([[2, 1], [0, 2]]);
		});
		it('multiplies two modular matrices correctly', () => {
			const m3 = new ModularMatrix([[1, 2], [3, 4]], 3);
			const m4 = new ModularMatrix([[2, 0], [1, 2]], 3);
			m3.product(m4);
			expect(m3.toArray()).toEqual([[1, 1], [1, 2]]);
		});
		it('calculates the determinant of a 1x1 modular matrix', () => {
			const m = new ModularMatrix([[5]], 3);
			expect(m.determinant()).toEqual(2);
		});

		it('calculates the determinant of a 2x2 modular matrix', () => {
			const m = new ModularMatrix([
				[1, 2],
				[3, 4]
			], 5);
			expect(m.determinant()).toEqual(3);
		});

		it('calculates the determinant of a 3x3 modular matrix', () => {
			const m = new ModularMatrix([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			], 7);
			expect(m.determinant()).toEqual(0);
		});

		it('throws if the modular matrix is not square', () => {
			const m = new ModularMatrix([
				[1, 2, 3],
				[4, 5, 6]
			], 3);
			expect(() => m.determinant()).toThrowError();
		});
	});
});
