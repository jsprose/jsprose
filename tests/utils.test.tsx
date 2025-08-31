import { describe, it, expect } from 'vitest';

import { isTagElement, isBlockElement, isInlinerElement } from '../src/utils';
import { createElement, JSProseBlock, JSProseInliner } from '../src/element';
import { defineBlockTag, defineInlinerTag } from '../src/tag';

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
});
