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
		thumb.setAttribute('name', 'paw');
	}
};

document.addEventListener('click', likeClickHandler, false);
