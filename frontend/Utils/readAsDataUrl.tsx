export const readAsDataURL = (groupProfilePic: File | Blob) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject("Error reading file");
    };
    reader.readAsDataURL(groupProfilePic);
  });
};
