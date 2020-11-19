const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');

const outputFilePath = path.resolve(__dirname, './4238.json');
const filePath = path.resolve(__dirname, './4238.xlsx')

try {
  fs.accessSync(outputFilePath)
  fs.unlinkSync(outputFilePath)
  console.log(`${outputFilePath} 已删除`);
} catch (err){
  console.log(err);
}

const sheets = xlsx.parse(filePath);
const names = sheets[0].data.flat()

const fileContent = `{"data":${JSON.stringify(names)}}`;

fs.appendFile(outputFilePath, fileContent, () => {
  console.log(`${outputFilePath} 已写入`, JSON.parse(fs.readFileSync(outputFilePath)))
})

// console.log(fs.readFileSync(outputFilePath));
