// import { join } from 'path';
// import { FilestoreFile } from '../../bucket/file';
// import { setKnowledgeBox, storeKnowledgeBox } from './knowledge-box';
// import { getExtension } from '../utils/get-extension';
// import { generateCustomName } from '../utils/generate-name';
// import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
// import * as Busboy from 'busboy';

// const model = new EmbeddingsAPI();

// interface IFileSpecs {
//     project?: string;
//     type?: string;
//     container?: string;
//     userId?: string;
//     knowledgeBoxId?: string;
// }

// /**
//  *
//  * @param req
//  * @param res
//  * @returns
//  */
// export /*bundle*/ const uploader = async function (req, res) {
//     const FILES = new Map();
//     const fields: IFileSpecs = {};

//     try {
//         const filePaths = [];
//         const fileManager = new FilestoreFile();
//         const bb = Busboy({ headers: req.headers });
//         bb.on('file', (nameV, file, info) => {
//             const { filename, mimeType } = info;
//             const name = `${generateCustomName(filename)}${getExtension(mimeType)}`;
//             // let dest = join(fields.project, fields.userId, fields.type, fields.container, name);
//             // dest = dest.replace(/\\/g, '/');

//             let dest = 'HELLO';
//             console.log('fields', fields);
//             console.log('dest', dest);
//             const bucket = fileManager.getFile(dest);
//             FILES.set(name, { file, bucket, dest });

//             file.on('data', () => console.log('reading', info.filename));
//             // file.pipe(bucket.createWriteStream(dest));
//         });
//         bb.on('field', (name, val, info) => {
//             console.log('fields', name, val);
//             fields[name] = val;
//         });

//         console.log('AQUI');
//         // Escuchar el evento 'finish' cuando la carga del formulario está completa
//         bb.on('finish', () => {
//             console.log('AQUI ------------------------------');
//             console.log(FILES, fields);
//             const { project, type, container, userId, knowledgeBoxId } = fields;
//             FILES.forEach(({ file, bucket, dest }) => console.log(1, !!file, !!bucket, dest));
//             FILES.forEach(({ file, bucket, dest }) => {
//                 let dest = join(fields.project, fields.userId, fields.type, fields.container, name);
//                 dest = dest.replace(/\\/g, '/');
//                 file.pipe(bucket.createWriteStream(dest));
//             });

//             // Enviar una respuesta al cliente
//             res.writeHead(200, { 'Content-Type': 'text/plain' });
//             res.end('Formulario procesado con éxito');
//         });

//         return req.pipe(bb);
//     } catch (error) {
//         console.log(500, error);
//         res.json({
//             status: false,
//             error: `Error uploading file(s): ${error.message}`,
//         });
//     }
// };

// // bb.on('finish', () => {
// //     console.log('estamos aqui?');

// //     // // publish on firestore
// //     // const id = await storeKnowledgeBox({ container, userId, knowledgeBoxId, docs: filePaths });
// //     // // update embedding
// //     // (async () => {
// //     //     try {
// //     //         const response = await model.update(join(project, userId, type, container), { container });
// //     //         if (!response.status) setKnowledgeBox(id, { status: 'failed' });
// //     //         else setKnowledgeBox(id, { status: 'ready' });
// //     //     } catch (e) {
// //     //         setKnowledgeBox(id, { status: 'failed' });
// //     //     }
// //     // })();
// //     // res.writeHead(200, { Connection: 'close' });
// //     // res.json({
// //     //     status: true,
// //     //     data: { knowledgeBoxId: 'id', message: 'File(s) uploaded successfully' },
// //     // });
// // });
