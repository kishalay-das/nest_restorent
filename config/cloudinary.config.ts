import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvt8qhmnx',
    api_key: process.env.CLOUDINARY_API_KEY || '882453148558948',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'jENibGci_5278FCQgYgw_0XBdcw',
    secure: true,
    
});

export { cloudinary };
