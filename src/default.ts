import { JSProseBlock, JSProseInliner } from './element';
import { defineBlockTag, defineInlinerTag } from './tag';
import { isBlockElement, isInlinerElement, isTagElement } from './utils';

//
// Text
//

export const textName = 'text';
export type TextElement = JSProseInliner<typeof textName, string>;
export const Text = defineInlinerTag<TextElement>(textName, (props) => {
    const children = props.children ?? [];

    if (children.length === 0) {
        throw '<Text> cannot be empty!';
    }

    let concatenated = '';

    for (const child of children) {
        if (typeof child === 'string') {
            concatenated += child;
        } else if (isTagElement(child, Text)) {
            concatenated += child.data;
        } else {
            throw '<Text> can only contain <Text> elements or pure strings!';
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
            throw '<Paragraph> cannot be empty!';
        }

        for (const child of children) {
            if (isBlockElement(child)) {
                throw `<Paragraph> can contain only inliners! Block <${child.name}> found!`;
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
        throw '<Blocks> cannot be empty!';
    }

    for (const child of children) {
        if (isInlinerElement(child)) {
            throw `<Blocks> can contain only blocks! Inliner <${child.name}> found!`;
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
            throw '<Inliners> cannot be empty!';
        }

        for (const child of children) {
            if (isBlockElement(child)) {
                throw `<Inliners> can contain only inliners! Block <${child.name}> found!`;
            }
        }

        return children as JSProseInliner<any, any>[];
    },
);
