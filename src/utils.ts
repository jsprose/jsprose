import { JSProseNormalizedChildren } from './children';
import { JSProseBlock, JSProseElementAny, JSProseInliner } from './element';
import { JSProseError } from './error';
import { JSProseTag } from './tag';

export function isTagElement<TElement extends JSProseElementAny, TProps>(
    element: any,
    tag: JSProseTag<TElement, TProps>,
): element is TElement {
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

export function validateInlinerChildren(
    inlinerElementName: string,
    children: JSProseNormalizedChildren,
): void {
    for (const child of children) {
        if (isBlockElement(child)) {
            throw new JSProseError(
                `Inliner element <${inlinerElementName}> can not contain block element <${child.name}>!`,
            );
        }
    }
}
