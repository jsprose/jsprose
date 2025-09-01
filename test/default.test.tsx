import { describe, it, expect } from 'vitest';

import {
    Text,
    TextElement,
    textName,
    Paragraph,
    ParagraphElement,
    paragraphName,
    Blocks,
    blocksName,
    Inliners,
    inlinersName,
} from '../src/default';
import { createElement, JSProseBlock, JSProseInliner } from '../src/element';

describe('Default', () => {
    describe('Text component', () => {
        it('should have correct name and type', () => {
            expect(Text.name).toBe(textName);
            expect(Text.type).toBe('inliner');
            expect(textName).toBe('text');
        });

        it('should create text element from string children using JSX', () => {
            const element = <Text>Hello world</Text>;

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('text');
            expect(element.data).toBe('Hello world');
        });

        it('should create text element from string children using function call', () => {
            const element = Text({ children: 'Hello world' });

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('text');
            expect(element.data).toBe('Hello world');
        });

        it('should concatenate multiple text children using JSX', () => {
            const textChild1 = <Text>Hello </Text>;
            const textChild2 = <Text>world!</Text>;

            const element = <Text>{[textChild1, textChild2]}</Text>;

            expect(element.data).toBe('Hello world!');
        });

        it('should concatenate multiple text children using function call', () => {
            const textChild1 = createElement<TextElement>({
                type: 'inliner',
                name: 'text',
                data: 'Hello ',
            });

            const textChild2 = createElement<TextElement>({
                type: 'inliner',
                name: 'text',
                data: 'world!',
            });

            const element = Text({ children: [textChild1, textChild2] });

            expect(element.data).toBe('Hello world!');
        });

        it('should throw error when empty', () => {
            expect(() => Text({})).toThrow('<Text> cannot be empty!');
            expect(() => Text({ children: [] })).toThrow(
                '<Text> cannot be empty!',
            );
        });

        it('should throw error when containing non-text elements', () => {
            const nonTextElement = createElement<
                JSProseInliner<'other', string>
            >({
                type: 'inliner',
                name: 'other',
                data: 'other data',
            });

            expect(() => Text({ children: [nonTextElement] as any })).toThrow(
                '<Text> can only contain <Text> elements or pure strings!',
            );
        });
    });

    describe('Paragraph component', () => {
        it('should have correct name and type', () => {
            expect(Paragraph.name).toBe(paragraphName);
            expect(Paragraph.type).toBe('block');
            expect(paragraphName).toBe('paragraph');
        });

        it('should create paragraph element with inliner children using JSX', () => {
            const element = (
                <Paragraph>
                    <Text>Hello</Text>
                </Paragraph>
            );

            expect(element.type).toBe('block');
            expect(element.name).toBe('paragraph');
            expect(element.data).toHaveLength(1);
            expect(element.data[0].type).toBe('inliner');
            expect(element.data[0].name).toBe('text');
            expect(element.data[0].data).toBe('Hello');
        });

        it('should create paragraph element with inliner children using function call', () => {
            const textElement = createElement<TextElement>({
                type: 'inliner',
                name: 'text',
                data: 'Hello',
            });

            const element = Paragraph({ children: [textElement] });

            expect(element.type).toBe('block');
            expect(element.name).toBe('paragraph');
            expect(element.data).toHaveLength(1);
            expect(element.data[0]).toBe(textElement);
        });

        it('should accept multiple inliner children using JSX', () => {
            const element = (
                <Paragraph>
                    <Text>Hello</Text>
                    <Text>world!</Text>
                </Paragraph>
            );

            expect(element.data).toHaveLength(2);
            expect(element.data[0].data).toBe('Hello');
            expect(element.data[1].data).toBe('world!');
        });

        it('should accept multiple inliner children using function call', () => {
            const text1 = createElement<TextElement>({
                type: 'inliner',
                name: 'text',
                data: 'Hello',
            });

            const text2 = createElement<JSProseInliner<'emphasis', string>>({
                type: 'inliner',
                name: 'emphasis',
                data: 'emphasized',
            });

            const element = Paragraph({ children: [text1, text2] });

            expect(element.data).toHaveLength(2);
            expect(element.data[0]).toBe(text1);
            expect(element.data[1]).toBe(text2);
        });

        it('should handle string children directly in JSX', () => {
            const element = <Paragraph>Hello world!</Paragraph>;

            expect(element.type).toBe('block');
            expect(element.name).toBe('paragraph');
            expect(element.data).toHaveLength(1);
            expect(element.data[0].type).toBe('inliner');
            expect(element.data[0].name).toBe('text');
            expect(element.data[0].data).toBe('Hello world!');
        });

        it('should throw error when empty', () => {
            expect(() => Paragraph({})).toThrow('<Paragraph> cannot be empty!');
            expect(() => Paragraph({ children: [] })).toThrow(
                '<Paragraph> cannot be empty!',
            );
        });

        it('should throw error when containing block elements', () => {
            const blockElement = createElement<JSProseBlock<'block', string>>({
                type: 'block',
                name: 'block',
                data: 'block data',
            });

            expect(() =>
                Paragraph({ children: [blockElement] as any }),
            ).toThrow(
                '<Paragraph> can contain only inliners! Block <block> found!',
            );
        });
    });

    describe('Blocks component', () => {
        it('should have correct name and type', () => {
            expect(Blocks.name).toBe(blocksName);
            expect(Blocks.type).toBe('block');
            expect(blocksName).toBe('blocks');
        });

        it('should create blocks element with block children using JSX', () => {
            const element = (
                <Blocks>
                    <Paragraph>
                        <Text>Hello</Text>
                    </Paragraph>
                </Blocks>
            );

            expect(element.type).toBe('block');
            expect(element.name).toBe('blocks');
            expect(element.data).toHaveLength(1);
            expect(element.data[0].type).toBe('block');
            expect(element.data[0].name).toBe('paragraph');
        });

        it('should create blocks element with block children using function call', () => {
            const paragraphElement = createElement<ParagraphElement>({
                type: 'block',
                name: 'paragraph',
                data: [],
            });

            const element = Blocks({ children: [paragraphElement] });

            expect(element.type).toBe('block');
            expect(element.name).toBe('blocks');
            expect(element.data).toHaveLength(1);
            expect(element.data[0]).toBe(paragraphElement);
        });

        it('should accept multiple block children using JSX', () => {
            const element = (
                <Blocks>
                    <Paragraph>
                        <Text>First paragraph</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text>Second paragraph</Text>
                    </Paragraph>
                </Blocks>
            );

            expect(element.data).toHaveLength(2);
            expect(element.data[0].name).toBe('paragraph');
            expect(element.data[1].name).toBe('paragraph');
        });

        it('should accept multiple block children using function call', () => {
            const block1 = createElement<JSProseBlock<'block1', string>>({
                type: 'block',
                name: 'block1',
                data: 'data1',
            });

            const block2 = createElement<JSProseBlock<'block2', string>>({
                type: 'block',
                name: 'block2',
                data: 'data2',
            });

            const element = Blocks({ children: [block1, block2] });

            expect(element.data).toHaveLength(2);
            expect(element.data[0]).toBe(block1);
            expect(element.data[1]).toBe(block2);
        });

        it('should throw error when empty', () => {
            expect(() => Blocks({})).toThrow('<Blocks> cannot be empty!');
            expect(() => Blocks({ children: [] })).toThrow(
                '<Blocks> cannot be empty!',
            );
        });

        it('should throw error when containing inliner elements', () => {
            const inlinerElement = createElement<
                JSProseInliner<'inliner', string>
            >({
                type: 'inliner',
                name: 'inliner',
                data: 'inliner data',
            });

            expect(() => Blocks({ children: [inlinerElement] as any })).toThrow(
                '<Blocks> can contain only blocks! Inliner <inliner> found!',
            );
        });
    });

    describe('Inliners component', () => {
        it('should have correct name and type', () => {
            expect(Inliners.name).toBe(inlinersName);
            expect(Inliners.type).toBe('inliner');
            expect(inlinersName).toBe('inliners');
        });

        it('should create inliners element with inliner children using JSX', () => {
            const element = (
                <Inliners>
                    <Text>Hello</Text>
                </Inliners>
            );

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('inliners');
            expect(element.data).toHaveLength(1);
            expect(element.data[0].type).toBe('inliner');
            expect(element.data[0].name).toBe('text');
            expect(element.data[0].data).toBe('Hello');
        });

        it('should create inliners element with inliner children using function call', () => {
            const textElement = createElement<TextElement>({
                type: 'inliner',
                name: 'text',
                data: 'Hello',
            });

            const element = Inliners({ children: [textElement] });

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('inliners');
            expect(element.data).toHaveLength(1);
            expect(element.data[0]).toBe(textElement);
        });

        it('should accept multiple inliner children using JSX', () => {
            const element = (
                <Inliners>
                    <Text>Hello</Text>
                    <Text>world!</Text>
                </Inliners>
            );

            expect(element.data).toHaveLength(2);
            expect(element.data[0].data).toBe('Hello');
            expect(element.data[1].data).toBe('world!');
        });

        it('should accept multiple inliner children using function call', () => {
            const inliner1 = createElement<JSProseInliner<'inliner1', string>>({
                type: 'inliner',
                name: 'inliner1',
                data: 'data1',
            });

            const inliner2 = createElement<JSProseInliner<'inliner2', string>>({
                type: 'inliner',
                name: 'inliner2',
                data: 'data2',
            });

            const element = Inliners({ children: [inliner1, inliner2] });

            expect(element.data).toHaveLength(2);
            expect(element.data[0]).toBe(inliner1);
            expect(element.data[1]).toBe(inliner2);
        });

        it('should throw error when empty', () => {
            expect(() => Inliners({})).toThrow('<Inliners> cannot be empty!');
            expect(() => Inliners({ children: [] })).toThrow(
                '<Inliners> cannot be empty!',
            );
        });

        it('should throw error when containing block elements', () => {
            const blockElement = createElement<JSProseBlock<'block', string>>({
                type: 'block',
                name: 'block',
                data: 'block data',
            });

            expect(() => Inliners({ children: [blockElement] as any })).toThrow(
                '<Inliners> can contain only inliners! Block <block> found!',
            );
        });
    });

    describe('component integration', () => {
        it('should work together in complex structures using JSX', () => {
            const element = (
                <Paragraph>
                    <Text>Hello </Text>
                    <Text>world!</Text>
                </Paragraph>
            );

            expect(element.type).toBe('block');
            expect(element.data).toHaveLength(2);
            expect(element.data[0].data).toBe('Hello ');
            expect(element.data[1].data).toBe('world!');
        });

        it('should work together in complex structures using function calls', () => {
            const text1 = Text({ children: 'Hello ' });
            const text2 = Text({ children: 'world!' });

            const paragraph = Paragraph({ children: [text1, text2] });

            expect(paragraph.type).toBe('block');
            expect(paragraph.data).toHaveLength(2);
            expect(paragraph.data[0].data).toBe('Hello ');
            expect(paragraph.data[1].data).toBe('world!');
        });

        it('should maintain type safety in nested structures using JSX', () => {
            const element = (
                <Blocks>
                    <Paragraph>
                        <Text>Content</Text>
                    </Paragraph>
                </Blocks>
            );

            expect(element.type).toBe('block');
            expect(element.name).toBe('blocks');
            expect(element.data[0].type).toBe('block');
            expect(element.data[0].name).toBe('paragraph');
            expect(element.data[0].data[0].type).toBe('inliner');
            expect(element.data[0].data[0].name).toBe('text');
            expect(element.data[0].data[0].data).toBe('Content');
        });

        it('should maintain type safety in nested structures using function calls', () => {
            const textElement = Text({ children: 'Content' });
            const paragraphElement = Paragraph({ children: [textElement] });
            const blocksElement = Blocks({ children: [paragraphElement] });

            expect(blocksElement.type).toBe('block');
            expect(blocksElement.name).toBe('blocks');
            expect(blocksElement.data[0].type).toBe('block');
            expect(blocksElement.data[0].name).toBe('paragraph');
            expect(blocksElement.data[0].data[0].type).toBe('inliner');
            expect(blocksElement.data[0].data[0].name).toBe('text');
            expect(blocksElement.data[0].data[0].data).toBe('Content');
        });

        it('should handle mixed string and component children in JSX', () => {
            const element = (
                <Paragraph>
                    Hello <Text>beautiful</Text> world!
                </Paragraph>
            );

            expect(element.type).toBe('block');
            expect(element.name).toBe('paragraph');
            expect(element.data).toHaveLength(3);
            expect(element.data[0].data).toBe('Hello ');
            expect(element.data[1].data).toBe('beautiful');
            expect(element.data[2].data).toBe(' world!');
        });

        it('should create complex nested structures using JSX', () => {
            const document = (
                <Blocks>
                    <Paragraph>
                        This is the first paragraph with <Text>some text</Text>.
                    </Paragraph>
                    <Paragraph>
                        Second paragraph with multiple sentences.
                    </Paragraph>
                </Blocks>
            );

            expect(document.type).toBe('block');
            expect(document.name).toBe('blocks');
            expect(document.data).toHaveLength(2);

            // First paragraph
            expect(document.data[0].name).toBe('paragraph');
            expect(document.data[0].data).toHaveLength(3);

            // Second paragraph
            expect(document.data[1].name).toBe('paragraph');
            expect(document.data[1].data).toHaveLength(1);
        });

        it('should throw when Inliners is placed in Blocks', () => {
            expect(() => (
                <Blocks>
                    <Paragraph>Test paragraph</Paragraph>
                    <Inliners>
                        <Text>This should fail</Text>
                    </Inliners>
                </Blocks>
            )).toThrow(
                '<Blocks> can contain only blocks! Inliner <inliners> found!',
            );
        });
    });
});
