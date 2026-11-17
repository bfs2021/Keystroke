import { Lexer } from '../src/Lexer';
import { Token, TokenType } from '../src/Token';

describe('Lexer', () => {
  // Helper function to verify token matches expected type and literal
  function expectToken(actual: Token, expected: { type: TokenType; literal: string }) {
    expect(actual.type).toBe(expected.type);
    expect(actual.literal).toBe(expected.literal);
  }

  // Helper function to verify sequence of tokens
  function expectTokens(lexer: Lexer, expectedTokens: Array<{ type: TokenType; literal: string }>) {
    expectedTokens.forEach(expected => {
      const token = lexer.nextToken();
      expectToken(token, expected);
    });
  }

  describe('constructor', () => {
    it('should initialize with empty input', () => {
      const lexer = new Lexer('');
      expect(lexer).toBeDefined();
    });

    it('should initialize with non-empty input', () => {
      const lexer = new Lexer('Hello');
      expect(lexer).toBeDefined();
    });
  });

  describe('nextToken', () => {
    it('should tokenize headers', () => {
      const input = '# Header1\n## Header2\n### Header3\n#### Header4\n##### Header5\n###### Header6';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.HEADER1, literal: '#' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header1' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HEADER2, literal: '##' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header2' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HEADER3, literal: '###' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header3' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HEADER4, literal: '####' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header4' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HEADER5, literal: '#####' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header5' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HEADER6, literal: '######' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Header6' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('should tokenize text formatting', () => {
      const input = '**bold** _italic_ ~~strikethrough~~ `code`';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.BOLD, literal: '**' },
        { type: TokenType.TEXT, literal: 'bold' },
        { type: TokenType.BOLD, literal: '**' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.ITALIC, literal: '_' },
        { type: TokenType.TEXT, literal: 'italic' },
        { type: TokenType.ITALIC, literal: '_' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.STRIKETHROUGH, literal: '~~' },
        { type: TokenType.TEXT, literal: 'strikethrough' },
        { type: TokenType.STRIKETHROUGH, literal: '~~' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.INLINE_CODE, literal: '`' },
        { type: TokenType.TEXT, literal: 'code' },
        { type: TokenType.INLINE_CODE, literal: '`' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('test tasks', () => {
      const input = '- [ ] Task 1\n - [x] Task 2\n - [ ] Task 3';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.CHECKLIST, literal: '- [ ]' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Task' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: '1' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.CHECKLIST_CHECKED, literal: '- [x]' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Task' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: '2' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.CHECKLIST, literal: '- [ ]' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Task' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: '3' },
        // { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('should tokenize lists', () => {
      const input = '* Item 1\n * Item 2\n - [ ] Todo\n - [x] Done';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.UNORDERED_LIST, literal: '*' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Item' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: '1' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.UNORDERED_LIST, literal: '*' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Item' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: '2' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.CHECKLIST, literal: '- [ ]' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Todo' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.CHECKLIST_CHECKED, literal: '- [x]' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Done' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('should tokenize links', () => {
      const input = '[Link text](https://example.com)';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.LEFT_BRACKET, literal: '[' },
        { type: TokenType.TEXT, literal: 'Link' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'text' },
        { type: TokenType.RIGHT_BRACKET, literal: ']' },
        { type: TokenType.LEFT_PARENTHESIS, literal: '(' },
        { type: TokenType.TEXT, literal: 'https://example.com' },
        { type: TokenType.RIGHT_PARENTHESIS, literal: ')' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('should tokenize blockquotes and horizontal rules', () => {
      const input = '> Blockquote\n---';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.BLOCKQUOTE, literal: '>' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'Blockquote' },
        { type: TokenType.NEWLINE, literal: '\n' },
        { type: TokenType.HORIZONTAL_RULE, literal: '---' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });

    it('should tokenize math expressions', () => {
      const input = '$1+2=3 $ x ^2 y ~1';
      const lexer = new Lexer(input);

      expectTokens(lexer, [
        { type: TokenType.MATH, literal: '$' },
        { type: TokenType.TEXT, literal: '1+2=3' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.MATH, literal: '$' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'x' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.SUPERSCRIPT, literal: '^' },
        { type: TokenType.TEXT, literal: '2' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.TEXT, literal: 'y' },
        { type: TokenType.SPACE, literal: ' ' },
        { type: TokenType.SUBSCRIPT, literal: '~' },
        { type: TokenType.TEXT, literal: '1' },
        { type: TokenType.EOF, literal: '' }
      ]);
    });
  });

  describe('readText', () => {
    it('should handle mixed text content', () => {
      const input = 'Hello, World! 123';
      const lexer = new Lexer(input);

      expectToken(lexer.nextToken(), { type: TokenType.TEXT, literal: 'Hello,' });
      expectToken(lexer.nextToken(), { type: TokenType.SPACE, literal: ' ' });
      expectToken(lexer.nextToken(), { type: TokenType.TEXT, literal: 'World!' });
      expectToken(lexer.nextToken(), { type: TokenType.SPACE, literal: ' ' });
      expectToken(lexer.nextToken(), { type: TokenType.TEXT, literal: '123' });
    });
  });

  // Regression for #21: block markers only count at the start of a line.
  describe('line-start block markers', () => {
    function types(input: string): Array<[TokenType, string]> {
      const lexer = new Lexer(input);
      const out: Array<[TokenType, string]> = [];
      for (let t = lexer.nextToken(); t.type !== TokenType.EOF; t = lexer.nextToken()) {
        out.push([t.type, t.literal]);
      }
      return out;
    }

    it.each([
      ['C# is great', '#'],
      ['a > b', '>'],
      ['well-known term', '-'],
      ['x - y', '-'],
      ['a --- b', '---'],
      ['x - [ ] y', '-'],
      ['a * b', '*'],
    ])('%j lexes the mid-line marker as TEXT', (input, marker) => {
      const tokens = types(input);
      expect(tokens).toContainEqual([TokenType.TEXT, marker]);
      const blockTypes = [
        TokenType.HEADER1, TokenType.BLOCKQUOTE, TokenType.LIST_ITEM, TokenType.UNORDERED_LIST,
        TokenType.HORIZONTAL_RULE, TokenType.CHECKLIST, TokenType.CHECKLIST_CHECKED,
      ];
      expect(tokens.filter(([type]) => blockTypes.includes(type))).toEqual([]);
    });

    it('needs a space or end of line after # for a header', () => {
      expect(types('#tag')[0]).toEqual([TokenType.TEXT, '#']);
      expect(types('####### x')[0]).toEqual([TokenType.TEXT, '#######']);
      expect(types('#')[0]).toEqual([TokenType.HEADER1, '#']);
      expect(types('## x')[0]).toEqual([TokenType.HEADER2, '##']);
    });

    it('recognizes markers after indentation and after a newline', () => {
      expect(types('  # H')).toContainEqual([TokenType.HEADER1, '#']);
      expect(types('\t> q')).toContainEqual([TokenType.BLOCKQUOTE, '>']);
      expect(types('a\n- b').map(([type]) => type)).toContain(TokenType.LIST_ITEM);
      expect(types('a\n* b')).toContainEqual([TokenType.UNORDERED_LIST, '*']);
      expect(types('a\n---')).toContainEqual([TokenType.HORIZONTAL_RULE, '---']);
      expect(types('a\n- [x] b')).toContainEqual([TokenType.CHECKLIST_CHECKED, '- [x]']);
    });

    it('keeps inline emphasis working mid-line', () => {
      expect(types('a *i* **b** ~~s~~').map(([type]) => type)).toEqual([
        TokenType.TEXT, TokenType.SPACE,
        TokenType.ITALIC, TokenType.TEXT, TokenType.ITALIC, TokenType.SPACE,
        TokenType.BOLD, TokenType.TEXT, TokenType.BOLD, TokenType.SPACE,
        TokenType.STRIKETHROUGH, TokenType.TEXT, TokenType.STRIKETHROUGH,
      ]);
      // The closing `*` before a space is emphasis, not a list marker.
      expect(types('*a* b')[2]).toEqual([TokenType.ITALIC, '*']);
    });
  });
});
