// Unfortunately, TypeScript jsx is not returning the exact type with generics.
// No matter what tag you use, it will be casted to general JSProseElement loosing all generics.
// This prevents some cool compile/editor time checkings like prohibiting certain tags in specific contexts (blocks in inliners and etc.)
// @see https://github.com/microsoft/TypeScript/issues/21699

import { JSProseElement } from './element';
import { JSProseRef } from './ref';

type ConstructTagChildren<Types extends readonly any[]> =
    | Types[number]
    | { [K in keyof Types]: Types[K][] }[number]
    | Types[number][];

export type JSProseTagChildren = ConstructTagChildren<
    [string, JSProseElement<any, any, any>, JSProseRef<any>]
>;

export type JSProseNormalizedChildren = JSProseElement<any, any, any>[];

export type WithTagChildren<T> = Omit<T, 'children'> & {
    children?: JSProseTagChildren;
};

export type WithNormalizedChildren<T> = Omit<T, 'children'> & {
    children?: JSProseNormalizedChildren;
};
