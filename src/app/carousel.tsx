
export const Carousel = () => {
	return (
		<>
			<div className="carousel w-full">
				<div id="item1" className="carousel-item w-full">
					<img src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg" className="w-full" />
				</div>
				<div id="item2" className="carousel-item w-full">
					<img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" className="w-full" />
				</div>
				<div id="item3" className="carousel-item w-full">
					<img src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg" className="w-full" />
				</div>
				<div id="item4" className="carousel-item w-full">
					<img src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg" className="w-full" />
				</div>
			</div>
			<div className="flex justify-center w-full py-2 gap-2">
				<a href="#item1" className="btn btn-xs">1</a>
				<a href="#item2" className="btn btn-xs">2</a>
				<a href="#item3" className="btn btn-xs">3</a>
				<a href="#item4" className="btn btn-xs">4</a>
			</div>
		</>
	)
}