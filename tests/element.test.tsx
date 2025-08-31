import { describe, it, expect } from 'vitest';

import { JSProseBlock, JSProseInliner, createElement } from '../src/element';
import { defineBlockTag, defineInlinerTag } from '../src/tag';

describe('Elements', () => {
    describe('JSProseElement types', () => {
        it('should create a block element with correct type branding', () => {
            const blockElement: JSProseBlock<'test', string> = {
                type: 'block',
                name: 'test',
                data: 'test data',
            } as any;

            expect(blockElement.type).toBe('block');
            expect(blockElement.name).toBe('test');
            expect(blockElement.data).toBe('test data');
        });

        it('should create an inliner element with correct type branding', () => {
            const inlinerElement: JSProseInliner<'test', string> = {
                type: 'inliner',
                name: 'test',
                data: 'test data',
            } as any;

            expect(inlinerElement.type).toBe('inliner');
            expect(inlinerElement.name).toBe('test');
            expect(inlinerElement.data).toBe('test data');
        });
    });

    describe('createElement', () => {
        it('should create a block element correctly', () => {
            const element = createElement<JSProseBlock<'testBlock', string>>({
                type: 'block',
                name: 'testBlock',
                data: 'block data',
            });

            expect(element.type).toBe('block');
            expect(element.name).toBe('testBlock');
            expect(element.data).toBe('block data');
        });

        it('should create an inliner element correctly', () => {
            const element = createElement<
                JSProseInliner<'testInliner', number>
            >({
                type: 'inliner',
                name: 'testInliner',
                data: 42,
            });

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('testInliner');
            expect(element.data).toBe(42);
        });

        it('should preserve data structure when creating element', () => {
            const complexData = {
                title: 'Test',
                items: ['a', 'b', 'c'],
                metadata: { id: 1, active: true },
            };

            const element = createElement<
                JSProseBlock<'complex', typeof complexData>
            >({
                type: 'block',
                name: 'complex',
                data: complexData,
            });

            expect(element.data).toEqual(complexData);
            expect(element.data.title).toBe('Test');
            expect(element.data.items).toHaveLength(3);
            expect(element.data.metadata.active).toBe(true);
        });

        it('should handle undefined data', () => {
            const element = createElement<JSProseBlock<'empty', undefined>>({
                type: 'block',
                name: 'empty',
                data: undefined,
            });

            expect(element.type).toBe('block');
            expect(element.name).toBe('empty');
            expect(element.data).toBeUndefined();
        });
    });

    describe('JSX element creation', () => {
        it('should create elements using JSX syntax', () => {
            const TestBlock = defineBlockTag<JSProseBlock<'testBlock', string>>(
                'testBlock',
                () => 'JSX block data',
            );

            const TestInliner = defineInlinerTag<
                JSProseInliner<'testInliner', number>
            >('testInliner', () => 123);

            const blockElement = <TestBlock />;
            const inlinerElement = <TestInliner />;

            expect(blockElement.type).toBe('block');
            expect(blockElement.name).toBe('testBlock');
            expect(blockElement.data).toBe('JSX block data');

            expect(inlinerElement.type).toBe('inliner');
            expect(inlinerElement.name).toBe('testInliner');
            expect(inlinerElement.data).toBe(123);
        });

        it('should handle props in JSX', () => {
            interface BlockProps {
                title: string;
                count: number;
            }

            const PropsBlock = defineBlockTag<
                JSProseBlock<'propsBlock', BlockProps>,
                BlockProps
            >('propsBlock', (props) => ({
                title: props.title,
                count: props.count,
            }));

            const element = <PropsBlock title="Test" count={5} />;

            expect(element.data.title).toBe('Test');
            expect(element.data.count).toBe(5);
        });

        it('should handle children in JSX', () => {
            const ContainerBlock = defineBlockTag<
                JSProseBlock<'container', string>
            >(
                'container',
                (props) =>
                    `Container has ${props.children?.length || 0} children`,
            );

            const element = <ContainerBlock>Some content</ContainerBlock>;

            expect(element.data).toBe('Container has 1 children');
        });

        it('should support separate JSX element creation and insertion', () => {
            const ParagraphBlock = defineBlockTag<
                JSProseBlock<'paragraph', string>
            >('paragraph', (props) => {
                const child = props.children?.[0];
                return child && typeof child === 'object' && 'data' in child
                    ? child.data
                    : child || '';
            });

            const ContainerBlock = defineBlockTag<
                JSProseBlock<'container', { childCount: number }>
            >('container', (props) => ({
                childCount: props.children?.length || 0,
            }));

            const SeparateParagraph = (
                <ParagraphBlock>This is a separate paragraph</ParagraphBlock>
            );
            const AnotherParagraph = (
                <ParagraphBlock>Another paragraph</ParagraphBlock>
            );

            const container = (
                <ContainerBlock>
                    {SeparateParagraph}
                    {AnotherParagraph}
                    <ParagraphBlock>Inline paragraph</ParagraphBlock>
                </ContainerBlock>
            );

            expect(container.data.childCount).toBe(3);
            expect(SeparateParagraph.type).toBe('block');
            expect(SeparateParagraph.name).toBe('paragraph');
            expect(SeparateParagraph.data).toBe('This is a separate paragraph');
        });
    });
});
