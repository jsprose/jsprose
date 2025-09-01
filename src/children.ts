// Unfortunately, TypeScript jsx is not returning the exact type with generics.
// No matter what tag you use, it will be casted to general JSProseElement loosing all generics.
// This prevents some cool compile/editor time checkings like prohibiting certain tags in specific contexts (blocks in inliners and etc.)
// All this has to be done in runtime or with other tools, like eslint.
// @see https://github.com/microsoft/TypeScript/issues/21699

import { JSProseElementAny } from './element';
import { JSProseRef } from './ref';

type ConstructTagChildren<Types extends readonly any[]> =
    | Types[number]
    | { [K in keyof Types]: Types[K][] }[number]
    | Types[number][];

export type JSProseTagChildren = ConstructTagChildren<
    [string, JSProseElementAny, JSProseRef<any>]
>;

export type JSProseNormalizedChildren = JSProseElementAny[];

export type WithTagChildren<T> = Omit<T, 'children'> & {
    children?: JSProseTagChildren;
};

export type WithNormalizedChildren<T> = Omit<T, 'children'> & {
    children?: JSProseNormalizedChildren;
};
