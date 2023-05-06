
class CompilerService {
    async exec(sourceCode: string): Promise<string> {
        return sourceCode;
    }
    
    async testOutput(testCases: any[], code: string) {
        testCases.forEach(async (testCase: any) => {
            const actual = await this.exec(code);
            if(actual === testCase.expectedOutput) {
                console.log('Passed!')
            }
            console.log('Failed!')
        });
    }
}

export default CompilerService;