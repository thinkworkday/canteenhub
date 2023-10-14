import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Uppy from '@uppy/core';
import { Dashboard, useUppy } from '@uppy/react';
import { useEffect, useState } from 'react';

// const uppy = new Uppy({
//   meta: { type: 'avatar' },
//   restrictions: { maxNumberOfFiles: 1 },
//   autoProceed: true,
// });

// uppy.use(Tus, { endpoint: '/upload' });

// uppy.on('complete', (result) => {
//   const url = result.successful[0].uploadURL;
//   // store.dispatch({
//   //   type: 'SET_USER_AVATAR_URL',
//   //   payload: { url },
//   // });
// });

const FileUploaderBasic = ({ currentAvatar }) => {
  const uppy = useUppy(() => new Uppy());

  useEffect(() => () => uppy.close(), []);

  return (
    <div>
      {/* <img src={currentAvatar} alt="Current Avatar" /> */}
      <Dashboard uppy={uppy} />
    </div>
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
