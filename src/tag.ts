import {
    JSProseBlock,
    JSProseElementAny,
    JSProseInliner,
    JSProseType,
    createElement,
} from './element';
import { WithNormalizedChildren, WithTagChildren } from './children';
import { JSProseRef } from './ref';

export interface JSProseGlobalProps<
    TJSProseElement extends JSProseElementAny = JSProseElementAny,
> {
    $ref?: JSProseRef<TJSProseElement>;
}

export type JSProseTagProps<
    TJSProseElement extends JSProseElementAny,
    TProps = {},
> = WithTagChildren<TProps> & JSProseGlobalProps<TJSProseElement>;

export type JSProseNormalizedProps<
    TJSProseElement extends JSProseElementAny,
    TProps = {},
> = WithNormalizedChildren<TProps> & JSProseGlobalProps<TJSProseElement>;

export type JSProseTag<
    TJSProseElement extends JSProseElementAny,
    TProps = {},
> = ((props: JSProseTagProps<TJSProseElement, TProps>) => TJSProseElement) & {
    type: TJSProseElement['type'];
    name: TJSProseElement['name'];
};

function defineTag<TElement extends JSProseElementAny, TProps = {}>(
    type: JSProseType,
    name: string,
    createData: (props: JSProseNormalizedProps<TElement, TProps>) => any,
): JSProseTag<TElement, TProps> {
    const tag = (props: JSProseTagProps<TElement, TProps>) => {
        const data = createData(
            props as JSProseNormalizedProps<TElement, TProps>,
        );

        // @ts-expect-error
        const element = createElement<TElement>({
            type,
            name,
            data,
        });

        if (props.$ref) {
            props.$ref.element = element;
        }

        return element;
    };

    Object.defineProperties(tag, {
        type: { value: type, enumerable: true },
        name: { value: name, enumerable: true },
    });

    return tag as JSProseTag<TElement, TProps>;
}

export function defineBlockTag<
    TElement extends JSProseBlock<string, any>,
    TProps = {},
>(
    name: TElement['name'],
    createData: (
        props: JSProseNormalizedProps<TElement, TProps>,
    ) => TElement['data'],
): JSProseTag<TElement, TProps> {
    return defineTag<TElement, TProps>('block', name, createData);
}

export function defineInlinerTag<
    TElement extends JSProseInliner<string, any>,
    TProps = {},
>(
    name: TElement['name'],
    createData: (
        props: JSProseNormalizedProps<TElement, TProps>,
    ) => TElement['data'],
): JSProseTag<TElement, TProps> {
    return defineTag('inliner', name, createData) as unknown as JSProseTag<
        TElement,
        TProps
    >;
}
