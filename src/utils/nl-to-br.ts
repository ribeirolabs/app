import parse from "html-react-parser";

export function nlToBr(text: string) {
  return parse(text.replace(/\n/g, "<br />"));
}
