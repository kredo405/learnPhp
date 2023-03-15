document.addEventListener('DOMContentLoaded', function(event) { 
  /// select active menu
  const h2 = document.getElementsByClassName('post-info__title')[0].innerHTML;
  const pageTitle = clearData(h2.replace('Глава', ''));
	
	const menuLinks = document.querySelectorAll('.side-menu__inner-item a');
  for (i = 0; i < menuLinks.length; ++i) {
	const linkTitle = clearData(menuLinks[i].innerHTML);

	if (pageTitle == linkTitle) {
		console.log(linkTitle); 
		
		let li = menuLinks[i].parentElement;
		if (li.parentElement.classList.contains('side-menu__inner-list--second')) {
			li.classList.add('side-menu__inner-item--current');
			li = li.parentElement.parentElement;
		}

		li.classList.add('side-menu__inner-item--current');
		li.parentElement.parentElement.classList.add(activeItemClass);
	  
	  break;
	}
  }
  
  /// toggle menu
	
	const menuToggle = document.getElementsByClassName('side-menu__toggle');

	for (let i = 0; i < menuToggle.length; i++) {
		menuToggle[i].addEventListener('click', toggle, false);
	}

	/// hide block
	hideByClass('post-content__wrapper');
	hideByClass('card card--orphus');  

	// closed criteria
	const criteriaToggle = document.getElementsByClassName('criteria__toggle');
	if (criteriaToggle) {
		for (let i = 0; i < criteriaToggle.length; i++) {
			criteriaToggle[i].dataset.state = 'closed';
			criteriaToggle[i].innerText = 'Развернуть все';
		}

		const criteriaOpeneds = document.getElementsByClassName('criteria__item criteria__item--opened');
		while (criteriaOpeneds.length) {
			criteriaOpeneds[0].classList.remove("criteria__item--opened");
		}

		const info = document.getElementsByClassName('criteria__info')
		for (let i = 0; i < info.length; i++) {
			info[i].classList.add('hidden');
		}
	}

});

function hideByClass(className) {
	const postFooter = document.getElementsByClassName(className)[0];
	if (postFooter) postFooter.style.display = 'none';
}

function clearData(str) {
	str = str.replace(/\r?\n|\r/g,' '); // remove enter
	str = str.replaceAll('	', ' '); // remove tab
	str = str.replace(/ +(?= )/g,'');	// remove muliple spaces
  return str.trim();
}

const activeItemClass= 'side-menu__item--active';
function toggle(event) {
	const prev = document.getElementsByClassName(activeItemClass)[0];
	const next = event.target.parentElement; 
	if (prev && prev != next) prev.classList.remove(activeItemClass);
	next.classList.toggle(activeItemClass);                  
}