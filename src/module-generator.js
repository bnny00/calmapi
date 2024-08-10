'use strict';
const CURR_DIR = process.cwd();
const fs = require('fs');
const pluralize = require('pluralize');
const chalk = require('chalk');
const caseChanger = require('case');

module.exports = async function(modulePath, isForce = false, result = null) {
    try {
        const modulePathArr = modulePath.split('/');
        const finalModulePath = `${CURR_DIR}/src/modules`;
        let finalModuleName = modulePathArr;
        if(!isForce) {
            finalModuleName = pluralize.singular(modulePathArr.pop());
        }
        const kebabCase = caseChanger.kebab(finalModuleName);
        const moduleDirPath = `${finalModulePath}/${kebabCase}`;
        const templatePath = `${__dirname}/../resource/modules/sample`;

        console.log(chalk.blueBright(`Creating Module: ${finalModuleName}`));
        console.log(chalk.blueBright(`Creating Directory: ${kebabCase}`));
        try {

            fs.mkdirSync(`${moduleDirPath}`);
        } catch (err) {
            console.log('Already exists directory');
        }
        console.log(chalk.blueBright('Generating Files'));
        // eslint-disable-next-line no-use-before-define
        await createDirectoryContents(templatePath, finalModuleName, moduleDirPath, result);
        if(result) {
            
        }
        console.log(chalk.blueBright('Module Generation Complete'));
    } catch (error) {
        if(error.code === 'EEXIST') {
            console.error(chalk.redBright('Module already exists.'));
        } else {
            console.error(chalk.redBright(error.message));
        }
    }
};

const modelJsonFormatting = function(schema) {
    const newSchema = { ...schema, 'IMO_No': {
        'type': 'String',
        'required': true,
    }, 'createdBy': {
        'type': 'Schema.Types.ObjectId',
        'ref': 'user'
    },
    'updatedBy': {
        'type': 'Schema.Types.ObjectId',
        'ref': 'user'
    } };
    const jsonSchema = JSON.stringify(newSchema, null, '\t').replace(/\n\t/g, '\n\t\t\t').replace(/\"/g, '\'').replace(/\t/g, '    ');

    // let newschmea = jsonSchema.slice(3, jsonSchema.length - 1);

    // newschmea = `${ newschmea } `;

    return jsonSchema;
};

// eslint-disable-next-line func-style
async function createDirectoryContents(templatePath, moduleName, moduleWritePath, schema) {
    try {
        const filesToCreate = fs.readdirSync(templatePath);
        filesToCreate.forEach((file) => {
            const origFilePath = `${templatePath}/${file}`;

            // get stats about the current file
            const stats = fs.statSync(origFilePath);

            if (stats.isFile()) {
                let contents = fs.readFileSync(origFilePath, 'utf8');
                const PascalCase = caseChanger.pascal(moduleName);
                const camelCase = caseChanger.camel(moduleName);
                const kebabCase = caseChanger.kebab(moduleName);
                switch (file) {
                    case 'sample.controller.js':
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.controller.js`;
                        contents = contents.replace(/MODULE_SINGULAR_PASCAL/g, PascalCase);
                        contents = contents.replace(/MODULE_SINGULAR_CAMEL/g, camelCase);
                        contents = contents.replace(/MODULE_SINGULAR_KEBAB/g, kebabCase);
                        break;
                    case 'sample.dto.js':
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.dto.js`;
                        break;
                    case 'sample.model.js':
                        contents = contents.replace(/MODULE_SINGULAR_PASCAL/g, PascalCase);
                        contents = contents.replace(/MODULE_SINGULAR_CAMEL/g, camelCase);
                        contents = contents.replace(/MODULE_SINGULAR_KEBAB/g, kebabCase);

                        if (schema && Object.keys(schema).length > 0) {
                            contents = contents.replace(/MODULE_SCHEMA/g, modelJsonFormatting(schema));
                        }
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.model.js`;
                        break;
                    case 'sample.route.js':
                        contents = contents.replace(/MODULE_SINGULAR_PASCAL/g, PascalCase);
                        contents = contents.replace(/MODULE_SINGULAR_CAMEL/g, camelCase);
                        contents = contents.replace(/MODULE_SINGULAR_KEBAB/g, kebabCase);
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.route.js`;
                        break;
                    case 'sample.service.js':
                        contents = contents.replace(/MODULE_SINGULAR_PASCAL/g, PascalCase);
                        contents = contents.replace(/MODULE_SINGULAR_CAMEL/g, camelCase);
                        contents = contents.replace(/MODULE_SINGULAR_KEBAB/g, kebabCase);
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.service.js`;
                        break;
                    case 'sample.settings.js':
                        // eslint-disable-next-line no-param-reassign
                        file = `${kebabCase}.settings.js`;
                        break;
                    default:
                        break;
                }
                const writePath = `${moduleWritePath}/${file}`;
                console.log(chalk.greenBright(writePath));
                fs.writeFileSync(writePath, contents, 'utf8');
            }

        });
    } catch (error) {}
}
