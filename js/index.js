const subtitleArr = document.querySelectorAll('.subtitle_wrapper');

subtitleArr.forEach(el => {
    el.addEventListener('click', (e) => {
        if (e.target.parentElement.classList.contains('subtitle_wrapper')) {
            if (e.target.parentElement.nextElementSibling.classList.contains('hidden')) {
                e.target.parentElement.nextElementSibling.classList.remove('hidden');
                e.target.parentElement.nextElementSibling.classList.add('block');
            } else {
                e.target.parentElement.nextElementSibling.classList.remove('block');
                e.target.parentElement.nextElementSibling.classList.add('hidden');
            }
        } else {
            if (e.target.nextElementSibling.classList.contains('hidden')) {
                e.target.nextElementSibling.classList.remove('hidden');
                e.target.nextElementSibling.classList.add('block');
            } else {
                e.target.nextElementSibling.classList.remove('block');
                e.target.nextElementSibling.classList.add('hidden');
            }
        }
    });
})

