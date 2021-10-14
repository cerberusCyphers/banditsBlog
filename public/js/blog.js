const likeContainer = (child, parentSelector) => {
	if (child.tagName == 'HTML') return undefined;
	const parent = child.parentNode;
	if (
		parent.classList.contains(parentSelector) ||
		child.classList.contains(parentSelector)
	) {
		return parent;
	} else {
		return likeContainer(parent, parentSelector);
	}
};

const likeClickHandler = e => {
	console.log(e.target.tagName);
	const likeParent = likeContainer(e.target, 'card__like');
	if (likeParent) {
		const likeCounter = likeParent.querySelector('sup');
		let likes = parseInt(likeCounter.innerText);
		likes++;
		likeCounter.innerText = likes;

		const thumb = likeParent.getElementsByTagName('ion-icon')[0];
		thumb.setAttribute('name', 'thumbs-up');
	}
};

document.addEventListener('click', likeClickHandler, false);

// ----------------------------------------------------------------------- //

//! Function only runs when clicking i element - doesn't register on ion-icon element
// const clickLikeHandler = event => {
// 	if (event.target.parentNode.classList.contains('card__like')) {
// 		console.log(event.target);
// 		const likeCounter = event.target.parentNode.getElementsByTagName('sup')[0];
// 		let likes = parseInt(likeCounter.innerText);
// 		likes++;
// 		likeCounter.innerText = likes;
// 		console.log(likes);

// 		const thumb = event.target.parentNode.getElementsByTagName('i')[0];
// 		thumb.innerHTML = '<ion-icon name="thumbs-up"></ion-icon>';
// 	}
// };

// document.addEventListener('click', clickLikeHandler, false);

// ----------------------------------------------------------------------- //

//! Only works on first instance & querySelectorAll errors as not a function
// const thumb = document.querySelector('.blog__like--thumb');
// const counter = document.querySelector('.blog__like--counter');

// const likeClickHandler = e => {
// 	e.preventDefault();
// 	let likes = parseInt(counter.innerText);
// 	likes++;
// 	counter.innerText = likes;

// 	thumb.setAttribute('name', 'thumbs-up');
// 	thumb.classList.replace('blog__like--thumb', 'blog__like--clicked');
// 	console.log(thumb, likes);
// };

// document.addEventListener('click', likeClickHandler);

// ----------------------------------------------------------------------- //

//              div

//    i                       sup

// ion-icon
