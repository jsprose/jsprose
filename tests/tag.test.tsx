import { describe, it, expect } from 'vitest';

import { defineBlockTag, defineInlinerTag } from '../src/tag';
import { JSProseBlock, JSProseInliner } from '../src/element';

describe('Tag', () => {
    describe('defineBlockTag', () => {
        it('should create a block tag with correct properties', () => {
            const MyBlock = defineBlockTag<JSProseBlock<'myBlock', string>>(
                'myBlock',
                () => 'block data',
            );

            expect(MyBlock.type).toBe('block');
            expect(MyBlock.name).toBe('myBlock');
            expect(typeof MyBlock).toBe('function');
        });

        it('should create functional block tag that produces elements using JSX', () => {
            const MyBlock = defineBlockTag<JSProseBlock<'myBlock', string>>(
                'myBlock',
                (props) => `Processed: ${props.children?.length || 0} children`,
            );

            const element = <MyBlock>child1</MyBlock>;

            expect(element.type).toBe('block');
            expect(element.name).toBe('myBlock');
            expect(element.data).toBe('Processed: 1 children');
        });

        it('should create functional block tag that produces elements using function call', () => {
            const MyBlock = defineBlockTag<JSProseBlock<'myBlock', string>>(
                'myBlock',
                (props) => `Processed: ${props.children?.length || 0} children`,
            );

            const element = MyBlock({ children: ['child1', 'child2'] });

            expect(element.type).toBe('block');
            expect(element.name).toBe('myBlock');
            expect(element.data).toBe('Processed: 2 children');
        });

        it('should pass props to createData function using JSX', () => {
            interface MyProps {
                title: string;
                count: number;
            }

            const MyBlock = defineBlockTag<
                JSProseBlock<'myBlock', MyProps>,
                MyProps
            >('myBlock', (props) => ({
                title: props.title,
                count: props.count,
            }));

            const element = <MyBlock title="Test Title" count={5} />;

            expect(element.data.title).toBe('Test Title');
            expect(element.data.count).toBe(5);
        });

        it('should pass props to createData function using function call', () => {
            interface MyProps {
                title: string;
                count: number;
            }

            const MyBlock = defineBlockTag<
                JSProseBlock<'myBlock', MyProps>,
                MyProps
            >('myBlock', (props) => ({
                title: props.title,
                count: props.count,
            }));

            const element = MyBlock({ title: 'Test Title', count: 5 });

            expect(element.data.title).toBe('Test Title');
            expect(element.data.count).toBe(5);
        });

        it('should handle complex data structures', () => {
            interface ComplexData {
                metadata: { id: number; active: boolean };
                items: string[];
            }

            const ComplexBlock = defineBlockTag<
                JSProseBlock<'complex', ComplexData>
            >('complex', () => ({
                metadata: { id: 1, active: true },
                items: ['item1', 'item2'],
            }));

            const element = <ComplexBlock />;

            expect(element.data.metadata.id).toBe(1);
            expect(element.data.metadata.active).toBe(true);
            expect(element.data.items).toEqual(['item1', 'item2']);
        });
    });

    describe('defineInlinerTag', () => {
        it('should create an inliner tag with correct properties', () => {
            const MyInliner = defineInlinerTag<
                JSProseInliner<'myInliner', string>
            >('myInliner', () => 'inliner data');

            expect(MyInliner.type).toBe('inliner');
            expect(MyInliner.name).toBe('myInliner');
            expect(typeof MyInliner).toBe('function');
        });

        it('should create functional inliner tag that produces elements using JSX', () => {
            const MyInliner = defineInlinerTag<
                JSProseInliner<'myInliner', string>
            >(
                'myInliner',
                (props) => `Content: ${props.children?.length || 0}`,
            );

            const element = <MyInliner>a</MyInliner>;

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('myInliner');
            expect(element.data).toBe('Content: 1');
        });

        it('should create functional inliner tag that produces elements using function call', () => {
            const MyInliner = defineInlinerTag<
                JSProseInliner<'myInliner', string>
            >(
                'myInliner',
                (props) => `Content: ${props.children?.length || 0}`,
            );

            const element = MyInliner({ children: ['a', 'b'] });

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('myInliner');
            expect(element.data).toBe('Content: 2');
        });

        it('should work with custom props interface using JSX', () => {
            interface TextProps {
                color: string;
                bold: boolean;
            }

            const StyledText = defineInlinerTag<
                JSProseInliner<
                    'styledText',
                    { style: string; content: string }
                >,
                TextProps
            >('styledText', (props) => ({
                style: `color: ${props.color}; font-weight: ${props.bold ? 'bold' : 'normal'}`,
                content: 'styled content',
            }));

            const element = <StyledText color="red" bold={true} />;

            expect(element.data.style).toBe('color: red; font-weight: bold');
            expect(element.data.content).toBe('styled content');
        });

        it('should work with custom props interface using function call', () => {
            interface TextProps {
                color: string;
                bold: boolean;
            }

            const StyledText = defineInlinerTag<
                JSProseInliner<
                    'styledText',
                    { style: string; content: string }
                >,
                TextProps
            >('styledText', (props) => ({
                style: `color: ${props.color}; font-weight: ${props.bold ? 'bold' : 'normal'}`,
                content: 'styled content',
            }));

            const element = StyledText({ color: 'red', bold: true });

            expect(element.data.style).toBe('color: red; font-weight: bold');
            expect(element.data.content).toBe('styled content');
        });

        it('should handle empty props using JSX', () => {
            const SimpleInliner = defineInlinerTag<
                JSProseInliner<'simple', string>
            >('simple', () => 'simple data');

            const element = <SimpleInliner />;

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('simple');
            expect(element.data).toBe('simple data');
        });

        it('should handle empty props using function call', () => {
            const SimpleInliner = defineInlinerTag<
                JSProseInliner<'simple', string>
            >('simple', () => 'simple data');

            const element = SimpleInliner({});

            expect(element.type).toBe('inliner');
            expect(element.name).toBe('simple');
            expect(element.data).toBe('simple data');
        });
    });

    describe('tag properties', () => {
        it('should have enumerable type and name properties', () => {
            const TestTag = defineBlockTag<JSProseBlock<'test', string>>(
                'test',
                () => 'test',
            );

            const descriptor = Object.getOwnPropertyDescriptor(TestTag, 'type');
            expect(descriptor?.enumerable).toBe(true);
            expect(descriptor?.value).toBe('block');

            const nameDescriptor = Object.getOwnPropertyDescriptor(
                TestTag,
                'name',
            );
            expect(nameDescriptor?.enumerable).toBe(true);
            expect(nameDescriptor?.value).toBe('test');
        });

        it('should maintain consistent tag identity', () => {
            const Tag1 = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'data',
            );
            const Tag2 = defineInlinerTag<JSProseInliner<'test', string>>(
                'test',
                () => 'data',
            );

            expect(Tag1.type).toBe(Tag2.type);
            expect(Tag1.name).toBe(Tag2.name);
        });
    });
});
