import { JSProseElementAny } from './element';
import { JSProseRef } from './ref';
import { JSProseError } from './error';

export interface JSProseDocument<
    TRefs extends Record<string, JSProseRef<any>>,
    TContent extends JSProseElementAny,
> {
    refs: TRefs;
    content: TContent;
}

export function defineDocument<
    TRefs extends Record<string, JSProseRef<any>>,
    TContent extends JSProseElementAny,
>(options: {
    refs: TRefs;
    content: (refs: TRefs) => TContent;
}): JSProseDocument<TRefs, TContent>;

export function defineDocument<TContent extends JSProseElementAny>(options: {
    content: () => TContent;
}): JSProseDocument<{}, TContent>;

export function defineDocument<
    TRefs extends Record<string, JSProseRef<any>>,
    TContent extends JSProseElementAny,
>(options: {
    refs?: TRefs;
    content: (refs?: TRefs) => TContent;
}): JSProseDocument<TRefs | {}, TContent> {
    const refs = options.refs || ({} as TRefs);
    const content = options.content(refs);

    if (options.refs) {
        for (const [key, ref] of Object.entries(refs)) {
            const assignedElement = (ref as JSProseRef<any>).element;

            if (!assignedElement) {
                const refObj = ref as JSProseRef<any>;
                const refSlug = refObj.slug ? ` "${refObj.slug}"` : ` "${key}"`;
                throw new JSProseError(
                    `Document reference${refSlug} was not assigned a value in the content function!`,
                );
            }
        }
    }

    return {
        refs,
        content,
    };
}
