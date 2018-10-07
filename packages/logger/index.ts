type ReportItem = unknown;

export interface Logger {
    (...ReportItem): void;
    debug(...ReportItem): void;
    info(...ReportItem): void;
    warn(...ReportItem): void;
    error(...ReportItem): void;
}

export interface Reporter {
    log(scope: string, level: string, items: ReportItem[]): void;
}

class BasicReporterConsole implements Reporter {
    log(scope: string, level: string, items: ReportItem[]): void {
        let method = 'log';
        if(typeof console[level] === 'function'){
            method = level;
        }
        console[method](`[${scope}][${level}]`, ...items);
    }
}

export default function getScope(scope: string): Logger {
    const logger: any = (...items: ReportItem[]) => {
        sendToReporter(scope, 'info', items);
    };
    logger.debug = function(...items: ReportItem[]){
        sendToReporter(scope, 'debug', items);
    };
    logger.info = function(...items: ReportItem[]){
        sendToReporter(scope, 'info', items);
    };
    logger.warn = function(...items: ReportItem[]){
        sendToReporter(scope, 'warn', items);
    };
    logger.error = function(...items: ReportItem[]){
        sendToReporter(scope, 'error', items);
    };

    return logger;
}

export const reporters: Reporter[] = [new BasicReporterConsole()];

const sendToReporter = function(scope: string, level: string, items: ReportItem[]): void {
    reporters.forEach(reporter => reporter.log(scope, level, items));
}
