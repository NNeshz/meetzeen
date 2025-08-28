import { supabaseS3 } from "@meetzeen/s3/index";

type ImageFolder = "logos" | "employees";

class ImageServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ImageServiceError";
  }
}

export class ImageService {
  async createImage(image: File, folder: ImageFolder) {
    try {
      if (!image) {
        throw new ImageServiceError("Image file is required");
      }

      const fileName = `${Date.now()}.webp`;
      const filePath = `${folder}/${fileName}`;

      try {
        const uint8Array = new Uint8Array(await image.arrayBuffer());

        const writeResult = await supabaseS3.write(filePath, uint8Array);
        if (!writeResult) {
          throw new ImageServiceError("Failed to upload image to storage");
        }

        if (!process.env.SUPABASE_URL_BUCKET) {
          throw new ImageServiceError("Storage bucket URL is not configured");
        }

        const imageUrl = `${process.env.SUPABASE_URL_BUCKET}/${filePath}`;
        return imageUrl;
      } catch (error) {
        console.error("Error processing image:", error);
        if (error instanceof Error) {
          throw new ImageServiceError(
            "Failed to process or upload image",
            error
          );
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof ImageServiceError) {
        throw error;
      }
      throw new ImageServiceError(
        "Unexpected error while creating image",
        error
      );
    }
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl) {
        throw new ImageServiceError("Image URL is required");
      }

      if (!process.env.SUPABASE_URL_BUCKET) {
        throw new ImageServiceError("Storage bucket URL is not configured");
      }

      const oldImagePath = imageUrl.replace(
        `${process.env.SUPABASE_URL_BUCKET}/`,
        ""
      );

      if (oldImagePath === imageUrl) {
        throw new ImageServiceError("Invalid image URL format");
      }

      await supabaseS3.delete(oldImagePath);
      return true;
    } catch (error) {
      if (error instanceof ImageServiceError) {
        throw error;
      }
      throw new ImageServiceError("Failed to delete image", error);
    }
  }
}