// import React from 'react'
// type PixelsProps = {
//   pixelColors: number[][],
//   onPixelClick?: (rowIndex: number, colIndex: number) => void
// }

export default function Pixels({pixelColors, onPixelClick} ) { 
  return (
    <div className="flex flex-col aspect-square flex-grow">
          {pixelColors.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-grow">
              {row.map((color, colIndex) => (
                <div
                  key={colIndex}
                  className={"flex-grow border border-black " + (color === 1 ? 'bg-black' : 'bg-white')}
                  onClick={() => {
                    onPixelClick?.(rowIndex, colIndex)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
  )
}