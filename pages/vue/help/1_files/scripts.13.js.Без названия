'use strict';

(function(document) {

  var body = document.querySelector('body');

  var modals = document.querySelectorAll('.modal');
  [].forEach.call(modals, function(modal, i) {
    modal.dataset.item = i;
  });

  var closeButton;

  // событие для кнопки закрытия
  var closeButtonListener = function(event) {
    event.preventDefault();
    closeModal();
  };

  // событие для клика по оверлею
  var closeOverlayListener = function(event) {
    if (event.target.classList.contains('modal')) {
      closeModal();
    }
  };

  // событие для нажатия на кпнопки клавиатуры
  var keydownListener = function(event) {
    var ESC = 27;
    var LEFT_ARROW = 37;
    var RIGHT_ARROW = 39;

    switch (event.keyCode) {
      case ESC:
        closeModal();
        break;
      case LEFT_ARROW:
        var currentModal = document.querySelector('.modal.open');
        if (+currentModal.dataset.item !== 0) {
          var prevModal = document.querySelector('[data-item="' + (+currentModal.dataset.item - 1) + '"]');
          getModal('#' + prevModal.id);
        }
        break;
      case RIGHT_ARROW:
        var currentModal = document.querySelector('.modal.open');
        if (+currentModal.dataset.item !== modals.length - 1) {
          var nextModal = document.querySelector('[data-item="' + (+currentModal.dataset.item + 1) + '"]');
          getModal('#' + nextModal.id);
        }
        break;
    }
  };

  var closeModal = function() {
    var modals = document.querySelectorAll('.modal');

    [].forEach.call(modals, function(modal) {
      if (modal.classList.contains('open')) {
        modal.style.display = 'none';
        modal.classList.remove('open');
        modal.dispatchEvent(new CustomEvent("ha.modal.close"));
      }
    });

    if ("pushState" in history) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    } else{
      window.location.hash = '';
    }

    body.classList.remove('modal-open');

    var overlay = document.querySelector('.modal-backdrop');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
    }

    closeButton.removeEventListener('click', closeButtonListener);
    document.removeEventListener('click', closeOverlayListener);
    document.removeEventListener('keydown', keydownListener);
  };

  var openModal = function(target) {
    var modal = document.querySelector(target);
    if (!modal || !modal.classList.contains('modal')) {
      return;
    }

    window.location.hash = modal.id;

    body.classList.add('modal-open');

    var overlay = document.createElement('div');
    overlay.className = 'modal-backdrop in';
    overlay.style.zIndex = '4443';

    body.appendChild(overlay);

    modal.style.display = 'block';
    modal.style.zIndex = '4444';
    modal.classList.add('open');

    closeButton = modal.querySelector('[data-dismiss="modal"]');
    if (closeButton) {
      closeButton.addEventListener('click', closeButtonListener);
    }

    document.addEventListener('click', closeOverlayListener);
    document.addEventListener('keydown', keydownListener);

  };

  var modalList = document.querySelectorAll('.modal');
  if (modalList && modalList.length > 0) {
    [].forEach.call(modalList, function(modalItem, i, modalListArr) {
      var nextButton = modalItem.querySelector('[data-action="next"]');
      var prevButton = modalItem.querySelector('[data-action="prev"]');
      if (nextButton) {
        if (i + 1 === modalListArr.length) {
          nextButton.parentNode.removeChild(nextButton);
        } else {
          nextButton.addEventListener('click', function(event) {
            event.preventDefault();
            getModal('#' + modalListArr[i + 1].id);
          });
        }
      }
      if (prevButton) {
        if (i === 0) {
          prevButton.parentNode.removeChild(prevButton);
        } else {
          prevButton.addEventListener('click', function(event) {
            event.preventDefault();
            getModal('#' + modalListArr[i - 1].id);
          });
        }
      }
    });
  }

  var getModal = function(target) {
    closeModal();
    openModal(target);
  };

  var openButtons = document.querySelectorAll('[data-toggle="modal"]');
  if (openButtons && openButtons.length > 0) {
    [].forEach.call(openButtons, function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.dataset.target) {
          return;
        }

        openModal(this.dataset.target);
      });
    });
  }

  if (window.location.hash !== '') {
    openModal(window.location.hash);
  }

  var toggleDropdown = function(button) {
    if (button.getAttribute('aria-expanded') === 'true') {
      button.parentNode.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    } else {
      button.parentNode.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  };

  var dropdown = document.querySelectorAll('.dropdown-toggle');
  if (dropdown && dropdown.length > 0) {
    [].forEach.call(dropdown, function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        toggleDropdown(button);
      });
      var items = button.parentNode.querySelectorAll('.dropdown-item');
      [].forEach.call(items, function(item) {
        item.addEventListener('click', function () {
          toggleDropdown(button);
        })
      });
    });
  }

  var tabs = document.querySelectorAll('[data-tablink]');
  if (tabs && tabs.length > 0) {
    [].forEach.call(tabs, function(tab) {
      tab.addEventListener('click', function(event) {
        if (this.getAttribute('href')[0] !== '#') {
          event.preventDefault();
        }
        var allTabs = this.parentNode.parentNode.querySelectorAll('[data-tablink]');
        [].forEach.call(allTabs, function(item) {
          item.classList.remove('active');
        });
        this.classList.add('active');
        var content = document.querySelector('[data-tabcontent="' + this.dataset.tablink + '"]');
        var allContent = content.parentNode.querySelectorAll('[data-tabcontent]');
        [].forEach.call(allContent, function(item) {
          item.setAttribute('hidden', 'hidden');
        });
        content.removeAttribute('hidden', null);
      });
    });
  }

  var toggles = document.querySelectorAll('[data-togglebutton]');
  if (toggles && toggles.length > 0) {
    [].forEach.call(toggles, function(toggle) {
      if (toggle.dataset.togglebutton) {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          var blocks = document.querySelectorAll('[data-toggleblock="'+ toggle.dataset.togglebutton +'"]');
          if (blocks) {
            [].forEach.call(blocks, function (block) {
              if (block.hasAttribute('hidden')) {
                block.removeAttribute('hidden');
              } else {
                block.setAttribute('hidden', '');
              }
            });
            if (toggle.dataset.toggletext) {
              var text = toggle.textContent;
              toggle.textContent = toggle.dataset.toggletext;
              toggle.dataset.toggletext = text;
            }
          }
        });
      }
    });
  }

  var request = function(url, fn, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'get', url);

    if (method === 'post') {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener('readystatechange', function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return fn(JSON.parse(xhr.responseText));
        } else {
          return fn(false);
        }
      }
    });
    xhr.send(data || null);
  };

  function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  var statuses = document.querySelectorAll('[data-status]');
  if (statuses && statuses.length > 0) {
    [].forEach.call(statuses, function(status) {
      var obj = {};
      for (var key in status.dataset) {
        if (key !== 'status' && key.indexOf('status') === 0) {
          obj[lowercaseFirstLetter(key.replace('status', ''))] = status.dataset[key];
        }
      }
      if (status.dataset.status && Object.keys(obj).length > 0) {
        var t = window.setInterval(function() {
          request(status.dataset.status, function(result) {
            if (!result || !result.status || result.status !== 'success') {
              window.clearInterval(t);
              return
            }
            if (!result.data) {
              return;
            }
            for (var key in obj) {
              if (result.data[key] && obj[key] !== result.data[key]) {
                window.clearInterval(t);
                window.location.reload(true);
                break;
              }
            }
          })
        }, 2000);
      }
    });
  }

  var increaseInput = document.querySelector('.increase_form #amount');
  var increasePrice = document.querySelector('.increase_form #price');
  if (increaseInput && increasePrice) {
    var singleIncreasePrice = parseInt(increasePrice.dataset.price, 10);
    increaseInput.addEventListener('input', function (e) {
      var amount = Math.abs(parseInt(increaseInput.value, 10));
      if (amount) {
          increasePrice.innerText = singleIncreasePrice * amount;
      }
    });
  }

})(document);
