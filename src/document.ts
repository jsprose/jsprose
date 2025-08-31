import { JSProseTag } from './tag';
import { JSProseElement } from './element';
import { jsproseRef, JSProseRef } from './ref';
import { JSProseError } from './error';

export interface JSProseDocument<
    TRefs extends Record<string, JSProseRef<any>>,
    TBlocks extends JSProseElement<any, any, any>,
> {
    refs: TRefs;
    blocks: TBlocks;
}

export function defineDocument<
    TRefDefs extends Record<string, JSProseTag<any, any>>,
    TRefs extends {
        [K in keyof TRefDefs]: JSProseRef<ReturnType<TRefDefs[K]>>;
    },
    TBlocks extends JSProseElement<any, any, any>,
>(options: {
    refs?: TRefDefs;
    blocks: (refs: TRefs) => TBlocks;
}): JSProseDocument<TRefs, TBlocks>;

export function defineDocument<
    TRefDefs extends Record<string, JSProseTag<any, any>>,
    TRefs extends {
        [K in keyof TRefDefs]: JSProseRef<ReturnType<TRefDefs[K]>>;
    },
    TBlocks extends JSProseElement<any, any, any>,
>(options: {
    refs?: TRefDefs;
    blocks: (refs?: TRefs) => TBlocks;
}): JSProseDocument<TRefs | {}, TBlocks> {
    const refs = {} as TRefs;

    if (options.refs) {
        for (const [key, tag] of Object.entries(options.refs)) {
            (refs as any)[key] = jsproseRef(tag);
        }
    }

    const blocks = options.blocks(refs);

    if (options.refs) {
        for (const [key, ref] of Object.entries(refs)) {
            const assignedElement = (ref as JSProseRef<any>).element;

            if (!assignedElement) {
                throw new JSProseError(
                    `Document reference "${key}" was not assigned a value in the blocks function!`,
                );
            }
        }
    }

    return {
        refs,
        blocks,
    };
}
