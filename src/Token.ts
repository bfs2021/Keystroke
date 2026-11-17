// Define all possible token types
export enum TokenType {
    // Headers
    HEADER1 = 'HEADER1',
    HEADER2 = 'HEADER2',
    HEADER3 = 'HEADER3',
    HEADER4 = 'HEADER4',
    HEADER5 = 'HEADER5',
    HEADER6 = 'HEADER6',

    // Lists
    UNORDERED_LIST = 'UNORDERED_LIST',
    ORDERED_LIST = 'ORDERED_LIST',
    LIST_ITEM = 'LIST_ITEM',
    CHECKLIST = 'CHECKLIST',
    CHECKLIST_CHECKED = 'CHECKLIST_CHECKED',

    // Text formatting
    BOLD = 'BOLD',
    ITALIC = 'ITALIC',
    STRIKETHROUGH = 'STRIKETHROUGH',
    UNDERLINE = 'UNDERLINE',

    SUPERSCRIPT = 'SUPERSCRIPT',
    SUBSCRIPT = 'SUBSCRIPT',
    // HIGHLIGHT = 'HIGHLIGHT',
    // COLOR = 'COLOR',
    MATH = 'MATH',

    // Code
    INLINE_CODE = 'INLINE_CODE',
    CODE_BLOCK = 'CODE_BLOCK',

    // Links and images
    LINK = 'LINK',
    LINK_TEXT_START = 'LINK_TEXT_START',
    LINK_TEXT_END = 'LINK_TEXT_END',
    LINK_URL_START = 'LINK_URL_START',
    LINK_URL_END = 'LINK_URL_END',
    // IMAGE = 'IMAGE',

    // Other
    BLOCKQUOTE = 'BLOCKQUOTE',
    HORIZONTAL_RULE = 'HORIZONTAL_RULE',
    TEXT = 'TEXT',           // Regular text
    EOF = 'EOF',            // End of file
    ILLEGAL = 'ILLEGAL',     // Unknown token
    DOCUMENT = 'DOCUMENT',   // Root node
    PARAGRAPH = 'PARAGRAPH',   // Paragraph

    //whitespace
    SPACE = 'SPACE',
    TAB = 'TAB',
    NEWLINE = 'NEWLINE',

    // Parentheses
    LEFT_PARENTHESIS = 'LEFT_PARENTHESIS',
    RIGHT_PARENTHESIS = 'RIGHT_PARENTHESIS',
    LEFT_BRACKET = 'LEFT_BRACKET',
    RIGHT_BRACKET = 'RIGHT_BRACKET',
    LEFT_BRACE = 'LEFT_BRACE',
    RIGHT_BRACE = 'RIGHT_BRACE',
}

export class Token {
    constructor(
        public type: TokenType,
        public literal: string,
        // CODE_BLOCK only: the fence's language (first word of its info string).
        public language?: string
    ) {}
}
