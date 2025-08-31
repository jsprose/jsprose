import { JSProseElement } from './element';
import { JSProseError } from './error';
import { JSProseTag } from './tag';
import { isTagElement } from './utils';

export interface JSProseRef<
    TJSProseElement extends JSProseElement<any, any, any>,
> {
    element?: TJSProseElement;
    readonly tag: JSProseTag<TJSProseElement, any>;
}

export function jsproseRef<
    TTag extends JSProseTag<any, any>,
    TJSProseElement extends ReturnType<TTag>,
>(tag: TTag): JSProseRef<TJSProseElement> {
    let _element: TJSProseElement | undefined = undefined;

    return {
        tag: tag as JSProseTag<TJSProseElement, any>,
        get element() {
            return _element;
        },
        set element(value: TJSProseElement | undefined) {
            if (value !== undefined) {
                if (_element !== undefined) {
                    throw new JSProseError(
                        `Reference for tag <${tag.name}> is already assigned and cannot be reassigned!`,
                    );
                }
                if (!isTagElement(value, tag)) {
                    throw new JSProseError(
                        `Element assigned to reference does not match expected tag <${tag.name}>!`,
                    );
                }
            }
            _element = value;
        },
    };
}

export function toElement<
    TJSProseElement extends JSProseElement<any, any, any>,
>(ref: JSProseRef<TJSProseElement>): TJSProseElement | undefined {
    return ref.element;
}

export function toElements(
    refs: JSProseRef<JSProseElement<any, any, any>>[],
): (JSProseElement<any, any, any> | undefined)[] {
    return refs.map((ref) => ref.element);
}
