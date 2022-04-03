import { FormField, Label } from '@ht-ctrl/ui-form';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

import styles from './file-upload.module.scss';

type Props = {} & FormField & ReturnType<typeof useFileUpload>;

export const FileUpload = ({ label, id, getInputProps, getRootProps, hasFiles, isDragActive, files }: Props) => {
  return (
    <Label id={id} label={label}>
      <div className={styles.wrapper} {...getRootProps()}>
        <input {...getInputProps()} />
        {!hasFiles &&
          (isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>)}
        {files.map((file) => {
          return <li key={file.name}>{file.name}</li>;
        })}
      </div>
    </Label>
  );
};

const useFileUpload = ({ id, ...options }: DropzoneOptions & Pick<FormField, 'id'>) => {
  const [files, setFiles] = useState<File[]>([]);
  const hasFiles = !isEmpty(files);

  const onDrop: typeof options.onDrop = useCallback((acceptedFiles, fileRejections, event) => {
    setFiles(acceptedFiles);
    options?.onDrop?.(acceptedFiles, fileRejections, event);
    // Do something with the files
  }, []);

  const dropzone = useDropzone({ onDrop, ...options });

  return { hasFiles, files, setFiles, id, ...dropzone };
};

FileUpload.useFileUpload = useFileUpload;
