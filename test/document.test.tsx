import { describe, it, expect } from 'vitest';

import {
    defineDocument,
    Paragraph,
    Text,
    Blocks,
    toElement,
    defineBlockTag,
    JSProseBlock,
    defineRefs,
} from '../src';

describe('Document', () => {
    describe('basic functionality', () => {
        it('should create a document with refs and assign values correctly', () => {
            const refs = defineRefs({
                defs: {
                    myParagraph: Paragraph,
                    myText: Text,
                },
            });

            const doc = defineDocument({
                refs,
                content: ({ myParagraph, myText }) => {
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

            expect(doc.refs.myParagraph.slug).toBe('myParagraph');
            expect(doc.refs.myText.slug).toBe('myText');
            expect(doc.refs.myParagraph.url).toBeUndefined();
            expect(doc.refs.myText.url).toBeUndefined();

            expect(doc.content.data).toHaveLength(4);
            expect(doc.content.data[0]).toBe(paragraphElement);
            expect(doc.content.data[2]).toBe(paragraphElement);
            expect(doc.content.data[3].data[2]).toBe(textElement);
        });

        it('should create a document without refs property', () => {
            const doc = defineDocument({
                content: () => {
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
            expect(doc.content.data).toHaveLength(2);
            expect(doc.content.data[0].data[0].data).toBe('Simple paragraph');
            expect(doc.content.data[1].data[1].data).toBe('nested text');
        });
    });

    describe('ref validation', () => {
        it('should throw error when ref is not assigned', () => {
            const refs = defineRefs({
                defs: {
                    unassignedRef: Paragraph,
                },
            });

            expect(() => {
                defineDocument({
                    refs,
                    content: ({ unassignedRef }) => {
                        return (
                            <Blocks>
                                <Paragraph>No ref assignment here</Paragraph>
                            </Blocks>
                        );
                    },
                });
            }).toThrow(
                'Document reference "unassignedRef" was not assigned a value in the content function!',
            );
        });

        it('should throw error when ref is assigned to wrong element type', () => {
            const refs = defineRefs({
                defs: {
                    paragraphRef: Paragraph,
                    textRef: Text,
                },
            });

            expect(() => {
                defineDocument({
                    refs,
                    content: ({ paragraphRef, textRef }) => {
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
                'Element assigned to reference "textRef" does not match expected tag <text>!',
            );
        });
    });

    describe('ref reuse and identity', () => {
        it('should maintain ref element identity across multiple uses', () => {
            const refs = defineRefs({
                defs: {
                    sharedText: Text,
                },
            });

            const doc = defineDocument({
                refs,
                content: ({ sharedText }) => {
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

            expect(doc.content.data[0].data[1]).toBe(textElement);
            expect(doc.content.data[1].data[1]).toBe(textElement);
            expect(doc.content.data[2].data[1]).toBe(textElement);
        });

        it('should work with custom tags that have refs', () => {
            const CustomBlock = defineBlockTag<JSProseBlock<'custom', string>>(
                'custom',
                (props) => `Custom: ${props.children?.length || 0} items`,
            );

            const refs = defineRefs({
                defs: {
                    customRef: CustomBlock,
                },
            });

            const doc = defineDocument({
                refs,
                content: ({ customRef }) => {
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

            expect(doc.content.data[0]).toBe(customEl);
            expect(doc.content.data[1]).toBe(customEl);
        });
    });
});
