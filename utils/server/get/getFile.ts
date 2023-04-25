
interface IGetFileArgs {
    token: string;
    fileName: string;
    fileType: string;
    folder: string;
}

const getFile = async ({
    token,
    fileName,
    fileType,
    folder
}: IGetFileArgs): Promise<string | null> => {
  try {
    const queryParams = new URLSearchParams();
              
    queryParams.append("folder", folder);
    queryParams.append("name", fileName);
    queryParams.append("type", fileType);
    const response = await fetch(
        `${
            process.env.apiUrl
          }/files/download?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(
        new Blob([blob]),
    );

    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getFile;
