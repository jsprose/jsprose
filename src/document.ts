import { JSProseElement } from './element';
import { defineRefs, JSProseRef, JSProseRefDefs, JSProseRefMap } from './ref';
import { JSProseError } from './error';

export interface JSProseDocument<
    TRefs extends Record<string, JSProseRef<any>>,
    TBlocks extends JSProseElement<any, any, any>,
> {
    refs: TRefs;
    blocks: TBlocks;
}

export function defineDocument<
    TRefDefs extends JSProseRefDefs,
    TRefs extends JSProseRefMap<TRefDefs>,
    TBlocks extends JSProseElement<any, any, any>,
>(options: {
    refs: TRefDefs;
    blocks: (refs: TRefs) => TBlocks;
}): JSProseDocument<TRefs, TBlocks>;

export function defineDocument<
    TBlocks extends JSProseElement<any, any, any>,
>(options: { blocks: () => TBlocks }): JSProseDocument<{}, TBlocks>;

export function defineDocument<
    TRefDefs extends JSProseRefDefs,
    TRefs extends JSProseRefMap<TRefDefs>,
    TBlocks extends JSProseElement<any, any, any>,
>(options: {
    refs?: TRefDefs;
    blocks: (refs?: TRefs) => TBlocks;
}): JSProseDocument<TRefs | {}, TBlocks> {
    let refs = {} as TRefs;

    if (options.refs) {
        refs = defineRefs(options.refs) as TRefs;
    }

    const blocks = options.blocks(refs);

    if (options.refs) {
        for (const [key, ref] of Object.entries(refs)) {
            const assignedElement = (ref as JSProseRef<any>).element;

            if (!assignedElement) {
                const refObj = ref as JSProseRef<any>;
                const refSlug = refObj.slug ? ` "${refObj.slug}"` : ` "${key}"`;
                throw new JSProseError(
                    `Document reference${refSlug} was not assigned a value in the blocks function!`,
                );
            }
        }
    }

    return {
        refs,
        blocks,
    };
}
