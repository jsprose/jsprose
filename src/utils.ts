import {
    JSProseBlock,
    JSProseElement,
    JSProseInliner,
    JSProseType,
} from './element';
import { JSProseTag } from './tag';

export function isTagElement<
    TElement extends JSProseElement<JSProseType, string, any>,
    TProps,
>(element: any, tag: JSProseTag<TElement, TProps>): element is TElement {
    return element?.type === tag.type && element?.name === tag.name;
}

export function isBlockElement(
    element: any,
): element is JSProseBlock<any, any> {
    return element?.type === 'block';
}

export function isInlinerElement(
    element: any,
): element is JSProseInliner<any, any> {
    return element?.type === 'inliner';
}
