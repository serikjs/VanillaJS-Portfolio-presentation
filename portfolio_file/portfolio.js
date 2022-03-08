;('use strict')
window.onload = function (event) {
	let lenthSlider,
		slideIndex = 0

	const getData = async (url) => {
		let res = await fetch(url)
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status : ${res.status}`)
		}
		return await res.json()
	}

	//Карточка портфолио на главных страницах - portfolio card in main pages
	const mainElement = document.querySelector(
		'.portfolio__content .portfolio__card-main',
	)
	const sliderElem = document.querySelector('.slider_portfolio .slider_item'),
		sliderOffer = document.querySelector('.slider_portfolio .slider_offer'),
		slides = document.querySelectorAll('.slider_portfolio .slider_item')

	function renderContentCardMain(element, container, data) {
		let clone = mainElement.cloneNode(true)
		let cloneSlider = sliderElem.cloneNode(true)
		let slideNum = element['data-slide']

		let mainImg =
			clone.querySelector('.portfolio__card--image').getAttribute('data-src') +
			element['preview']
		clone.querySelector('.portfolio__card--image').setAttribute('src', mainImg)
		cloneSlider.querySelector('img').setAttribute('src', mainImg)

		let title = clone.querySelector('.portfolio__card-title')
		title.textContent = element['main-title']
		title.setAttribute('data-toslide', slideNum)

		const slideTitle = cloneSlider.querySelector('.slider_footer_title'),
			slideDesc = cloneSlider.querySelector('.slider_footer_descr'),
			slideNext = cloneSlider.querySelector('.slider_footer_button.next'),
			slidePrev = cloneSlider.querySelector('.slider_footer_button.prev'),
			slideNextSpan = cloneSlider.querySelector(
				'.slider_footer_button.next span',
			),
			slidePrevSpan = cloneSlider.querySelector(
				'.slider_footer_button.prev span',
			)

		slideTitle.textContent = element['main-title']
		slideDesc.textContent = element['main-description']

		element['is-darken']
			? title.classList.add('hover-white')
			: title.classList.add('hover-black')

		const sliderFooter = cloneSlider.querySelector('.slider_footer')
		if (element['main-slide-color'])
			sliderFooter.style.cssText = `background-color : ${element['main-slide-color']};`

		if (element['slide-white-color']) {
			slideTitle.classList.add('white')
			slideDesc.classList.add('white')
			cloneSlider.querySelectorAll('.slider_footer_button').forEach((item) => {
				item.classList.add('white')
			})
			cloneSlider.querySelector('.slider_viewcase').classList.add('white')
			cloneSlider.querySelector('.slide_seeportfolio').classList.add('white')
			cloneSlider.querySelector('.slider_dots').classList.add('white')
		}

		if (
			slideNum > 0 &&
			data[slideNum - 1] &&
			data[slideNum - 1]['main-title']
		) {
			slidePrevSpan.textContent = data[slideNum - 1]['main-title']
		} else {
			slidePrev.style.cssText = '	visibility: hidden;'
		}
		if (
			slideNum < lenthSlider &&
			data[slideNum + 1] &&
			data[slideNum + 1]['main-title']
		) {
			slideNextSpan.textContent = data[slideNum + 1]['main-title']
		} else {
			slideNext.style.cssText = '	visibility: hidden;'
		}

		clone.style.display = 'block'
		cloneSlider.style.display = 'block'
		container.append(clone)
		document
			.querySelector('.slider_portfolio .slider_offer')
			.append(cloneSlider)
	}

	getData('./portfolio_file/portfolio.json')
		.then((data) => {
			const container = document.querySelector('.portfolio__tab #web-design')
			let onlyMain = data['Web Design'].filter((item) => item['view-in-mpage'])
			onlyMain.forEach((element, i) => {
				element['data-slide'] = i
			})
			lenthSlider = onlyMain.length
			sliderOffer.style.width = 100 * lenthSlider + '%'

			const dotsWrapper = document.querySelector('.slider_dots')
			for (let i = 0; i < lenthSlider; i++) {
				const dot = document.createElement('li')
				dot.setAttribute('data-to-slide', i)
				dotsWrapper.append(dot)
				if (i == 0) {
					dot.classList.add('active')
				}
			}

			slides.forEach((slide) => {
				slide.style.width = 100 / lenthSlider + '%'
			})
			data['Web Design'].forEach((element, i) => {
				if (element['view-in-mpage'])
					renderContentCardMain(element, container, onlyMain)
			})
		})
		.finally(() => {
			let lastImg = null,
				enterTimer,
				imgConteiner = document.querySelector('.img-conteiner')

			const portfolioTitle = document.querySelectorAll(
					'.portfolio__card-title',
				),
				portfolioBlock = document.querySelector('.portfolio'),
				portfolioSection = document.querySelector('.portfolio-section'),
				portfolioHeader = document.querySelector('.portfolio_header'),
				slider = document.querySelector('.slider_portfolio'),
				portfolioContent = document.querySelector('.portfolio__content'),
				prev = document.querySelectorAll('.slider_footer_button.prev'),
				next = document.querySelectorAll('.slider_footer_button.next'),
				dotsWrappers = document.querySelectorAll('.slider_dots')

			function setActiveDot(slideIndex) {
				dotsWrappers.forEach((item) => {
					const dots = item.querySelectorAll('li')
					dots.forEach((dot) => {
						dot.classList.remove('active')
						if (+dot.getAttribute('data-to-slide') == slideIndex) {
							dot.classList.add('active')
						}
					})
				})
			}

			dotsWrappers.forEach((item) => {
				const dots = item.querySelectorAll('li')
				dots.forEach((dot) => {
					dot.addEventListener('click', (e) => {
						slideIndex = e.target.getAttribute('data-to-slide')
						sliderOffer.style.transform = `translateX(-${
							(slideIndex * 100) / lenthSlider
						}%)`
						setActiveDot(slideIndex)
					})
				})
			})

			next.forEach((btn) => {
				btn.addEventListener('click', () => {
					slideIndex++
					sliderOffer.style.transform = `translateX(-${
						(slideIndex * 100) / lenthSlider
					}%)`
					setActiveDot(slideIndex)
				})
			})
			prev.forEach((btn) => {
				btn.addEventListener('click', () => {
					slideIndex--
					sliderOffer.style.transform = `translateX(-${
						(slideIndex * 100) / lenthSlider
					}%)`
					setActiveDot(slideIndex)
				})
			})

			function enterMain(e) {
				enterTimer = window.setTimeout(function () {
					slideIndex = +e.target.getAttribute('data-toslide')
					sliderOffer.style.transform = `translateX(-${
						(slideIndex * 100) / lenthSlider
					}%)`
					setActiveDot(slideIndex)
					setTimeout(() => {
						slider.classList.remove('remove')
						slider.classList.add('active')
					}, 500)

					portfolioBlock.classList.remove('show')
					portfolioBlock.classList.add('remove')
				}, 1000)

				let mainImg = e.target.nextElementSibling
				let imgSource = e.target.nextElementSibling.getAttribute('src')
				portfolioTitle.forEach((item) => {
					if (item != e.target) {
						item.style.opacity = '0'
					}
				})

				if (mainImg != lastImg) {
					lastImg = mainImg
					imgConteiner.querySelector('img').classList.remove('show')
				}
				setTimeout(() => {
					if (!imgConteiner.classList.contains('show')) {
						imgConteiner.classList.add('show')
						imgConteiner.querySelector('img').setAttribute('src', imgSource)
						imgConteiner.querySelector('img').classList.add('show')
					} else {
						imgConteiner.querySelector('img').setAttribute('src', imgSource)
						imgConteiner.querySelector('img').classList.add('show')
					}
				}, 300)
			}
			function leaveMain(e) {
				clearInterval(enterTimer)
				imgConteiner.classList.remove('show')
				imgConteiner.querySelector('img').classList.remove('show')
				portfolioTitle.forEach((item) => {
					item.style.opacity = '1'
				})
			}

			function moveContainer(e) {
				if (!e.target.classList.contains('portfolio__card-title')) {
					imgConteiner.classList.remove('show')
				}
			}

			document.querySelectorAll('.slider_item img').forEach((img) => {
				img.addEventListener('click', () => {
					slider.classList.remove('active')
					slider.classList.add('remove')
					portfolioBlock.classList.remove('remove')
					portfolioBlock.classList.add('show')
				})
			})

			if (window.innerWidth > 1080) {
				portfolioTitle.forEach((item) => {
					item.addEventListener('mouseenter', enterMain)
				})
				portfolioTitle.forEach((item) => {
					item.addEventListener('mouseleave', leaveMain)
				})
				portfolioSection.addEventListener('mousemove', moveContainer)
			}
			window.addEventListener('resize', function () {
				if (window.innerWidth < 1080) {
					slider.classList.remove('active')
					portfolioHeader.style.display = 'block'
					portfolioContent.style.display = 'block'
					portfolioTitle.forEach((item) => {
						item.removeEventListener('mouseenter', enterMain)
					})
					portfolioTitle.forEach((item) => {
						item.removeEventListener('mouseleave', leaveMain)
					})
					portfolioSection.removeEventListener('mousemove', moveContainer)
				} else {
					portfolioTitle.forEach((item) => {
						item.addEventListener('mouseenter', enterMain)
					})
					portfolioTitle.forEach((item) => {
						item.addEventListener('mouseleave', leaveMain)
					})
					portfolioSection.addEventListener('mousemove', moveContainer)
				}
			})
		})
}
