export enum ParserState {
    STYLE_OPEN,
    TEXT
}

export enum ExpressionType {
    Text,
    Constant,
    KeyboardKey,
    Style,
    VariableNumber,
    VariableText,
    Root
}

export interface Expression {
    type: ExpressionType;
    content: string;
}

/**
 * split input string `s` into array of strings, split by `~`
 * @param s source
 */
export const tokenize = (s: string): string[] => {
    let pos = 0;
    let str = '';
    const tokens: string[] = [];

    while(pos < s.length){
        const char = s[pos];

        if(char === '~'){
            if(str){
                tokens.push(str);
                str = '';
            }
            tokens.push(char);
        } else {
            str += char;
        }

        pos = pos + 1;
    }

    if(str){
        tokens.push(str);
    }

    return tokens;
};

/**
 * parse input `s` into array of expressions
 * @param s source
 */
export const parse = (s: string): Expression[] => {
    let state: ParserState = ParserState.TEXT;
    const expressions: Expression[] = [];
    const tokens: string[] = tokenize(s);
    let content = '';

    const consumeToken = (count: number = 1) => {
        for(let i = 0; i < count; i++){
            tokens.shift();
        }
    };

    const pushCurrentState = () => {
        let type = ExpressionType.Text;
        if(state === ParserState.STYLE_OPEN){
            type = ExpressionType.Style;
            if(expressions.length > 0 && expressions[expressions.length - 1].type === ExpressionType.KeyboardKey){
                type = ExpressionType.Constant;
            }
            if(content === '1'){
                type = ExpressionType.VariableNumber;
            }
            if(content === 'a'){
                type = ExpressionType.VariableText;
            }
            if(content === 'k'){
                type = ExpressionType.KeyboardKey;
            }
        }
        if(content){
            expressions.push({ type, content });
        }
        state = ParserState.TEXT;
        content = '';
    };

    while(tokens.length > 0){
        const [token] = tokens;

        // style start
        if(token === '~' && state === ParserState.TEXT){
            pushCurrentState();
            consumeToken();
            state = ParserState.STYLE_OPEN;
            continue;
        }

        // style end
        if(token === '~' && state === ParserState.STYLE_OPEN){
            pushCurrentState();
            consumeToken();
            continue;
        }

        content += token;
        consumeToken();
    }

    pushCurrentState();
    return expressions;
};

export interface AstNode extends Expression {
    index: number;
    children?: AstNode[];
    parent?: AstNode;
}

export const buildAst = (expressions: Expression[]): AstNode => {
    const ast: AstNode = { index: -1, type: ExpressionType.Root, content: '', children: [] };
    let node = ast;
    let i = 0;

    const consume = (): Expression|undefined => {
        i++;
        return expressions.splice(0, 1)[0];
    };

    while(true){
        const exp = consume();
        if(!exp){
            break;
        }

        if(exp.type === ExpressionType.Style && node.parent && (exp.content === 'w' || exp.content === 'B')){
            const parent = node.parent;
            delete node.parent;
            node = parent;
        } else if(exp.type === ExpressionType.KeyboardKey){
            node.children!.push({ ...exp, index: i, children: [{ ...consume()!, index: i }]});
        } else if(exp.type === ExpressionType.Style){
            const subnode = { ...exp, index: i, children: [], parent: node };
            node.children!.push(subnode)
            node = subnode;
        } else {
            node.children!.push({ ...exp, index: i });
        }
    }

    return ast;
}
