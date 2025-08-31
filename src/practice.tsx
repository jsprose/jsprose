import { tPifagor } from './article';
import { Blocks } from './default';
import { defineDocument } from './document';

export const practice = defineDocument({
    blocks: () => <Blocks>{tPifagor}</Blocks>,
});
