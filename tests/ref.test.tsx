import { describe, it, expect } from 'vitest';

import {
    Blocks,
    Paragraph,
    paragraphName,
    textName,
    BlocksElement,
    blocksName,
} from '../src';
import { jsproseRef, toElement } from '../src/ref';

describe('References', () => {
    it('should assign element via $ref attribute', () => {
        const paragraphRef = jsproseRef(Paragraph);

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
        const MyParagraph = jsproseRef(Paragraph);

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
        const UndefinedParagraph = jsproseRef(Paragraph);
        expect(() => {
            <Blocks>{UndefinedParagraph}</Blocks>;
        }).toThrow('Unable to unwrap undefined JSProse reference!');
    });

    it('should throw when trying to reassign an already assigned reference', () => {
        const paragraphRef = jsproseRef(Paragraph);

        <Paragraph $ref={paragraphRef}>First assignment</Paragraph>;

        expect(() => {
            <Paragraph $ref={paragraphRef}>Second assignment</Paragraph>;
        }).toThrow(
            'Reference for tag <paragraph> is already assigned and cannot be reassigned!',
        );
    });

    it('should throw when assigning wrong element type to reference', () => {
        const paragraphRef = jsproseRef(Paragraph);

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
        const paragraphRef = jsproseRef(Paragraph);

        <Paragraph $ref={paragraphRef}>Test content</Paragraph>;

        const element = toElement(paragraphRef)!;
        expect(element.type).toBe('block');
        expect(element.name).toBe('paragraph');
        expect(element.data[0].data).toBe('Test content');
    });
});
