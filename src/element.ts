declare const __JSProseBlockBrand: unique symbol;
declare const __JSProseInlinerBrand: unique symbol;
declare const __JSProseElementNameBrand: unique symbol;

export type JSProseType = 'block' | 'inliner';

export type JSProseElement<
    TElementType extends JSProseType,
    TElementName extends string,
    TData = undefined,
> = {
    data: TData;
    type: TElementType;
    name: TElementName;
    readonly [__JSProseElementNameBrand]: TElementName;
} & (TElementType extends 'block'
    ? { readonly [__JSProseBlockBrand]: true }
    : { readonly [__JSProseInlinerBrand]: true });

export type JSProseElementAny = JSProseElement<JSProseType, string, any>;

export type JSProseBlock<
    TName extends string,
    TData = undefined,
> = JSProseElement<'block', TName, TData>;

export type JSProseInliner<
    TName extends string,
    TData = undefined,
> = JSProseElement<'inliner', TName, TData>;

export function createElement<TJSProseElement extends JSProseElementAny>(
    element: Omit<
        TJSProseElement,
        | typeof __JSProseBlockBrand
        | typeof __JSProseInlinerBrand
        | typeof __JSProseElementNameBrand
    >,
): TJSProseElement {
    return element as TJSProseElement;
}
