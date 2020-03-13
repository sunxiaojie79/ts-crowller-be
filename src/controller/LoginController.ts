import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import { get, controller} from './decorator';

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller
class LoginController {
  @get('/login')
  login(){}

  @get('/')
  home(req: RequestWithBody, res: Response){
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
  }
}