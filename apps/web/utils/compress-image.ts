export async function compressImage(
    file: File,
    maxWidth = 1000,
    quality = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject("Error al leer la imagen");
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No se pudo obtener el contexto del canvas");

        const scale = Math.min(maxWidth / img.width, 1);
        const width = img.width * scale;
        const height = img.height * scale;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Error al comprimir la imagen");
            const compressedFile = new File([blob], file.name, {
              type: "image/webp",
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }