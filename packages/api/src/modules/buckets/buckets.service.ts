import { S3Client } from "bun";

type FileFolder = "logos" | "employees";

export class FilesService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      region: process.env.S3_REGION || "us-east-1",
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET!,
    });
  }

  async uploadFile(
    file: File,
    folder: FileFolder
  ): Promise<
    | {
        success: true;
        s3Url: string;
        publicUrl: string;
        s3Key: string;
      }
    | {
        success: false;
        message: string;
      }
  > {
    try {
      if (!file) {
        throw new Error("No se proporcionó ningún archivo");
      }

      if (!process.env.S3_BUCKET) {
        throw new Error("No se configuró el bucket de S3");
      }

      const bucket = process.env.S3_BUCKET;
      const region = process.env.S3_REGION || "us-east-1";
      const endpoint = process.env.S3_ENDPOINT;
      // Optional public URL base for CDN/CloudFront (e.g., https://cdn.example.com or https://bucket.project.supabase.co/storage/v1/object/public)
      const publicUrlBase = process.env.S3_PUBLIC_URL_BASE;

      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const timestamp = Date.now();
      const filePath = `${folder}/${timestamp}_${fileName}`;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const fileBlob = new Blob([arrayBuffer], { type: file.type });

        // Upload file to S3 using Bun's S3Client with public-read ACL
        const s3File = this.s3Client.file(filePath, {
          type: file.type,
        });
        // Upload with public-read ACL so files are accessible without authentication
        await s3File.write(fileBlob, {
          acl: "public-read",
        });

        // Generate public URL - prefer custom public URL base if configured, otherwise use standard S3 URL
        let publicUrl: string;
        if (publicUrlBase) {
          // If public URL base is set (e.g., for Supabase Storage or CDN)
          // Remove trailing slash if present
          const baseUrl = publicUrlBase.replace(/\/$/, "");
          // For Supabase Storage format: https://bucket.project.supabase.co/storage/v1/object/public/bucket-name/logos/file.jpg
          // For custom CDN: https://cdn.example.com/logos/file.jpg
          publicUrl = `${baseUrl}/${filePath}`;
        } else if (endpoint && endpoint.includes("supabase.co")) {
          // Detect Supabase Storage and generate public URL
          // Endpoint format: https://[project-id].supabase.co/storage/v1/s3
          // Public URL format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
          const supabaseProjectMatch = endpoint.match(/https:\/\/([^.]+)\.supabase\.co/);
          if (supabaseProjectMatch) {
            const projectId = supabaseProjectMatch[1];
            publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
          } else {
            // Fallback to endpoint-based URL if parsing fails
            publicUrl = `${endpoint.replace("/s3", "")}/object/public/${bucket}/${filePath}`;
          }
        } else if (endpoint) {
          // Custom endpoint (e.g., other S3-compatible services)
          publicUrl = `${endpoint}/${bucket}/${filePath}`;
        } else {
          // Standard AWS S3 URL
          publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
        }

        // Legacy S3 URL for backward compatibility
        const s3Url = endpoint
          ? `${endpoint}/${bucket}/${filePath}`
          : `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;

        return {
          success: true,
          s3Url,
          publicUrl,
          s3Key: filePath,
        };
      } catch (error) {
        console.error("Error processing file:", error);
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al subir el archivo",
      };
    }
  }

  async getSignedUrl(
    s3Key: string,
    expiresIn: number = 3600
  ): Promise<
    | {
        success: true;
        signedUrl: string;
      }
    | {
        success: false;
        message: string;
      }
  > {
    try {
      if (!process.env.S3_BUCKET) {
        throw new Error("No se configuró el bucket de S3");
      }

      const s3File = this.s3Client.file(s3Key);
      const signedUrl = s3File.presign({
        expiresIn,
      });

      return {
        success: true,
        signedUrl,
      };
    } catch (error) {
      console.error("Error al generar URL firmada:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al generar URL firmada",
      };
    }
  }

  async getSignedUrls(
    s3Keys: string[],
    expiresIn: number = 3600
  ): Promise<
    | {
        success: true;
        signedUrls: Record<string, string>;
      }
    | {
        success: false;
        message: string;
      }
  > {
    try {
      if (!process.env.S3_BUCKET) {
        throw new Error("No se configuró el bucket de S3");
      }

      const signedUrls: Record<string, string> = {};

      for (const s3Key of s3Keys) {
        try {
          const s3File = this.s3Client.file(s3Key);
          const signedUrl = s3File.presign({
            expiresIn,
          });
          signedUrls[s3Key] = signedUrl;
        } catch (error) {
          console.error(`Error generando URL para ${s3Key}:`, error);
        }
      }

      return {
        success: true,
        signedUrls,
      };
    } catch (error) {
      console.error("Error al generar URLs firmadas:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al generar URLs firmadas",
      };
    }
  }

  async downloadFile(s3Key: string): Promise<
    | {
        success: true;
        blob: Blob;
      }
    | {
        success: false;
        message: string;
      }
  > {
    try {
      if (!process.env.S3_BUCKET) {
        throw new Error("No se configuró el bucket de S3");
      }

      const s3File = this.s3Client.file(s3Key);
      const arrayBuffer = await s3File.arrayBuffer();
      const blob = new Blob([arrayBuffer]);

      return {
        success: true,
        blob,
      };
    } catch (error) {
      console.error("Error al descargar archivo:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al descargar archivo",
      };
    }
  }

  async deleteFileFromS3(s3Key: string): Promise<
    | {
        success: true;
      }
    | {
        success: false;
        message: string;
      }
  > {
    try {
      if (!process.env.S3_BUCKET) {
        throw new Error("No se configuró el bucket de S3");
      }

      const s3File = this.s3Client.file(s3Key);
      await s3File.delete();

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar archivo",
      };
    }
  }
}
