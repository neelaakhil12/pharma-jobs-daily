import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary via upload_stream
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'pharma-jobs-daily',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
