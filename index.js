// var exec = require('child_process').exec;

// var cmdStr = 'curl http://www.weather.com.cn/data/sk/101010100.html';

// exec(cmdStr, function (err, stdout, stderr) {

//   if (err) {

//     console.log('get weather api error:' + stderr);

//   } else {

//     /*

//     这个stdout的内容就是上面我curl出来的这个东西：

//     {"weatherinfo":{"city":"北京","cityid":"101010100","temp":"3","WD":"西北风","WS":"3级","SD":"23%","WSE":"3","time":"21:20","isRadar":"1","Radar":"JC_RADAR_AZ9010_JB","njd":"暂无实况","qy":"1019"}}

//     */

//     var data = JSON.parse(stdout);

//     console.log(data);

//   }

// })


// const spawn = require('child_process').spawn;
// const ls = spawn('ls', ['-lh', '/usr']);
// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });
// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });



// const spawn = require('child_process').spawn;
// const ls = spawn('open', ['-a', 'terminal']);
// ls.stdin.write('aaaa')
// ls.stdin.on('data', (data) => {
//   console.log(`stdin: ${data}`);
// });
// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// const spawn = require('child_process').spawn;
// const child = spawn('ls', ['-lh', '/usr'])
// child.stdout.on('data', (data) => console.log(data.toString()));
// child.stderr.on('data', (data) => console.log(data.toString()));


// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// rl.question('你如何看待 nodejs 中文网? ', (answer) => {
//   // TODO : 将答案记录在数据库中
//   console.log(answer);
//   rl.close()
// })

function deepFreeze(obj) {

  // 取回定义在obj上的属性名
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性
  propNames.forEach(function (name) {
    var prop = obj[name];
    console.log('name', name);
    console.log('prop', prop);
    // 如果prop是个对象，冻结它
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj);
}

obj2 = {
  internal: {
    b: {
      c: {}
    }
  }
};
deepFreeze(obj2);
obj2.internal.a = 'anotherValue';
obj2.internal.a; // undefined