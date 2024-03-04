const Loader = () => {
  return (
    <div className={'fixed top-0 left-0 w-full h-full bg-white'}>
      <div
        className={
          'border-solid border-[16px] border-[#f3f3f3] border-t-[#ff5630] rounded-[50%] w-[120px] h-[120px] animate-spin-slow absolute top-[calc(50%-60px)] left-[calc(50%-60px)]'
        }
      />
    </div>
  )
}

export default Loader
