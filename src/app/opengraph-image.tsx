import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FiveDrop - Content to Image Generator for Social Media'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.69l.71.71C13.44 4.13 18 8.58 18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-4.42 4.56-8.87 5.29-9.6l.71-.71z"
                fill="white"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            FiveDrop
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Turn your hooks into scroll-stopping images
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 50,
          }}
        >
          {['⚡ Fast', '🎨 Beautiful', '📱 All Platforms', '✨ Free'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  fontSize: 24,
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 24px',
                  borderRadius: 50,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          fivedrop.app
        </div>
      </div>
    ),
    { ...size }
  )
}
