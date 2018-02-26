export enum ParserState {
    STYLE_OPEN,
    TEXT
}

export enum ExpressionType {
    text,
    constant,
    key,
    style,
    variableNumber,
    variableText
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
        let type = ExpressionType.text;
        if(state === ParserState.STYLE_OPEN){
            type = ExpressionType.style;
            if(expressions.length > 0 && expressions[expressions.length - 1].type === ExpressionType.key){
                type = ExpressionType.constant;
            }
            if(content === '1'){
                type = ExpressionType.variableNumber;
            }
            if(content === 'a'){
                type = ExpressionType.variableText;
            }
            if(content === 'k'){
                type = ExpressionType.key;
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
