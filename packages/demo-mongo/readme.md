# 初始化

## 数据库操作

### 使用 mongosh 创建数据库用户

```bash
 mongosh;
 use koa-lite;
 db.createUser({
  user:"koa",
  pwd:"koa-pass",
  roles:["readWrite"]
 })
```
