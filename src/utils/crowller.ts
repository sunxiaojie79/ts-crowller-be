import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

export default class Crowller {
  private filePath = path.resolve(__dirname, '../../data/book.json');
  constructor (private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }

  private async initSpiderProcess () {
    const html = await this.getRowHtml(this.url);
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }
  
  private async getRowHtml (url: string) {
    const result = await superagent.get(url);
    return result.text;
  }
  private writeFile (content: string) {
  fs.writeFileSync(this.filePath, content);
  }
  
}

