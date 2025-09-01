import { describe, it, expect } from 'vitest';

import {
    isTagElement,
    isBlockElement,
    isInlinerElement,
    isRef,
    validateInlinerChildren,
} from '../src/utils';
import { createElement, JSProseBlock, JSProseInliner } from '../src/element';
import { defineBlockTag, defineInlinerTag } from '../src/tag';
import { defineRef } from '../src/ref';
import { JSProseError } from '../src/error';

describe('Utils', () => {
    describe('isTagElement', () => {
        it('should return true when element matches the tag using JSX', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            const element = <TestTag />;

            expect(isTagElement(element, TestTag)).toBe(true);
        });

        it('should return true when element matches the tag using createElement', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            const element = createElement<JSProseInliner<'test', string>>({
                type: 'inliner',
                name: 'test',
                data: 'test data',
            });

            expect(isTagElement(element, TestTag)).toBe(true);
        });

        it('should return false when element name does not match tag', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            const element = createElement<JSProseInliner<'other', string>>({
                type: 'inliner',
                name: 'other',
                data: 'other data',
            });

            expect(isTagElement(element as any, TestTag)).toBe(false);
        });

        it('should return false when element type does not match tag', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            const element = createElement<JSProseBlock<'test', string>>({
                type: 'block',
                name: 'test',
                data: 'test data',
            });

            expect(isTagElement(element as any, TestTag)).toBe(false);
        });

        it('should handle null/undefined elements gracefully', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            expect(isTagElement(null as any, TestTag)).toBe(false);
            expect(isTagElement(undefined as any, TestTag)).toBe(false);
        });
    });

    describe('isBlockElement', () => {
        it('should return true for block elements using JSX', () => {
            const TestBlock = defineBlockTag<JSProseBlock<'block', string>>(
                'block',
                () => 'block data',
            );

            const blockElement = <TestBlock />;

            expect(isBlockElement(blockElement)).toBe(true);
        });

        it('should return true for block elements using createElement', () => {
            const blockElement = createElement<JSProseBlock<'block', string>>({
                type: 'block',
                name: 'block',
                data: 'block data',
            });

            expect(isBlockElement(blockElement)).toBe(true);
        });

        it('should return false for inliner elements using JSX', () => {
            const TestInliner = defineInlinerTag<
                JSProseInliner<'inliner', string>
            >('inliner', () => 'inliner data');

            const inlinerElement = <TestInliner />;

            expect(isBlockElement(inlinerElement)).toBe(false);
        });

        it('should return false for inliner elements using createElement', () => {
            const inlinerElement = createElement<
                JSProseInliner<'inliner', string>
            >({
                type: 'inliner',
                name: 'inliner',
                data: 'inliner data',
            });

            expect(isBlockElement(inlinerElement)).toBe(false);
        });

        it('should return false for non-element objects', () => {
            expect(isBlockElement({})).toBe(false);
            expect(isBlockElement({ type: 'other' })).toBe(false);
            expect(isBlockElement('string')).toBe(false);
            expect(isBlockElement(null)).toBe(false);
            expect(isBlockElement(undefined)).toBe(false);
        });
    });

    describe('isInlinerElement', () => {
        it('should return true for inliner elements using JSX', () => {
            const TestInliner = defineInlinerTag<
                JSProseInliner<'inliner', string>
            >('inliner', () => 'inliner data');

            const inlinerElement = <TestInliner />;

            expect(isInlinerElement(inlinerElement)).toBe(true);
        });

        it('should return true for inliner elements using createElement', () => {
            const inlinerElement = createElement<
                JSProseInliner<'inliner', string>
            >({
                type: 'inliner',
                name: 'inliner',
                data: 'inliner data',
            });

            expect(isInlinerElement(inlinerElement)).toBe(true);
        });

        it('should return false for block elements using JSX', () => {
            const TestBlock = defineBlockTag<JSProseBlock<'block', string>>(
                'block',
                () => 'block data',
            );

            const blockElement = <TestBlock />;

            expect(isInlinerElement(blockElement)).toBe(false);
        });

        it('should return false for block elements using createElement', () => {
            const blockElement = createElement<JSProseBlock<'block', string>>({
                type: 'block',
                name: 'block',
                data: 'block data',
            });

            expect(isInlinerElement(blockElement)).toBe(false);
        });

        it('should return false for non-element objects', () => {
            expect(isInlinerElement({})).toBe(false);
            expect(isInlinerElement({ type: 'other' })).toBe(false);
            expect(isInlinerElement('string')).toBe(false);
            expect(isInlinerElement(null)).toBe(false);
            expect(isInlinerElement(undefined)).toBe(false);
        });
    });

    describe('validateInlinerChildren', () => {
        it('should not throw when inliner contains only inliner children', () => {
            const inlinerChild = createElement<JSProseInliner<'text', string>>({
                type: 'inliner',
                name: 'text',
                data: 'text data',
            });

            const children = [inlinerChild];

            expect(() => {
                validateInlinerChildren('span', children);
            }).not.toThrow();
        });

        it('should not throw when inliner has no children', () => {
            const children: any[] = [];

            expect(() => {
                validateInlinerChildren('span', children);
            }).not.toThrow();
        });

        it('should throw when inliner contains block children', () => {
            const blockChild = createElement<JSProseBlock<'paragraph', string>>(
                {
                    type: 'block',
                    name: 'paragraph',
                    data: 'paragraph data',
                },
            );

            const children = [blockChild];

            expect(() => {
                validateInlinerChildren('span', children);
            }).toThrow(JSProseError);

            expect(() => {
                validateInlinerChildren('span', children);
            }).toThrow(
                'Inliner element <span> can not contain block element <paragraph>!',
            );
        });

        it('should throw with correct element names in error message', () => {
            const blockChild = createElement<JSProseBlock<'div', any>>({
                type: 'block',
                name: 'div',
                data: {},
            });

            const children = [blockChild];

            expect(() => {
                validateInlinerChildren('strong', children);
            }).toThrow(
                'Inliner element <strong> can not contain block element <div>!',
            );
        });

        it('should throw on first block element found in mixed children', () => {
            const inlinerChild = createElement<JSProseInliner<'text', string>>({
                type: 'inliner',
                name: 'text',
                data: 'text data',
            });

            const blockChild = createElement<JSProseBlock<'paragraph', string>>(
                {
                    type: 'block',
                    name: 'paragraph',
                    data: 'paragraph data',
                },
            );

            const anotherBlockChild = createElement<JSProseBlock<'div', any>>({
                type: 'block',
                name: 'div',
                data: {},
            });

            const children = [inlinerChild, blockChild, anotherBlockChild];

            expect(() => {
                validateInlinerChildren('em', children);
            }).toThrow(
                'Inliner element <em> can not contain block element <paragraph>!',
            );
        });
    });

    describe('validateInlinerChildren integration with JSX', () => {
        it('should validate inliner children when using JSX with inliner tags', () => {
            const TestInliner = defineInlinerTag<
                JSProseInliner<'test-inliner', any>
            >('test-inliner', (props) => props.children);

            const TestBlock = defineBlockTag<JSProseBlock<'test-block', any>>(
                'test-block',
                (props) => props.children,
            );

            expect(() => {
                const inlinerElement = <TestInliner />;
                const validElement = (
                    <TestInliner>{inlinerElement}</TestInliner>
                );
            }).not.toThrow();

            expect(() => {
                const blockElement = <TestBlock />;
                const invalidElement = (
                    <TestInliner>{blockElement}</TestInliner>
                );
            }).toThrow(JSProseError);

            expect(() => {
                const blockElement = <TestBlock />;
                const invalidElement = (
                    <TestInliner>{blockElement}</TestInliner>
                );
            }).toThrow(
                'Inliner element <test-inliner> can not contain block element <test-block>!',
            );
        });

        it('should allow block tags to contain both block and inliner children', () => {
            const TestBlock = defineBlockTag<JSProseBlock<'test-block', any>>(
                'test-block',
                (props) => props.children,
            );

            const TestInliner = defineInlinerTag<
                JSProseInliner<'test-inliner', any>
            >('test-inliner', (props) => props.children);

            expect(() => {
                const blockChild = <TestBlock />;
                const inlinerChild = <TestInliner />;
                const containerBlock = (
                    <TestBlock>
                        {blockChild}
                        {inlinerChild}
                    </TestBlock>
                );
            }).not.toThrow();
        });

        it('should work with text content in inliner elements', () => {
            const TestInliner = defineInlinerTag<
                JSProseInliner<'test-inliner', any>
            >('test-inliner', (props) => props.children);

            expect(() => {
                const element = <TestInliner>Some text content</TestInliner>;
            }).not.toThrow();
        });

        it('should work with mixed text and inliner elements', () => {
            const TestInliner = defineInlinerTag<
                JSProseInliner<'test-inliner', any>
            >('test-inliner', (props) => props.children);

            const AnotherInliner = defineInlinerTag<
                JSProseInliner<'another-inliner', any>
            >('another-inliner', (props) => props.children);

            expect(() => {
                const element = (
                    <TestInliner>
                        Some text
                        <AnotherInliner>nested inliner</AnotherInliner>
                        more text
                    </TestInliner>
                );
            }).not.toThrow();
        });
    });

    describe('isRef', () => {
        it('should return true for a valid ref without tag check', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );
            const testRef = defineRef({ tag: TestTag });

            expect(isRef(testRef)).toBe(true);
        });

        it('should return false for non-ref objects without tag check', () => {
            expect(isRef({})).toBe(false);
            expect(isRef({ tag: 'something' })).toBe(false);
            expect(isRef(null)).toBe(false);
            expect(isRef(undefined)).toBe(false);
            expect(isRef('string')).toBe(false);
            expect(isRef(123)).toBe(false);
        });

        it('should return true for a ref with matching tag', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );
            const testRef = defineRef({ tag: TestTag });

            expect(isRef(testRef, TestTag)).toBe(true);
        });

        it('should return false for a ref with non-matching tag type', () => {
            const TestTagBlock = defineBlockTag<JSProseBlock<'test', string>>(
                'test',
                () => 'test data',
            );
            const TestTagInliner = defineInlinerTag<
                JSProseInliner<'test', string>
            >('test', () => 'test data');
            const testRef = defineRef({ tag: TestTagBlock });

            expect(isRef(testRef, TestTagInliner)).toBe(false);
        });

        it('should return false for a ref with non-matching tag name', () => {
            const TestTag1 = defineInlinerTag<JSProseInliner<'test1', string>>(
                'test1',
                () => 'test data',
            );
            const TestTag2 = defineInlinerTag<JSProseInliner<'test2', string>>(
                'test2',
                () => 'test data',
            );
            const testRef = defineRef({ tag: TestTag1 });

            expect(isRef(testRef, TestTag2)).toBe(false);
        });

        it('should return false for non-ref objects with tag check', () => {
            const TestTag = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'test data',
            );

            expect(isRef({}, TestTag)).toBe(false);
            expect(isRef({ tag: TestTag }, TestTag)).toBe(false);
            expect(isRef(null, TestTag)).toBe(false);
            expect(isRef(undefined, TestTag)).toBe(false);
        });
    });
});
