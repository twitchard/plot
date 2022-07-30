/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ArrayType,
  Value,
  DataArray,
  Datum,
  index,
  Data,
  Series,
  ValueArray,
  DatumKeys,
  ObjectDatum
} from "./data.js";
import {parse as isoParse} from "isoformat";
import {color, descending, quantile, TypedArray} from "d3";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
const TypedArray = Object.getPrototypeOf(Uint8Array);
const objectToString = Object.prototype.toString;
type Nullish = null | undefined;

// Not sure about naming of this, but this was created because valueof doesn't
// support color constants as values, so we shouldn't allow arbitrary strings.
// Used by valueof.
export type Accessor<T extends Datum> =
  | DatumKeys<T>
  | AccessorFunction<T>
  | TransformMethod<T>
  | ValueArray
  | number
  | Date
  | boolean
  | null
  | undefined;

type AccessorFunction<T extends Datum> = (d: T, i: number) => Value;
export type TransformMethod<T extends Datum> = {
  transform: (data: Data<T> | null | undefined) => ValueArray | Iterable<Value>;
};

export function valueof<D extends Nullish>(data: D, v: Accessor<D>, t?: ArrayType): D;
export function valueof<V extends number | Date | boolean>(d: Data<Datum>, value: V, t?: ArrayType): V[];
export function valueof<T extends Datum>(d: Data<T>, v: Accessor<T>, type: Float64ArrayConstructor): Float64Array;
export function valueof<T extends Datum>(d: Data<T>, v: Accessor<T>, type: Float32ArrayConstructor): Float32Array;
export function valueof<T extends Datum>(d: Data<T>, value: Accessor<T>, type: ArrayConstructor): ValueArray;
export function valueof<T extends Datum>(data: Data<T>, value: Accessor<T>, arrayType?: ArrayType): ValueArray;
export function valueof<T extends Datum>(data: Data<T>, value: Accessor<T>, arrayType?: ArrayType) {
  if (data == null) return data;
  if (value == null) return value;
  if (typeof value === "string") return map(data, field(value), arrayType);
  if (typeof value === "function") return map(data, value, arrayType);
  if (typeof value === "number" || value instanceof Date || typeof value === "boolean")
    return map(data, constant(value), arrayType);
  if (isTransform(value)) return arrayify(value.transform(data), arrayType);
  return arrayify(value, arrayType); // preserve undefined type
}

function isTransform<T extends Datum>(value: ValueAccessor<T>): value is TransformMethod<T> {
  return !!value && isObject(value) && typeof (value as {transform?: any}).transform == "function";
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ValueAccessor<T extends Datum> = Accessor<T> | (string & {});

// Type: the field accessor might crash if the datum is not a generic object
export const field = (name: string) => (d: ObjectDatum) => d[name];
export const indexOf = (d: Datum, i: index) => i;
// The below cast to ValueArray is bad but necessary because identity is used as a transform
export const identity = {transform: <T extends Datum>(data: Data<T> | null | undefined) => data as ValueArray};
export const zero = () => 0;
export const one = () => 1;
export const yes = () => true;
export const string = (x: any) => (x == null ? x : `${x}`);
export const number = (x: any) => (x == null ? x : +x);
export const boolean = (x: any) => (x == null ? x : !!x);

// Type: the first and second accessors might crash if the datum is not an array
export const first = (x: Value[] | null | undefined) => (x ? x[0] : undefined);
export const second = (x: Value[] | null | undefined) => (x ? x[1] : undefined);
export const constant =
  <T extends Value>(x: T) =>
  (): T =>
    x;

/**
 * A perticentile reducer, specified by a string like “p25”
 */
export type Percentile = `p${number}`;
// `p${Digit}${Digit}`; //  would be nicer but expands to p00 p01…p99
// type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// Converts a string like “p25” into a function that takes an index I and an
// accessor function f, returning the corresponding percentile value.
export function percentile(reduce: Percentile): (I: Series, f: (i: index) => any) => number | undefined {
  const p = +`${reduce}`.slice(1) / 100;
  return (I: Series, f: (i: index) => any) => quantile(I, p, f);
}

// Some channels may allow a string constant to be specified; to differentiate
// string constants (e.g., "red") from named fields (e.g., "date"), this
// function tests whether the given value is a CSS color string and returns a
// tuple [channel, constant] where one of the two is undefined, and the other is
// the given value. If you wish to reference a named field that is also a valid
// CSS color, use an accessor (d => d.red) instead.
export function maybeColorChannel<T extends Datum>(
  value: ValueAccessor<T>,
  defaultValue?: string
): [ValueAccessor<T>, undefined] | [undefined, string] {
  if (value === undefined) value = defaultValue;
  return value === null ? [undefined, "none"] : isColor(value) ? [undefined, value] : [value, undefined];
}

// Similar to maybeColorChannel, this tests whether the given value is a number
// indicating a constant, and otherwise assumes that it’s a channel value.
export function maybeNumberChannel<T extends Datum>(
  value: ValueAccessor<T>,
  defaultValue?: number
): [ValueAccessor<T>, undefined] | [undefined, number | null] {
  if (value === undefined) value = defaultValue;
  return value === null || typeof value === "number" ? [undefined, value] : [value, undefined];
}

// Validates the specified optional string against the allowed list of keywords.
export function maybeKeyword(input: null | undefined, name: string, allowed: string[]): undefined;
export function maybeKeyword(input: string, name: string, allowed: string[]): string | undefined;
export function maybeKeyword(input: string | null | undefined, name: string, allowed: string[]): string | undefined {
  if (input != null) return keyword(input, name, allowed);
}

// Validates the specified required string against the allowed list of keywords.
export function keyword(input: string | null | undefined, name: string, allowed: string[]): string {
  const i = `${input}`.toLowerCase();
  if (!allowed.includes(i)) throw new Error(`invalid ${name}: ${input}`);
  return i;
}

// Promotes the specified data to an array or typed array as needed. If an array
// type is provided (e.g., Array), then the returned array will strictly be of
// the specified type; otherwise, any array or typed array may be returned. If
// the specified data is null or undefined, returns the value as-is.
export function arrayify(data: undefined, type: ArrayType | undefined): undefined;
export function arrayify(data: null, type: ArrayType | undefined): null;
export function arrayify<T extends Datum>(data: Data<T>): ValueArray | TypedArray;
export function arrayify<T extends Datum>(data: Data<T>, type: ArrayConstructor): ValueArray;
export function arrayify<T extends Datum>(data: Data<T>, type: Float32ArrayConstructor): Float32Array;
export function arrayify<T extends Datum>(data: Data<T>, type: Float64ArrayConstructor): Float64Array;
export function arrayify<T extends Datum>(data: Data<T>, type?: ArrayType): ValueArray | Float32Array | Float64Array;
export function arrayify<T extends Datum>(data: Data<T> | null | undefined): ValueArray | TypedArray | null | undefined;
export function arrayify<T extends Datum>(
  data: Data<T> | null | undefined,
  type: ArrayConstructor
): ValueArray | null | undefined;
export function arrayify<T extends Datum>(
  data: Data<T> | null | undefined,
  type: Float32ArrayConstructor
): Float32Array | null | undefined;
export function arrayify<T extends Datum>(
  data: Data<T> | null | undefined,
  type: Float64ArrayConstructor
): Float64Array | null | undefined;
export function arrayify<T extends Datum>(
  data: Data<T> | null | undefined,
  type?: ArrayType
): TypedArray | Array<T> | null | undefined {
  return data == null
    ? data
    : type === undefined
    ? data instanceof Array || data instanceof TypedArray
      ? (data as T[]) // is this change from ValueArray to T[] correct?
      : Array.from(data)
    : data instanceof type
    ? data
    : (type as ArrayConstructor).from(data);
}

// An optimization of type.from(values, f): if the given values are already an
// instanceof the desired array type, the faster values.map method is used.
export function map<T extends Datum, V extends Value>(
  values: Data<T>,
  f: (d: any, i: number) => V,
  type: ArrayConstructor
): V[];
export function map<T extends Datum>(
  values: Data<T>,
  f: (d: any, i: number) => number,
  type: Float32ArrayConstructor
): Float32Array;
export function map<T extends Datum>(
  values: Data<T>,
  f: (d: any, i: number) => number,
  type: Float64ArrayConstructor
): Float64Array;
export function map<T extends Datum>(values: Data<T>, f: AccessorFunction<T>, type: ArrayType | undefined): Value[];
export function map<T extends Datum>(values: Data<T>, f: AccessorFunction<T>): Value[];
export function map<T extends Datum>(
  values: Data<T>,
  f: (d: any, i: number) => any,
  type: ArrayType | undefined
): Value[];
export function map<T extends Datum>(values: Data<T>, f: (d: any, i: number) => any, type: ArrayType = Array) {
  return values instanceof type ? values.map(f) : (type as ArrayConstructor).from(values, f);
}

// An optimization of type.from(values): if the given values are already an
// instanceof the desired array type, the faster values.slice method is used.
export function slice(values: DataArray, type: ArrayType = Array): any[] | Float32Array | Float64Array {
  return values instanceof type ? values.slice() : (type as ArrayConstructor).from(values);
}

export function isTypedArray(values: DataArray): values is TypedArray {
  return values instanceof TypedArray;
}

// Disambiguates an options object (e.g., {y: "x2"}) from a primitive value.
export function isObject(option: undefined): false;
export function isObject(option: any): boolean;
export function isObject(option: any) {
  return option?.toString === objectToString;
}

// Disambiguates a scale options object (e.g., {color: {type: "linear"}}) from
// some other option (e.g., {color: "red"}). When creating standalone legends,
// this is used to test whether a scale is defined; this should be consistent
// with inferScaleType when there are no channels associated with the scale, and
// if this returns true, then normalizeScale must return non-null.
export function isScaleOptions(option: any): boolean {
  return isObject(option) && (option.type !== undefined || option.domain !== undefined);
}

// Disambiguates an options object (e.g., {y: "x2"}) from a channel value
// definition expressed as a channel transform (e.g., {transform: …}).
export function isOptions(option: any): boolean {
  return isObject(option) && typeof (option as {transform: null}).transform !== "function";
}

// Disambiguates a sort transform (e.g., {sort: "date"}) from a channel domain
// sort definition (e.g., {sort: {y: "x"}}).
export function isDomainSort(sort: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return isObject(sort) && sort!.value === undefined && sort!.channel === undefined;
}

// For marks specified either as [0, x] or [x1, x2], such as areas and bars.
// type Identity<T extends Datum> = {transform: (d: T) => T};
export function maybeZero<T extends Datum>(
  x: ValueAccessor<T> | undefined,
  x1: ValueAccessor<T> | undefined | 0,
  x2: ValueAccessor<T> | undefined | 0,
  x3: ValueAccessor<T> = identity
) {
  if (x1 === undefined && x2 === undefined) {
    // {x} or {}
    (x1 = 0), (x2 = x === undefined ? x3 : x);
  } else if (x1 === undefined) {
    // {x, x2} or {x2}
    x1 = x === undefined ? 0 : x;
  } else if (x2 === undefined) {
    // {x, x1} or {x1}
    x2 = x === undefined ? 0 : x;
  }
  return [x1, x2];
}

// For marks that have x and y channels (e.g., cell, dot, line, text).
export function maybeTuple<T>(x: T | undefined, y: T | undefined): [T | undefined, T | undefined] {
  return x === undefined && y === undefined
    ? [first as unknown as T | undefined, second as unknown as T | undefined]
    : [x, y];
}

// A helper for extracting the z channel, if it is variable. Used by transforms
// that require series, such as moving average and normalize.
type ZOptions<T extends Datum> = {fill?: ValueAccessor<T>; stroke?: ValueAccessor<T>; z?: ValueAccessor<T>};
export function maybeZ<T extends Datum>({z, fill, stroke}: ZOptions<T> = {}) {
  if (z === undefined) [z] = maybeColorChannel(fill);
  if (z === undefined) [z] = maybeColorChannel(stroke);
  return z;
}

// Returns a Uint32Array with elements [0, 1, 2, … data.length - 1].
export function range(data: ArrayLike<Datum>): Uint32Array {
  const n = data.length;
  const r = new Uint32Array(n);
  for (let i = 0; i < n; ++i) r[i] = i;
  return r;
}

// Returns a filtered range of data given the test function.
export function where(data: ArrayLike<Datum>, test: (d: any, i?: index, data?: ArrayLike<Datum>) => boolean) {
  return range(data).filter((i) => test(data[i], i, data));
}

// Returns an array [values[index[0]], values[index[1]], …].
export function take(values: ValueArray, index: Series): ValueArray {
  return map(index, (i: index) => values[i]);
}

// Based on InternMap (d3.group).
export function keyof(value: Datum) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

// note: maybeInput doesn't type check if the field is an accessor
export function maybeInput(key: string, options: {[key: string]: any}) {
  if (options[key] !== undefined) return options[key];
  switch (key) {
    case "x1":
    case "x2":
      key = "x";
      break;
    case "y1":
    case "y2":
      key = "y";
      break;
  }
  return options[key];
}

/**

#### Plot.column([*source*])

This helper for constructing derived columns returns a [*column*, *setColumn*] array. The *column* object implements *column*.transform, returning whatever value was most recently passed to *setColumn*. If *setColumn* is not called, then *column*.transform returns undefined. If a *source* is specified, then *column*.label exposes the given *source*’s label, if any: if *source* is a string as when representing a named field of data, then *column*.label is *source*; otherwise *column*.label propagates *source*.label. This allows derived columns to propagate a human-readable axis or legend label.

Plot.column is typically used by options transforms to define new channels; the associated columns are populated (derived) when the **transform** option function is invoked.

@link https://github.com/observablehq/plot/blob/main/README.md#plotcolumnsource
 */
export function column(source: any): [GetColumn, SetColumn] {
  let value: ValueArray;
  return [
    {
      transform: () => value,
      label: labelof(source)
    },
    (v) => ((value = v), v)
  ];
}
export type GetColumn = {transform: () => ValueArray; label?: string};
type SetColumn = <T extends ValueArray | Float32Array | Float64Array>(v: T) => T;

// Like column, but allows the source to be null.
export function maybeColumn<T extends Datum>(
  source: ValueAccessor<T> | ((data: DataArray) => void)
): [GetColumn, SetColumn] | [null?] {
  return source == null ? [source] : column(source);
}

type MaybeLabel = string | {label?: string} | null | undefined;
export function labelof(value: string | {label?: string}, defaultValue?: string): string;
export function labelof<T extends string | undefined>(value: null | undefined, defaultValue?: T): T;
export function labelof(value: MaybeLabel, defaultValue?: string) {
  return typeof value === "string" ? value : value && value.label !== undefined ? value.label : defaultValue;
}

// Assuming that both x1 and x2 and lazy columns (per above), this derives a new
// a column that’s the average of the two, and which inherits the column label
// (if any). Both input columns are assumed to be quantitative. If either column
// is temporal, the returned column is also temporal.
export function mid(x1: GetColumn, x2: GetColumn): {transform(): Float64Array | Value[]; label: string | undefined} {
  return {
    transform() {
      const X1 = x1.transform();
      const X2 = x2.transform();
      return isTemporal(X1) || isTemporal(X2)
        ? map(X1, (_, i) => new Date((+X1[i]! + +X2[i]!) / 2)) // Do we need to handle null or undefined in either of these cases?
        : map(X1, (_, i) => (+X1[i]! + +X2[i]!) / 2, Float64Array); // e.g. X1[i] == null ? X1[i] : X2[i] == null ? X2[i] : ...
    },
    label: x1.label
  };
}

// This distinguishes between per-dimension options and a standalone value.
export function maybeValue(value: any): any {
  return value === undefined || isOptions(value) ? value : {value};
}

// Coerces the given channel values (if any) to numbers. This is useful when
// values will be interpolated into other code, such as an SVG transform, and
// where we don’t wish to allow unexpected behavior for weird input.
export function numberChannel(
  source: ValueArray & {label?: string}
): {transform: (data: DataArray) => Float64Array; label: string | undefined} | null {
  return source == null
    ? null
    : {
        transform: (data: DataArray) => valueof(data, source, Float64Array),
        label: labelof(source)
      };
}

export function isIterable(value: any): value is Iterable<any> {
  return value && typeof value[Symbol.iterator] === "function";
}

export function isTextual(values: Iterable<Datum>): boolean {
  for (const value of values) {
    if (value == null) continue;
    return typeof value !== "object" || value instanceof Date;
  }
  return false;
}

export function isOrdinal(values: Iterable<Datum>): boolean {
  for (const value of values) {
    if (value == null) continue;
    const type = typeof value;
    return type === "string" || type === "boolean";
  }
  return false;
}

export function isTemporal(values: Iterable<Value>): boolean {
  for (const value of values) {
    if (value == null) continue;
    return value instanceof Date;
  }
  return false;
}

// Are these strings that might represent dates? This is stricter than ISO 8601
// because we want to ignore false positives on numbers; for example, the string
// "1192" is more likely to represent a number than a date even though it is
// valid ISO 8601 representing 1192-01-01.
export function isTemporalString(values: Iterable<Datum>): boolean {
  for (const value of values) {
    if (value == null) continue;
    return typeof value === "string" && isNaN(value as unknown as number) && (isoParse(value) as unknown as boolean);
  }
  return false;
}

// Are these strings that might represent numbers? This is stricter than
// coercion because we want to ignore false positives on e.g. empty strings.
export function isNumericString(values: Iterable<Datum>): boolean {
  for (const value of values) {
    if (value == null || value === "") continue;
    return typeof value === "string" && !isNaN(value as unknown as number);
  }
  return false;
}

export function isNumeric(values: Iterable<Datum>): boolean {
  for (const value of values) {
    if (value == null) continue;
    return typeof value === "number";
  }
  return false;
}

export function isFirst(values: IterableIterator<Datum>, is: (d: Datum) => boolean) {
  for (const value of values) {
    if (value == null) continue;
    return is(value);
  }
}

// Whereas isFirst only tests the first defined value and returns undefined for
// an empty array, this tests all defined values and only returns true if all of
// them are valid colors. It also returns true for an empty array, and thus
// should generally be used in conjunction with isFirst.
export function isEvery(values: IterableIterator<Datum>, is: (d: Datum) => boolean): boolean {
  for (const value of values) {
    if (value == null) continue;
    if (!is(value)) return false;
  }
  return true;
}

// Mostly relies on d3-color, with a few extra color keywords. Currently this
// strictly requires that the value be a string; we might want to apply string
// coercion here, though note that d3-color instances would need to support
// valueOf to work correctly with InternMap.
// https://www.w3.org/TR/SVG11/painting.html#SpecifyingPaint
export function isColor<T extends Datum>(v: ValueAccessor<T> | undefined): v is string {
  if (typeof v !== "string") return false;
  const value = v.toLowerCase().trim();
  return (
    value === "none" ||
    value === "currentcolor" ||
    (value.startsWith("url(") && value.endsWith(")")) || // <funciri>, e.g. pattern or gradient
    (value.startsWith("var(") && value.endsWith(")")) || // CSS variable
    color(value) !== null
  );
}

export function isNoneish<T extends Datum>(value: ValueAccessor<T> | undefined): boolean {
  return value == null || isNone(value);
}

export function isNone<T extends Datum>(value: ValueAccessor<T> | undefined): boolean {
  return /^\s*none\s*$/i.test(value as string);
}

export function isRound(value: string | undefined): boolean {
  return /^\s*round\s*$/i.test(value as string);
}

export function maybeFrameAnchor(value = "middle"): string {
  return keyword(value, "frameAnchor", [
    "middle",
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left"
  ]);
}

// Like a sort comparator, returns a positive value if the given array of values
// is in ascending order, a negative value if the values are in descending
// order. Assumes monotonicity; only tests the first and last values.
export function order(
  values: null | undefined | string[] | number[] | Float32Array | Float64Array
): number | undefined {
  if (values == null) return;
  const first = values[0];
  const last = values[values.length - 1];
  return descending(first, last);
}

// Unlike {...defaults, ...options}, this ensures that any undefined (but
// present) properties in options inherit the given default value.
export function inherit(options: Record<string, any> = {}, ...rest: Array<Record<string, any>>) {
  let o = options;
  for (const defaults of rest) {
    for (const key in defaults) {
      if (o[key] === undefined) {
        const value = defaults[key];
        if (o === options) o = {...o, [key]: value};
        else o[key] = value;
      }
    }
  }
  return o;
}

// Given an iterable of named things (objects with a name property), returns a
// corresponding object with properties associated with the given name.
export function Named(things: any): {[k: string]: unknown} {
  console.warn("named iterables are deprecated; please use an object instead");
  const names = new Set();
  return Object.fromEntries(
    Array.from(things, (thing) => {
      const {name} = thing as {name: string};
      if (name == null) throw new Error("missing name");
      const key = `${name}`;
      if (key === "__proto__") throw new Error(`illegal name: ${key}`);
      if (names.has(key)) throw new Error(`duplicate name: ${key}`);
      names.add(key);
      return [name, thing];
    })
  );
}

export function maybeNamed(things: any): any {
  return isIterable(things) ? Named(things) : things;
}