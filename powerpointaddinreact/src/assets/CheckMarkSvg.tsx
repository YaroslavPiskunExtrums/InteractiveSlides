const CheckMarkSvg = ({ height = 24, width = 24 }: { height?: number; width?: number }) => (
  <svg
    id="copy-to-clipboard-copied-icon"
    xmlns="http://www.w3.org/2000/svg"
    width={width || 24}
    height={height || 24}
    viewBox="0 0 24 24"
  >
    <title>Copied</title>
    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
  </svg>
)

export default CheckMarkSvg
