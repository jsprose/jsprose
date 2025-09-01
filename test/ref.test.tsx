import { describe, it, expect } from 'vitest';

import {
    Blocks,
    Paragraph,
    paragraphName,
    textName,
    BlocksElement,
    blocksName,
    Text,
} from '../src';
import { defineRef, defineRefs, toElement } from '../src/ref';

describe('References', () => {
    it('should assign element via $ref attribute', () => {
        const paragraphRef = defineRef(Paragraph);

        <Blocks>
            <Paragraph>Block Paragraph 1</Paragraph>
            <Paragraph $ref={paragraphRef}>Block Paragraph 2</Paragraph>
        </Blocks>;

        const refParagraphElement = toElement(paragraphRef)!;

        expect(refParagraphElement).toBeDefined();
        expect(refParagraphElement).toMatchObject({
            type: 'block',
            name: paragraphName,
            data: [
                {
                    type: 'inliner',
                    name: textName,
                    data: 'Block Paragraph 2',
                },
            ],
        });
    });

    it('should insert and automatically unwrap $ref element in JSX', () => {
        const MyParagraph = defineRef(Paragraph);

        const blocks = (
            <Blocks>
                <Paragraph $ref={MyParagraph}>Block Paragraph 1</Paragraph>
                <Paragraph>Block Paragraph 2</Paragraph>
                {MyParagraph}
            </Blocks>
        ) as BlocksElement;

        expect(blocks).toMatchObject({
            type: 'block',
            name: blocksName,
        });
        expect(blocks.data).toHaveLength(3);
        expect(blocks.data[2]).toMatchObject({
            type: 'block',
            name: paragraphName,
            data: [
                {
                    type: 'inliner',
                    name: textName,
                    data: 'Block Paragraph 1',
                },
            ],
        });
    });

    it('should throw when trying to unwrap undefined reference in JSX', () => {
        const UndefinedParagraph = defineRef(Paragraph);
        expect(() => {
            <Blocks>{UndefinedParagraph}</Blocks>;
        }).toThrow('Unable to unwrap undefined JSProse reference!');
    });

    it('should throw when trying to reassign an already assigned reference', () => {
        const paragraphRef = defineRef(Paragraph);

        <Paragraph $ref={paragraphRef}>First assignment</Paragraph>;

        expect(() => {
            <Paragraph $ref={paragraphRef}>Second assignment</Paragraph>;
        }).toThrow(
            'Reference for tag <paragraph> is already assigned and cannot be reassigned!',
        );
    });

    it('should throw when assigning wrong element type to reference', () => {
        const paragraphRef = defineRef(Paragraph);

        expect(() => {
            paragraphRef.element = {
                type: 'inliner',
                name: 'text',
                data: 'wrong type',
            } as any;
        }).toThrow(
            'Element assigned to reference does not match expected tag <paragraph>!',
        );
    });

    it('should infer element type from tag automatically', () => {
        const paragraphRef = defineRef(Paragraph);

        <Paragraph $ref={paragraphRef}>Test content</Paragraph>;

        const element = toElement(paragraphRef)!;
        expect(element.type).toBe('block');
        expect(element.name).toBe('paragraph');
        expect(element.data[0].data).toBe('Test content');
    });

    it('should create ref with slug property', () => {
        const paragraphRef = defineRef(Paragraph, 'my-paragraph');

        expect(paragraphRef.slug).toBe('my-paragraph');
        expect(paragraphRef.tag).toBe(Paragraph);
        expect(paragraphRef.url).toBeDefined();
        expect(typeof paragraphRef.url).toBe('string');
    });

    it('should create ref without slug property', () => {
        const paragraphRef = defineRef(Paragraph);

        expect(paragraphRef.slug).toBeUndefined();
        expect(paragraphRef.tag).toBe(Paragraph);
        expect(paragraphRef.url).toBeDefined();
        expect(typeof paragraphRef.url).toBe('string');
    });

    it('should have url property with import.meta.url', () => {
        const paragraphRef = defineRef(Paragraph, 'test-slug');

        expect(paragraphRef.url).toBeDefined();
        expect(typeof paragraphRef.url).toBe('string');
        expect(paragraphRef.url.length).toBeGreaterThan(0);
    });
});

describe('defineRefs', () => {
    it('should create multiple refs from tag definitions', () => {
        const refDefs = {
            title: Paragraph,
            content: Paragraph,
            link: Text,
        };

        const refs = defineRefs(refDefs);

        expect(refs.title).toBeDefined();
        expect(refs.content).toBeDefined();
        expect(refs.link).toBeDefined();

        expect(refs.title.tag).toBe(Paragraph);
        expect(refs.content.tag).toBe(Paragraph);
        expect(refs.link.tag).toBe(Text);
    });

    it('should create refs with slug matching the key', () => {
        const refDefs = {
            header: Paragraph,
            footer: Text,
        };

        const refs = defineRefs(refDefs);

        expect(refs.header.slug).toBe('header');
        expect(refs.footer.slug).toBe('footer');
    });

    it('should create refs with url property', () => {
        const refDefs = {
            main: Paragraph,
            sidebar: Text,
        };

        const refs = defineRefs(refDefs);

        expect(refs.main.url).toBeDefined();
        expect(refs.sidebar.url).toBeDefined();
        expect(typeof refs.main.url).toBe('string');
        expect(typeof refs.sidebar.url).toBe('string');
    });

    it('should allow assignment to elements created from defineRefs', () => {
        const refDefs = {
            testParagraph: Paragraph,
        };

        const refs = defineRefs(refDefs);

        <Paragraph $ref={refs.testParagraph}>Test content</Paragraph>;

        const element = toElement(refs.testParagraph)!;
        expect(element).toBeDefined();
        expect(element.type).toBe('block');
        expect(element.name).toBe('paragraph');
        expect(element.data[0].data).toBe('Test content');
    });

    it('should maintain ref properties after element assignment', () => {
        const refDefs = {
            namedParagraph: Paragraph,
        };

        const refs = defineRefs(refDefs);

        <Paragraph $ref={refs.namedParagraph}>Content</Paragraph>;

        expect(refs.namedParagraph.slug).toBe('namedParagraph');
        expect(refs.namedParagraph.url).toBeDefined();
        expect(refs.namedParagraph.element).toBeDefined();
    });

    it('should handle empty ref definitions', () => {
        const refs = defineRefs({});

        expect(Object.keys(refs)).toHaveLength(0);
    });

    it('should maintain type safety for ref map', () => {
        const refDefs = {
            p1: Paragraph,
            p2: Paragraph,
            t1: Text,
        };

        const refs = defineRefs(refDefs);

        <Paragraph $ref={refs.p1}>Content 1</Paragraph>;
        <Paragraph $ref={refs.p2}>Content 2</Paragraph>;
        <Text $ref={refs.t1}>Text content</Text>;

        expect(toElement(refs.p1)?.type).toBe('block');
        expect(toElement(refs.p2)?.type).toBe('block');
        expect(toElement(refs.t1)?.type).toBe('inliner');
    });
});
