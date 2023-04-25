import { ChangeEventHandler, useEffect, useState } from "react";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function useUploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileDataURL, setFileDataURL] = useState<string | ArrayBuffer>("");

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e?.target?.files![0];
    if (!file?.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  };
  useEffect(() => {
    let fileReader: FileReader;
    let isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target!;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  return { fileDataURL, changeHandler, file, setFileDataURL };
}
