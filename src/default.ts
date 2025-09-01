import { JSProseBlock, JSProseInliner } from './element';
import { JSProseError } from './error';
import { JSProseRef } from './ref';
import { defineBlockTag, defineInlinerTag } from './tag';
import { isBlockElement, isInlinerElement, isRef, isTagElement } from './utils';

//
// Text
//

export const textName = 'text';
export type TextElement = JSProseInliner<typeof textName, string>;
export const Text = defineInlinerTag<TextElement>(textName, (props) => {
    const children = props.children ?? [];

    if (children.length === 0) {
        throw new JSProseError('<Text> cannot be empty!');
    }

    let concatenated = '';

    for (const child of children) {
        if (typeof child === 'string') {
            concatenated += child;
        } else if (isTagElement(child, Text)) {
            concatenated += child.data;
        } else {
            throw new JSProseError(
                '<Text> can only contain <Text> elements or pure strings!',
            );
        }
    }

    return concatenated;
});

//
// Paragraph
//

export const paragraphName = 'paragraph';
export type ParagraphElement = JSProseBlock<
    typeof paragraphName,
    JSProseInliner<any, any>[]
>;
export const Paragraph = defineBlockTag<ParagraphElement>(
    paragraphName,
    (props) => {
        const children = props.children ?? [];

        if (children.length === 0) {
            throw new JSProseError('<Paragraph> cannot be empty!');
        }

        for (const child of children) {
            if (isBlockElement(child)) {
                throw new JSProseError(
                    `<Paragraph> can contain only inliners! Block <${child.name}> found!`,
                );
            }
        }

        return children as JSProseInliner<any, any>[];
    },
);

//
// Blocks
//

export const blocksName = 'blocks';
export type BlocksElement = JSProseBlock<
    typeof blocksName,
    JSProseBlock<any, any>[]
>;
export const Blocks = defineBlockTag<BlocksElement>(blocksName, (props) => {
    const children = props.children ?? [];

    if (children.length === 0) {
        throw new JSProseError('<Blocks> cannot be empty!');
    }

    for (const child of children) {
        if (isInlinerElement(child)) {
            throw new JSProseError(
                `<Blocks> can contain only blocks! Inliner <${child.name}> found!`,
            );
        }
    }

    return children as JSProseBlock<any, any>[];
});

//
// Inliners
//

export const inlinersName = 'inliners';
export type InlinersElement = JSProseInliner<
    typeof inlinersName,
    JSProseInliner<any, any>[]
>;
export const Inliners = defineInlinerTag<InlinersElement>(
    inlinersName,
    (props) => {
        const children = props.children ?? [];

        if (children.length === 0) {
            throw new JSProseError('<Inliners> cannot be empty!');
        }

        for (const child of children) {
            if (isBlockElement(child)) {
                throw new JSProseError(
                    `<Inliners> can contain only inliners! Block <${child.name}> found!`,
                );
            }
        }

        return children as JSProseInliner<any, any>[];
    },
);

//
// Link
//

export const linkName = 'link';
export type LinkElement = JSProseInliner<
    typeof linkName,
    { ref: JSProseRef<any>; label: string }
>;
export const Link = defineInlinerTag<LinkElement, { to: JSProseRef<any> }>(
    linkName,
    (props) => {
        const { to, children } = props;

        if (!to) {
            throw new JSProseError('Missing "to" prop in <Link> tag!');
        }

        if (!isRef(to)) {
            throw new JSProseError(
                '<Link> "to" prop must be a valid reference!',
            );
        }

        if (!children || children.length !== 1) {
            throw new JSProseError(
                '<Link> must have exactly one <Text> child!',
            );
        }

        const child = children[0];
        if (!isTagElement(child, Text)) {
            throw new JSProseError('<Link> child must be a <Text> element!');
        }

        return {
            ref: to,
            label: child.data,
        };
    },
);
