/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars	
{
  'use strict';
  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
      filters: '.filters',
    },
  };
  const classNames = {
    favouriteBook: 'favorite',
    hidden: 'hidden',
    bookImage: 'book__image',
  };
  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };
  class BooksList {
    constructor() {
      const thisBooksList = this;
      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
      thisBooksList.determineRatingBgc();
    }
    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }
    getElements() {
      const thisBooksList = this;
      thisBooksList.menuContainer = document.querySelector(select.containerOf.bookList);
      thisBooksList.filterWrapper = document.querySelector(select.containerOf.filters);
      thisBooksList.favouriteBooks = [];
      thisBooksList.filtersList = [];
    }
    render() {
      const thisBooksList = this;
      for (let book of thisBooksList.data) {
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.bookTemplate(book);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.menuContainer.appendChild(generatedDOM);
      }
    }
    initActions() {
      const thisBooksList = this;
      thisBooksList.bookImage = document.querySelectorAll('.book__image');
      thisBooksList.menuContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const clickedElement = event.target.offsetParent;
        if (clickedElement.classList.contains(classNames.bookImage)) {
          if (!clickedElement.classList.contains(classNames.favouriteBook)) {
            clickedElement.classList.add(classNames.favouriteBook);
            const favbooks = clickedElement.getAttribute('data-id');
            thisBooksList.favouriteBooks.push(favbooks);
            console.log(thisBooksList.favouriteBooks);
          } else {
            clickedElement.classList.remove(classNames.favouriteBook);
            const favbooks = clickedElement.getAttribute('data-id');
            const index = thisBooksList.favouriteBooks.indexOf(favbooks);
            thisBooksList.favouriteBooks.splice(index, 1);
            console.log(thisBooksList.favouriteBooks);
          }
        }
      });
      thisBooksList.filterWrapper.addEventListener('click', function (event) {
        const clickedElementTwo = event.target;
        if (clickedElementTwo.tagName === 'INPUT', clickedElementTwo.type === 'checkbox', clickedElementTwo.name === 'filter') {
          if (clickedElementTwo.checked) {
            thisBooksList.filtersList.push(clickedElementTwo.value);
            console.log(thisBooksList.filtersList);
            thisBooksList.filter();
          } else {
            const indexTwo = thisBooksList.filtersList.indexOf(clickedElementTwo.value);
            thisBooksList.filtersList.splice(indexTwo, 1);
            console.log(thisBooksList.filtersList);
            thisBooksList.filter();
          }
        }
      });
    }
    filter() {
      const thisBooksList = this;
      for (let book of thisBooksList.data) {
        const bookToBeHidden = document.querySelector('.book__image[data-id="' + book.id + '"]');
        let shouldBeHidden = false;
        for (let filter of thisBooksList.filtersList) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          bookToBeHidden.classList.add(classNames.hidden);
        } else {
          bookToBeHidden.classList.remove(classNames.hidden);
        }
      }
    }
    determineRatingBgc(rating) {
      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      }
      if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      }
      if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      }
      if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
      return background;
    }
  }

  const app = {
    initProject: function () {
      new BooksList();
    }
  };
  app.initProject();
}
