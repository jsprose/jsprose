import { JSProseElementAny } from './element';
import { JSProseError } from './error';
import { JSProseTag } from './tag';
import { isTagElement } from './utils';

export const JSProseRefSymbol = Symbol('JSProseRef');

export interface JSProseRef<TElement extends JSProseElementAny> {
    element?: TElement;
    readonly tag: JSProseTag<TElement, any>;
    readonly slug?: string;
    readonly url?: string;
    [JSProseRefSymbol]: undefined;
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
>(options: { tag: TTag; slug?: string; url?: string }): JSProseRef<TElement> {
    let _element: TElement | undefined = undefined;

    return {
        [JSProseRefSymbol]: undefined,
        tag: options.tag as JSProseTag<TElement, any>,
        slug: options.slug,
        url: options.url,
        get element() {
            return _element;
        },
        set element(value: TElement | undefined) {
            if (value !== undefined) {
                if (_element !== undefined) {
                    const refSlug = options.slug ? ` "${options.slug}"` : '';
                    throw new JSProseError(
                        `Reference${refSlug} for tag <${options.tag.name}> is already assigned and cannot be reassigned!`,
                    );
                }
                if (!isTagElement(value, options.tag)) {
                    const refSlug = options.slug ? ` "${options.slug}"` : '';
                    throw new JSProseError(
                        `Element assigned to reference${refSlug} does not match expected tag <${options.tag.name}>!`,
                    );
                }
            }
            _element = value;
        },
    };
}

export function defineRefs<TRefDefs extends JSProseRefDefs>(options: {
    defs: TRefDefs;
    url?: string;
}): JSProseRefMap<TRefDefs> {
    const definedRefs = {} as any;

    for (const [key, tag] of Object.entries(options.defs)) {
        definedRefs[key] = defineRef({ tag, slug: key, url: options.url });
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
