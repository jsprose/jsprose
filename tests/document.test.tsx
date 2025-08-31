import { describe, it, expect } from 'vitest';

import {
    defineDocument,
    Paragraph,
    Text,
    Blocks,
    toElement,
    defineBlockTag,
    JSProseBlock,
} from '../src';

describe('Document', () => {
    describe('basic functionality', () => {
        it('should create a document with refs and assign values correctly', () => {
            const doc = defineDocument({
                refs: {
                    myParagraph: Paragraph,
                    myText: Text,
                },
                blocks: ({ myParagraph, myText }) => {
                    return (
                        <Blocks>
                            <Paragraph $ref={myParagraph}>
                                This is first paragraph
                            </Paragraph>
                            <Paragraph>
                                This is <Text $ref={myText}>second</Text>
                            </Paragraph>
                            {myParagraph}
                            <Paragraph>
                                Final paragraph, but wait, it is actually{' '}
                                {myText}!
                            </Paragraph>
                        </Blocks>
                    );
                },
            });

            const paragraphElement = toElement(doc.refs.myParagraph);
            const textElement = toElement(doc.refs.myText);

            expect(paragraphElement).toBeDefined();
            expect(textElement).toBeDefined();
            expect(paragraphElement!.data[0].data).toBe(
                'This is first paragraph',
            );
            expect(textElement!.data).toBe('second');

            expect(doc.blocks.data).toHaveLength(4);
            expect(doc.blocks.data[0]).toBe(paragraphElement);
            expect(doc.blocks.data[2]).toBe(paragraphElement);
            expect(doc.blocks.data[3].data[2]).toBe(textElement);
        });

        it('should create a document without refs property', () => {
            const doc = defineDocument({
                blocks: () => {
                    return (
                        <Blocks>
                            <Paragraph>Simple paragraph</Paragraph>
                            <Paragraph>
                                Another paragraph with <Text>nested text</Text>
                            </Paragraph>
                        </Blocks>
                    );
                },
            });

            expect(doc.refs).toEqual({});
            expect(doc.blocks.data).toHaveLength(2);
            expect(doc.blocks.data[0].data[0].data).toBe('Simple paragraph');
            expect(doc.blocks.data[1].data[1].data).toBe('nested text');
        });
    });

    describe('ref validation', () => {
        it('should throw error when ref is not assigned', () => {
            expect(() => {
                defineDocument({
                    refs: {
                        unassignedRef: Paragraph,
                    },
                    blocks: ({ unassignedRef }) => {
                        return (
                            <Blocks>
                                <Paragraph>No ref assignment here</Paragraph>
                            </Blocks>
                        );
                    },
                });
            }).toThrow(
                'Document reference "unassignedRef" was not assigned a value in the blocks function!',
            );
        });

        it('should throw error when ref is assigned to wrong element type', () => {
            expect(() => {
                defineDocument({
                    refs: {
                        paragraphRef: Paragraph,
                        textRef: Text,
                    },
                    blocks: ({ paragraphRef, textRef }) => {
                        return (
                            <Blocks>
                                {/* @ts-expect-error Incorrectly assign Text ref to Paragraph element */}
                                <Paragraph $ref={textRef}>
                                    This should fail
                                </Paragraph>
                                <Paragraph $ref={paragraphRef}>
                                    This is correct
                                </Paragraph>
                            </Blocks>
                        );
                    },
                });
            }).toThrow(
                'Element assigned to reference does not match expected tag <text>!',
            );
        });
    });

    describe('ref reuse and identity', () => {
        it('should maintain ref element identity across multiple uses', () => {
            const doc = defineDocument({
                refs: {
                    sharedText: Text,
                },
                blocks: ({ sharedText }) => {
                    return (
                        <Blocks>
                            <Paragraph>
                                First use: <Text $ref={sharedText}>shared</Text>
                            </Paragraph>
                            <Paragraph>Second use: {sharedText}</Paragraph>
                            <Paragraph>Third use: {sharedText}</Paragraph>
                        </Blocks>
                    );
                },
            });

            const textElement = toElement(doc.refs.sharedText)!;
            expect(textElement.data).toBe('shared');

            expect(doc.blocks.data[0].data[1]).toBe(textElement);
            expect(doc.blocks.data[1].data[1]).toBe(textElement);
            expect(doc.blocks.data[2].data[1]).toBe(textElement);
        });

        it('should work with custom tags that have refs', () => {
            const CustomBlock = defineBlockTag<JSProseBlock<'custom', string>>(
                'custom',
                (props) => `Custom: ${props.children?.length || 0} items`,
            );

            const doc = defineDocument({
                refs: {
                    customRef: CustomBlock,
                },
                blocks: ({ customRef }) => {
                    return (
                        <Blocks>
                            <CustomBlock $ref={customRef}>
                                <Paragraph>
                                    Content inside custom block
                                </Paragraph>
                            </CustomBlock>
                            {customRef}
                        </Blocks>
                    );
                },
            });

            const customEl = toElement(doc.refs.customRef);
            expect(customEl).toBeDefined();
            expect(customEl!.name).toBe('custom');
            expect(customEl!.data).toBe('Custom: 1 items');

            expect(doc.blocks.data[0]).toBe(customEl);
            expect(doc.blocks.data[1]).toBe(customEl);
        });
    });
});
