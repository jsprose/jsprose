import { JSProseElementAny } from './element';
import { JSProseError } from './error';
import { JSProseTag } from './tag';
import { isTagElement } from './utils';

export interface JSProseRef<TElement extends JSProseElementAny> {
    element?: TElement;
    readonly tag: JSProseTag<TElement, any>;
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
    TElement extends ReturnType<TTag>,
>(tag: TTag, slug?: string): JSProseRef<TElement> {
    let _element: TElement | undefined = undefined;

    return {
        tag: tag as JSProseTag<TElement, any>,
        slug,
        url: import.meta.url,
        get element() {
            return _element;
        },
        set element(value: TElement | undefined) {
            if (value !== undefined) {
                if (_element !== undefined) {
                    const refSlug = slug ? ` "${slug}"` : '';
                    throw new JSProseError(
                        `Reference${refSlug} for tag <${tag.name}> is already assigned and cannot be reassigned!`,
                    );
                }
                if (!isTagElement(value, tag)) {
                    const refSlug = slug ? ` "${slug}"` : '';
                    throw new JSProseError(
                        `Element assigned to reference${refSlug} does not match expected tag <${tag.name}>!`,
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

export function toElement<TElement extends JSProseElementAny>(
    ref: JSProseRef<TElement>,
): TElement | undefined {
    return ref.element;
}

export function toElements(
    refs: JSProseRef<JSProseElementAny>[],
): (JSProseElementAny | undefined)[] {
    return refs.map((ref) => ref.element);
}
