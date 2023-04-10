const fs = require('fs');
const path = require('path');

// 获取sql目录下的所有sql文件
const sqlDirPath = path.join(__dirname, '..', 'sql');
const sqlFiles = fs.readdirSync(sqlDirPath).filter(file => path.extname(file) === '.sql');

// 遍历所有sql文件，解析其中的create语句，生成对应的模型文件
for (const sqlFile of sqlFiles) {
  const filePath = path.join(sqlDirPath, sqlFile);
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' }).replace(/\(\d+\)/g, '');
  const regex = /CREATE TABLE\s+(\w+)\s+\(([\s\S]+?)\)/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const tableName = match[1];
    const tableFields = match[2].split(/\s*,\s*/).map(field => {
      field = field.replace(/UNSIGNED|AUTO_INCREMENT|PRIMARY KEY|NOT NULL|DEFAULT|CURRENT_TIMESTAMP/g, '').trim();
      const [name, type] = field.split(/\s+/).map(s => s.trim());
      if (!name || !type) {
        throw new Error(`Invalid field definition: ${field}`);
      }
      return { name, type };
    });

    const modelFilePath = path.join(__dirname, '..', 'src', 'modules', tableName, 'controller.ts');
    const modelDirPath = path.dirname(modelFilePath);

    // 如果目录不存在则创建目录
    if (!fs.existsSync(modelDirPath)) {
      fs.mkdirSync(modelDirPath, { recursive: true });
    }

    // 生成模型文件的内容
    const modelContent = generateModelContent(tableName, tableFields);
    fs.writeFileSync(modelFilePath, modelContent);

    console.log(`Generated controller file for table "${tableName}" at "${modelFilePath}"`);
  }
}
function convertToTypeScriptType(sqlType) {
  switch (sqlType.toUpperCase()) {
    case 'TINYINT':
    case 'SMALLINT':
    case 'MEDIUMINT':
    case 'INT':
    case 'BIGINT':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
    case 'INT UNSIGNED':
      return 'number';

    case 'BIT':
    case 'BOOLEAN':
      return 'boolean';

    case 'DATE':
    case 'DATETIME':
    case 'TIMESTAMP':
      return 'date';

    default:
      return 'string';
  }
}
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, function (match, group) {
    return group.toUpperCase();
  });
}
function toPascalCase(str) {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}
function generateModelContent(tableName, tableFields) {
  const fieldDefinitions = tableFields
    .map(
      ({ name, type }) =>
        `${toCamelCase(name)}: z.${convertToTypeScriptType(type)}()${name === 'id' ? '' : '.optional()'},`
    )
    .join('\n  ');

  const noIdFields = tableFields
    .filter(({ name }) => name !== 'id')
    .map(({ name, type }) => `${toCamelCase(name)}: z.${convertToTypeScriptType(type)}().optional(),`)
    .join('\n  ');

  const TableName = toPascalCase(tableName);

  const ClassName = TableName + 'Repository';

  return `import { Middleware } from 'koa';
import { z } from 'zod';
import { validateBody, validateQuery } from 'koa-lite-middlewares';
import { router } from '../../router';
import { ${ClassName} } from './model';

export function init${TableName}Route() {
  const prefix = '${tableName}';

  const route = router.createRoute(prefix);

  route.post('/', validateBody(createValidator), create${TableName});
  route.get('/', validateQuery(idValidator), get${TableName});
  route.patch('/', validateBody(upateValidator), update${TableName});
  route.delete('/', validateQuery(idValidator), delete${TableName});

  route.get('/list', validateQuery(pageValidator), get${TableName}List);
}

const createValidator = z.object({
  ${noIdFields}
});

const create${TableName}: Middleware = async (ctx, next) => {
  const ${tableName}Repo = new ${ClassName}(ctx.knex);
  ctx.body = await ${tableName}Repo.create(ctx.request.body);
  await next();
};

const idValidator = z.object({
  id: z.string()
});

const get${TableName}: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const ${tableName}Repo = new ${ClassName}(ctx.knex);
  ctx.body = await ${tableName}Repo.findById(query.id);
  await next();
};

const upateValidator = z.object({
  ${fieldDefinitions}
});

const update${TableName}: Middleware = async (ctx, next) => {
  const param = ctx.request.body as any as z.infer<typeof upateValidator>;
  const ${tableName}Repo = new ${ClassName}(ctx.knex);
  ctx.body = await ${tableName}Repo.updateById(param.id, param);
  await next();
};

const delete${TableName}: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const ${tableName}Repo = new ${ClassName}(ctx.knex);
  ctx.body = await ${tableName}Repo.deleteById(query.id);
  await next();
};

const pageValidator = z.object({
  page: z
    .string()
    .transform(val => Number(val))
    .refine(val => val > 0, 'page has to be greater than 0'),
  pageSize: z
    .string()
    .transform(val => Number(val))
    .refine(val => val > 0, 'pageSize has to be greater than 0')
});

const get${TableName}List: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof pageValidator>;
  const ${tableName}Repo = new ${ClassName}(ctx.knex);
  ctx.body = await ${tableName}Repo.getList(query.page, query.pageSize);
  await next();
};

`;
}
