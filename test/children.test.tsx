import { describe, it, expect } from 'vitest';

import {
    JSProseTagChildren,
    JSProseNormalizedChildren,
    WithTagChildren,
    WithNormalizedChildren,
} from '../src/children';
import { createElement, JSProseBlock, JSProseInliner } from '../src/element';
import { defineInlinerTag, defineBlockTag } from '../src/tag';

// Define some test components for JSX usage
const TestInliner = defineInlinerTag<JSProseInliner<'test', string>>(
    'test',
    () => 'test data',
);

const TestBlock = defineBlockTag<JSProseBlock<'testBlock', string>>(
    'testBlock',
    () => 'block data',
);

describe('Children', () => {
    describe('JSProseTagChildren type', () => {
        it('should accept string children', () => {
            const stringChild: JSProseTagChildren = 'Hello world';
            expect(typeof stringChild).toBe('string');
        });

        it('should accept single element children using JSX', () => {
            const elementChild = <TestInliner />;
            const typedChild: JSProseTagChildren = elementChild;
            expect(elementChild.type).toBe('inliner');
            expect(elementChild.name).toBe('test');
        });

        it('should accept single element children using createElement', () => {
            const element = createElement<JSProseInliner<'test', string>>({
                type: 'inliner',
                name: 'test',
                data: 'test data',
            });

            const elementChild: JSProseTagChildren = element;
            expect(elementChild.type).toBe('inliner');
            expect(elementChild.name).toBe('test');
        });

        it('should accept array of mixed children using JSX', () => {
            const mixedChildren: JSProseTagChildren = [
                'string child',
                <TestInliner />,
                <TestBlock />,
            ];

            expect(Array.isArray(mixedChildren)).toBe(true);
            expect(mixedChildren).toHaveLength(3);
            expect(typeof mixedChildren[0]).toBe('string');
            expect((mixedChildren[1] as any).type).toBe('inliner');
            expect((mixedChildren[2] as any).type).toBe('block');
        });

        it('should accept array of mixed children using createElement', () => {
            const element1 = createElement<JSProseInliner<'test1', string>>({
                type: 'inliner',
                name: 'test1',
                data: 'data1',
            });

            const element2 = createElement<JSProseBlock<'test2', string>>({
                type: 'block',
                name: 'test2',
                data: 'data2',
            });

            const mixedChildren: JSProseTagChildren = [
                'string child',
                element1,
                element2,
            ];

            expect(Array.isArray(mixedChildren)).toBe(true);
            expect(mixedChildren).toHaveLength(3);
        });
    });

    describe('JSProseNormalizedChildren type', () => {
        it('should be an array of JSProseElements using JSX', () => {
            const normalizedChildren: JSProseNormalizedChildren = [
                <TestInliner />,
                <TestBlock />,
            ];

            expect(Array.isArray(normalizedChildren)).toBe(true);
            expect(normalizedChildren).toHaveLength(2);
            expect(normalizedChildren[0].name).toBe('test');
            expect(normalizedChildren[1].name).toBe('testBlock');
        });

        it('should be an array of JSProseElements using createElement', () => {
            const element1 = createElement<JSProseInliner<'test1', string>>({
                type: 'inliner',
                name: 'test1',
                data: 'data1',
            });

            const element2 = createElement<JSProseBlock<'test2', string>>({
                type: 'block',
                name: 'test2',
                data: 'data2',
            });

            const normalizedChildren: JSProseNormalizedChildren = [
                element1,
                element2,
            ];

            expect(Array.isArray(normalizedChildren)).toBe(true);
            expect(normalizedChildren).toHaveLength(2);
            expect(normalizedChildren[0].name).toBe('test1');
            expect(normalizedChildren[1].name).toBe('test2');
        });

        it('should handle empty array', () => {
            const emptyChildren: JSProseNormalizedChildren = [];
            expect(Array.isArray(emptyChildren)).toBe(true);
            expect(emptyChildren).toHaveLength(0);
        });
    });

    describe('WithTagChildren type', () => {
        it('should extend props with optional children property using JSX', () => {
            interface MyProps {
                title: string;
                count: number;
            }

            const propsWithChildren: WithTagChildren<MyProps> = {
                title: 'Test',
                count: 5,
                children: <TestInliner />,
            };

            expect(propsWithChildren.title).toBe('Test');
            expect(propsWithChildren.count).toBe(5);
            expect((propsWithChildren.children as any).name).toBe('test');
        });

        it('should extend props with optional children property using strings', () => {
            interface MyProps {
                title: string;
                count: number;
            }

            const propsWithChildren: WithTagChildren<MyProps> = {
                title: 'Test',
                count: 5,
                children: 'Hello',
            };

            expect(propsWithChildren.title).toBe('Test');
            expect(propsWithChildren.count).toBe(5);
            expect(propsWithChildren.children).toBe('Hello');
        });

        it('should work without children property', () => {
            interface MyProps {
                title: string;
            }

            const propsWithoutChildren: WithTagChildren<MyProps> = {
                title: 'Test',
            };

            expect(propsWithoutChildren.title).toBe('Test');
            expect(propsWithoutChildren.children).toBeUndefined();
        });

        it('should omit existing children property from base type', () => {
            interface PropsWithExistingChildren {
                title: string;
                children: string; // This should be omitted
            }

            const props: WithTagChildren<PropsWithExistingChildren> = {
                title: 'Test',
                children: [<TestInliner />, <TestBlock />], // Can now accept JSProseTagChildren
            };

            expect(props.title).toBe('Test');
            expect(Array.isArray(props.children)).toBe(true);
            expect((props.children as any)[0].name).toBe('test');
            expect((props.children as any)[1].name).toBe('testBlock');
        });
    });

    describe('WithNormalizedChildren type', () => {
        it('should extend props with optional normalized children using JSX', () => {
            interface MyProps {
                title: string;
            }

            const element = <TestInliner />;

            const propsWithNormalizedChildren: WithNormalizedChildren<MyProps> =
                {
                    title: 'Test',
                    children: [element],
                };

            expect(propsWithNormalizedChildren.title).toBe('Test');
            expect(Array.isArray(propsWithNormalizedChildren.children)).toBe(
                true,
            );
            expect(propsWithNormalizedChildren.children?.[0]).toBe(element);
        });

        it('should extend props with optional normalized children using createElement', () => {
            interface MyProps {
                title: string;
            }

            const element = createElement<JSProseInliner<'test', string>>({
                type: 'inliner',
                name: 'test',
                data: 'test data',
            });

            const propsWithNormalizedChildren: WithNormalizedChildren<MyProps> =
                {
                    title: 'Test',
                    children: [element],
                };

            expect(propsWithNormalizedChildren.title).toBe('Test');
            expect(Array.isArray(propsWithNormalizedChildren.children)).toBe(
                true,
            );
            expect(propsWithNormalizedChildren.children?.[0]).toBe(element);
        });

        it('should work without children property', () => {
            interface MyProps {
                title: string;
            }

            const propsWithoutChildren: WithNormalizedChildren<MyProps> = {
                title: 'Test',
            };

            expect(propsWithoutChildren.title).toBe('Test');
            expect(propsWithoutChildren.children).toBeUndefined();
        });
    });
});
