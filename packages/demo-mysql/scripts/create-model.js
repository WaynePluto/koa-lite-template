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

    const modelFilePath = path.join(__dirname, '..', 'src', 'modules', tableName, 'model.ts');
    const modelDirPath = path.dirname(modelFilePath);

    // 如果目录不存在则创建目录
    if (!fs.existsSync(modelDirPath)) {
      fs.mkdirSync(modelDirPath, { recursive: true });
    }

    // 生成模型文件的内容
    const modelContent = generateModelContent(tableName, tableFields);
    fs.writeFileSync(modelFilePath, modelContent);

    console.log(`Generated model file for table "${tableName}" at "${modelFilePath}"`);
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
      return 'Date';

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
    .map(({ name, type }) => `${toCamelCase(name)}: ${convertToTypeScriptType(type)};`)
    .join('\n  ');

  const ModelName = toPascalCase(tableName) + 'Model';
  const ClassName = toPascalCase(tableName) + 'Repository';

  return `import { Knex } from 'knex';

interface ${ModelName} {
  ${fieldDefinitions}
}

export class ${ClassName} {
  constructor(readonly db: Knex) {}

  private get queryBuilder() {
    return this.db<${ModelName}, ${ModelName}[]>('${tableName}');
  }

  create(data: Partial<Omit<${ModelName}, 'id'>>) {
    return this.queryBuilder.insert(data);
  }

  getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.queryBuilder.select().limit(pageSize).offset(offset);
  }

  findById(id: number | string) {
    return this.queryBuilder.where('id', id).first();
  }

  updateById(id: number | string, data: Partial<Omit<${ModelName}, 'id'>>) {
    return this.queryBuilder.where('id', id).update(data);
  }

  deleteById(id: number | string) {
    return this.queryBuilder.where('id', id).delete();
  }
}`;
}
