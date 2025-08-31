import { Blocks, Paragraph, Text } from './default';
import { defineDocument } from './document';

const article = defineDocument({
    refs: {
        tPifagor: Paragraph,
        hello: Text,
    },
    blocks: ({ tPifagor, hello }) => (
        <Blocks>
            <Text>
                <Paragraph $ref={tPifagor}>Это параграф</Paragraph>
            </Text>
            <Paragraph>Это первый парагаф статьи!</Paragraph>
            <Paragraph>Это теорема Пифагора!</Paragraph>
            {tPifagor}
            <Paragraph>
                Текст <Text $ref={hello}>привет!</Text>
            </Paragraph>
            <Paragraph>Это еще один {hello}.</Paragraph>
        </Blocks>
    ),
});

export const { tPifagor, hello } = article.refs;
