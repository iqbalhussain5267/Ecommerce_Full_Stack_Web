// import DataUriParser from 'datauri'

// import path from 'path'

// const parser=new DataUriParser()
// const getDataUri=(file)=>{
//   const extName=path.extname(file.originalname).toString();
//   return parser.formate(extName,file.buffer).content;
// }

// export default getDataUri;

import DatauriParser from 'datauri/parser.js'; // Exact ESM subpath for newer versions
import path from 'path';

const parser = new DatauriParser();

const getDataUri = (file) => {
  // Extract extension name (e.g., '.jpg', '.png')
  const extName = path.extname(file.originalname).toString(); 
  
  // FIXED: Changed 'formate' to 'format'
  return parser.format(extName, file.buffer).content; 
};

export default getDataUri;
