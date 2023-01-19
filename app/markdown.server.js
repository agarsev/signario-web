import { marked } from "marked";

marked.use({ walkTokens: token => {
    if (token.type === 'link' && token.href.match(/\d+/)) {
        token.href = "/signario/signo/"+token.href;
    }
}});

export default function markdown (text) {
    return marked.parse(text);
}
