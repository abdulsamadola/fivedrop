import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.69l.71.71C13.44 4.13 18 8.58 18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-4.42 4.56-8.87 5.29-9.6l.71-.71z"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
