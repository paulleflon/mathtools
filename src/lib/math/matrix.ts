import { mod } from './algebra';

export class Matrix {
	value: number[][]

	constructor(initialData: number[][], modulo?: number) {
		if (!Matrix.check(initialData))
			throw new TypeError('This matrix is not valid.');
		this.value = initialData;
		if (typeof modulo === 'number')
			this.transform(v => mod(v, modulo));
	}

	clone(): Matrix {
		return new Matrix(this.value);
	}

	toArray(): number[][] {
		return this.value;
	}

	get(i: number, j: number): number {
		return this.value[i][j];
	}

	getRow(i: number): number[] {
		return this.value[i];
	}

	set(i: number, j: number, v: number, modulo?: number) {
		this.value[i][j] = mod(v, modulo);
		return this;
	}

	insertRow(row: number[], position?: number, modulo?: number) {
		if (row.length !== this.size[1])
			throw new TypeError('Row length does not match matrix row length');
		if (typeof modulo === 'number')
			row = row.map(i => mod(i, modulo));
		if (typeof position !== 'number')
			this.value.push(row);
		else
			this.value.splice(position, 0, row);

		return this;
	}

	deleteRow(row: number) {
		this.value.splice(row, 1);
		return this;
	}

	deleteColumn(column: number) {
		for (const row of this.value) {
			row.splice(column, 1);
		}
		return this;
	}

	transform(transformer: (value: number, i: number, j: number) => number) {
		for (let i = 0; i < this.size[0]; i++) {
			for (let j = 0; j < this.size[1]; j++) {
				this.value[i][j] = transformer(this.value[i][j], i, j);
			}
		}
		return this;
	}

	add(m2: Matrix, modulo?: number): Matrix {
		if (this.size[0] != m2.size[0] || this.size[1] != m2.size[1]) {
			throw new TypeError('Matrix sizes don\'t match.');
		}
		this.transform((value, i, j) => mod(value + m2.get(i, j), modulo));
		return this;
	}

	scalar(n: number, modulo?: number): Matrix {
		this.transform(v => mod(v * n, modulo))
		return this;
	}

	product(m2: Matrix, modulo?: number) {
		if (this.size[1] !== m2.size[0])
			throw new Error('Matrix dimensions do not match for product');
		const result = [];
		for (let i = 0; i < this.size[0]; i++) {
			const row = [];
			for (let j = 0; j < m2.size[1]; j++) {
				let value = 0;
				for (let k = 0; k < this.size[1]; k++) {
					value += this.get(i, k) * m2.get(k, j);
				}
				row.push(mod(value, modulo));
			}
			result.push(row);
		}
		this.value = result;
		return this;
	}

	transpose() {
		const transposed = [];
		for (let i = 0; i < this.size[1]; i++) {
			const row = [];
			for (let j = 0; j < this.size[0]; j++) {
				row.push(this.value[j][i]);
			}
			transposed.push(row);
		}
		this.value = transposed;
		return this;
	}

	determinant(modulo?: number) {
		if (this.size[0] !== this.size[1]) {
			throw new Error('Determinant can only be calculated for square matrices');
		}
		const determinantRecursive = (matrix: number[][]): number => {
			const size = matrix.length;
			if (size === 1) {
				return matrix[0][0];
			}
			if (size === 2) {
				return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
			}
			let det = 0;
			for (let i = 0; i < size; i++) {
				const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
				det += matrix[0][i] * determinantRecursive(subMatrix) * (i % 2 === 0 ? 1 : -1);
			}
			return det;
		};

		const det = determinantRecursive(this.value);
		return mod(det, modulo);
	}

	inverse() {
		
	}

	get size(): [number, number] {
		return [this.value.length, this.value[0].length];
	}

	*[Symbol.iterator]() {
		for (const row of this.value) {
			yield row;
		}
	}

	toString(): string {
		let str = '';
		for (const row of this.value) {
			for (const v of row) {
				str += `${v} `;
			}
			str = str.slice(0, -1);
			str += '\n';
		}
		return str.slice(0, -1);
	}

	static check(matrix: number[][]): boolean {
		const length = matrix[0]?.length;
		for (const row of matrix) {
			if (row.length !== length)
				return false;
		}
		return true;
	}

	static identity(size: number): Matrix {
		const arr = [];
		for (let i = 0; i < size; i++) {
			const row = [];
			for (let j = 0; j < size; j++) {
				row.push(i === j ? 1 : 0);
			}
			arr.push(row);
		}
		return new Matrix(arr);
	}

	static ones(rows: number, columns?: number) {
		return new Matrix(new Array(rows).fill(null).map(() => new Array(columns ?? rows).fill(1)));
	}

}

export class ModularMatrix extends Matrix {
	modulo: number;
	constructor(intialValues: number[][], modulo: number) {
		if (modulo < 1 || !Number.isInteger(modulo))
			throw new RangeError('Modulo must be a non-null positive integer');
		super(intialValues, modulo);
		this.modulo = modulo;
	}

	clone(): ModularMatrix {
		return new ModularMatrix(this.value, this.modulo);
	}
	set(i: number, j: number, value: number) {
		super.set(i, j, value, this.modulo);
		return this;
	}
	insertRow(row: number[], position?: number) {
		super.insertRow(row, position, this.modulo);
		return this;
	}
	transform(transformer: (value: number, i: number, j: number) => number) {
		for (let i = 0; i < this.size[0]; i++) {
			for (let j = 0; j < this.size[1]; j++) {
				this.value[i][j] = mod(transformer(this.value[i][j], i, j), this.modulo);
			}
		}
		return this;
	}
	add(m2: Matrix) {
		super.add(m2, this.modulo);
		return this;
	}
	scalar(n: number) {
		super.scalar(n, this.modulo);
		return this;
	}
	product(m2: Matrix) {
		super.product(m2, this.modulo);
		return this;
	}
	determinant(): number {
		return super.determinant(this.modulo);
	}
}
