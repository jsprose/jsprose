import { JSProseElement } from './element';
import { JSProseError } from './error';
import { JSProseTag } from './tag';
import { isTagElement } from './utils';

export interface JSProseRef<
    TJSProseElement extends JSProseElement<any, any, any>,
> {
    element?: TJSProseElement;
    readonly tag: JSProseTag<TJSProseElement, any>;
    readonly slug?: string;
    readonly url: string;
}

export type JSProseRefDefs = {
    [key: string]: JSProseTag<any, any>;
};

export type JSProseRefMap<TRefDefs extends JSProseRefDefs> = {
    [K in keyof TRefDefs]: JSProseRef<ReturnType<TRefDefs[K]>>;
};

export function defineRef<
    TTag extends JSProseTag<any, any>,
    TJSProseElement extends ReturnType<TTag>,
>(tag: TTag, slug?: string): JSProseRef<TJSProseElement> {
    let _element: TJSProseElement | undefined = undefined;

    return {
        tag: tag as JSProseTag<TJSProseElement, any>,
        slug,
        url: import.meta.url,
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

export function defineRefs<TRefDefs extends JSProseRefDefs>(
    refs: TRefDefs,
): JSProseRefMap<TRefDefs> {
    const definedRefs = {} as any;

    for (const [key, tag] of Object.entries(refs)) {
        definedRefs[key] = defineRef(tag, key);
    }

    return definedRefs;
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
