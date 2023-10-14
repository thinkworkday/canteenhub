import { useEffect, useState } from 'react';

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';

const FileUploaderBasic = () => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => ({ url: 'https://httpbin.org/post' });

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file); };

  // receives array of files that are done uploading when submit button is clicked
  // const handleSubmit = (files, allFiles) => {
  //   console.log(files.map((f) => f.meta));
  //   allFiles.forEach((f) => f.remove());
  // };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      // onSubmit={handleSubmit}
      accept="image/*"
      multiple={false}
      maxFiles={1}
      SubmitButtonComponent={null}
    />
  );
};

export default FileUploaderBasic;

// import { useState } from 'react';
// import Uppy from '@uppy/core';
// import thumbnailGenerator from '@uppy/thumbnail-generator';
// import { DragDrop } from '@uppy/react';
// import {
//   Card, CardHeader, CardTitle, CardBody,
// } from 'reactstrap';

// const FileUploaderBasic = () => {
//   const [img, setImg] = useState(null);

//   const uppy = new Uppy({
//     meta: { type: 'avatar' },
//     restrictions: { maxNumberOfFiles: 1 },
//     autoProceed: true,
//   });

//   uppy.use(thumbnailGenerator);

//   uppy.on('thumbnail:generated', (file, preview) => {
//     setImg(preview);
//   });
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle tag="h4"> Basic </CardTitle>
//       </CardHeader>
//       <CardBody>
//         <DragDrop uppy={uppy} />
//         {img !== null ? <img className="rounded mt-2" src={img} alt="avatar" /> : null}
//       </CardBody>
//     </Card>
//   );
// };

// export default FileUploaderBasic;
