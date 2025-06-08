import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ value, size = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = size;
      canvas.height = size;

      QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(() => {
        console.log('QR code generated successfully');
      }).catch((error) => {
        console.error('Failed to generate QR code:', error);

        // Fallback: draw a placeholder
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code', size / 2, size / 2 - 6);
        ctx.fillText('Error', size / 2, size / 2 + 6);
      });
    }
  }, [value, size]);

  if (!value) {
    return (
      <div 
        className="qr-placeholder" 
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#666',
          border: '1px solid #ddd'
        }}
      >
        No URL
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  );
};

export default QRCodeGenerator;
