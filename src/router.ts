import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Crowller from './utils/crowller';
import BookAnalyzer from './utils/bookAnalyzer';
import { getResponseData } from './utils/util';


const router = Router();

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.send(getResponseData(false, '请登录后查看'));
  }
}

router.get('/', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
      <html>
        <body>
          <a href="/getData"> 爬取数据</a>
          <a href="/showData"> 展示数据</a>
          <a href="/logout"> 退出</a>
        </body>
      </html>
    `)
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password"/>
            <button>提交</button>
          </form>
        </body>
      </html>
    `)
  }
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  const {password} = req.body
  if (isLogin) {
    res.send(getResponseData(false, `${req.customProp}, 已登录`));
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      res.send(getResponseData(true));
    } else {
      res.send(getResponseData(false, `${req.customProp}, 登录失败`));
    }
  }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.send(getResponseData(true));
});

router.get('/getData', checkLogin, (req: RequestWithBody, res: Response) => {
  const url = 'https://book.douban.com/';
  const analyzer = BookAnalyzer.getInstance();
  new Crowller(url, analyzer);
  res.send(getResponseData(true));
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
  try {
    const filePath = path.resolve(__dirname, '../data/book.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.send(getResponseData(JSON.parse(content)));
  } catch (e){
    res.send(getResponseData(false, `尚未爬取到内容`));
  }
});
export default router;