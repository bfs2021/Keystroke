import { Lexer } from '../src/Lexer';
import { Parser } from '../src/Parser';
import { Renderer } from '../src/Renderer';

describe('Markdown Interpreter', () => {
    function processMarkdown(input: string): string {
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const renderer = new Renderer();
        const ast = parser.parse();
        return renderer.render(ast);
    }

    describe('Headers', () => {
        it('should process headers correctly', () => {
            const input = '# Header 1 \n## Header 2 \n### Header 3';
            const expected = '<h1>Header 1</h1>\n<h2>Header 2</h2>\n<h3>Header 3</h3>\n';
            expect(processMarkdown(input)).toBe(expected);
        });
    });

    describe('Text Formatting', () => {
        it('should process bold text correctly', () => {
            const input = '**Bold text**';
            const expected = '<b>Bold text</b>';
            expect(processMarkdown(input)).toBe(expected);
        });

        it('should process italic text correctly', () => {
            const input = '_Italic text_';
            const expected = '<i>Italic text</i>';
            expect(processMarkdown(input)).toBe(expected);
        });
    });

    // describe('Lists', () => {
    //     it('should process unordered lists correctly', () => {
    //         const input = '* Item 1\n* Item 2';
    //         const expected = '<ul><li>Item 1</li>\n<li>Item 2</li>\n</ul>\n';
    //         expect(processMarkdown(input)).toBe(expected);
    //     });

    //     it('should process checklists correctly', () => {
    //         const input = '- [ ] Todo\n- [x] Done';
    //         const expected = '<li><input type="checkbox">Todo</li>\n<li><input type="checkbox" checked>Done</li>\n';
    //         expect(processMarkdown(input)).toBe(expected);
    //     });
    // });

    describe('Links', () => {
        it('should process links correctly', () => {
            const input = '[Example](https://example.com)';
            const expected = '<a href="https://example.com">Example</a>';
            expect(processMarkdown(input)).toBe(expected);
        });
    });

    describe('Math', () => {
        it('should process math expressions correctly', () => {
            const input = '$1+2=3 $';
            const expected = '<span class="math">1+2=3</span>';
            expect(processMarkdown(input)).toBe(expected);
        });

        it('should process superscript correctly', () => {
            const input = '$x ^2  $';
            const expected = '<span class="math">x <sup>2</sup></span>';
            expect(processMarkdown(input)).toBe(expected);
        });

        it('should process subscript correctly', () => {
            const input = '$x ~n  $';
            const expected = '<span class="math">x <sub>n</sub></span>';
            expect(processMarkdown(input)).toBe(expected);
        });
    });

    describe('Complex Documents', () => {
        it('should process mixed content correctly', () => {
            const input = `# Title
**Bold**and*italic*
* List item 1
* List item 2
> Quote
[Link](https://example.com)`;

            const expected = '<h1>Title</h1>\n<b>Bold</b>and<i>italic</i><br>\n<ul><li>* List item 1</li>\n</ul>\n List item 2<br>\n<blockquote>Quote</blockquote>\n<a href="https://example.com">Link</a>';
            expect(processMarkdown(input)).toBe(expected);
        });

        it('should process math with mixed formatting correctly', () => {
            const input = '$f(x) = x ^2 + y ~1  $';
            const expected = '<span class="math">f(x) = x <sup>2</sup> + y <sub>1</sub></span>';
            expect(processMarkdown(input)).toBe(expected);
        });
    });

    // Regression for #20: text right after an inline construct was dropped.
    describe('Text after inline constructs', () => {
        it.each([
            ['**bold**x', '<b>bold</b>x'],
            ['**bold**, then', '<b>bold</b>, then'],
            ['**bold** then', '<b>bold</b> then'],
            ['a*b*c', 'a<i>b</i>c'],
            ['~~gone~~!', '<s>gone</s>!'],
            ['see [link](http://x.com).', 'see <a href="http://x.com">link</a>.'],
            ['`code`.', '<code>code</code>.'],
            ['$x$.', '<span class="math">x</span>.'],
            ['x^2 outside math', 'x<sup>2</sup> outside math'],
            ['y~1 outside math', 'y<sub>1</sub> outside math'],
            ['H~2~O', 'H<sub>2</sub>O'],
            ['**b**---tail', '<b>b</b><hr>\ntail'],
            ['---tail', '<hr>\ntail'],
            ['x^2^ y', 'x<sup>2</sup> y'],
            ['x^2^.', 'x<sup>2</sup>.'],
            ['$x^2^ + y~1~$', '<span class="math">x<sup>2</sup> + y<sub>1</sub></span>'],
        ])('%j preserves following text', (input, expected) => {
            expect(processMarkdown(input)).toBe(expected);
        });
    });
});
