import { toElement } from '../ref';
import { TextElement } from '../default';
import { JSProseElementAny, createElement } from '../element';
import { JSProseTag } from '../tag';
import { JSProseError } from 'src/error';

declare global {
    namespace JSX {
        interface IntrinsicElements {}
        type Element = JSProseElementAny;
    }
}

export function jsx<TTag extends JSProseTag<any, any>>(
    type: TTag,
    props: Parameters<TTag>[0],
): ReturnType<TTag> {
    if (props?.children) {
        props.children = processChildren(props.children);
    }

    return type(props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;

//
//
//

function processChildren(children: any) {
    const childrenArray = Array.isArray(children) ? children : [children];

    return childrenArray.map((child: any) => {
        let _child = child;
        _child = stringToText(_child);
        _child = unwrapRef(_child);
        return _child;
    });
}

function stringToText(child: any) {
    if (typeof child === 'string') {
        return createElement<TextElement>({
            type: 'inliner',
            name: 'text',
            data: child,
        });
    }
    return child;
}

function unwrapRef(child: any) {
    if (child && typeof child === 'object' && 'element' in child) {
        const element = toElement(child);
        if (element === undefined) {
            const refSlug = child.slug ? ` "${child.slug}"` : '';
            throw new JSProseError(
                `Unable to unwrap undefined JSProse reference${refSlug}!`,
            );
        }
        return element;
    }
    return child;
}
