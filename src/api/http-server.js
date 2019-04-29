// import http from 'http'
// import fileSystem from 'fs'
// import path from 'path'

const responseFile = () => {
//   // http.createServer(function(request, response) {
//   const projDir = '/Users/dmitriyshch/projects/vue/testproj1'
//   let filePath = path.join(projDir, 'proj1.zip');
//   let stat = fileSystem.statSync(filePath);

//   response.writeHead(200, {
//       'Content-Type': 'application/zip',
//       'Content-Length': stat.size
//   });

//   var readStream = fileSystem.createReadStream(filePath);
//   // We replaced all the event handlers with a simple call to readStream.pipe()
//   readStream.pipe(response);
// // }).listen(2000);
}

export default { responseFile }