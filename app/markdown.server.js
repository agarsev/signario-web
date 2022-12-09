import { marked } from "marked";

export default function markdown (text) {
    return marked.parse(text);
}
